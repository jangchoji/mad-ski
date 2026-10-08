import {
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";

const GALLERY_TABLE = process.env.SUPABASE_GALLERY_TABLE ?? "gallery_photos";
const R2_ACCOUNT_ID_PATTERN = /^[a-f0-9]{32}$/i;

type GalleryPhotoRow = {
  id: string;
  image_key: string;
  image_url: string;
  alt: string | null;
  created_at: string;
};

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  imageKey: string;
  fileName: string;
  uploadedAt: number;
};

export class GalleryUploadError extends Error {
  constructor(
    public readonly step: "r2" | "supabase",
    cause: unknown,
  ) {
    super(`Gallery upload failed at ${step}`);
    this.name = "GalleryUploadError";
    this.cause = cause;
  }
}

export const isSupabaseConfigured = () =>
  Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

export const isR2Configured = () =>
  Boolean(
    getR2AccountId() &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET &&
      process.env.R2_PUBLIC_URL,
  );

export const isGalleryStorageConfigured = () =>
  isSupabaseConfigured() && isR2Configured();

export const getMissingGalleryEnvironmentVariables = () =>
  [
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "R2_ACCOUNT_ID",
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
    "R2_BUCKET",
    "R2_PUBLIC_URL",
  ].filter((key) => !process.env[key]);

export const getGalleryStorageConfigurationIssues = () => {
  const issues = getMissingGalleryEnvironmentVariables().map(
    (key) => `${key} 환경변수가 없습니다.`,
  );

  if (process.env.R2_ACCOUNT_ID && !getR2AccountId()) {
    issues.push(
      "R2_ACCOUNT_ID는 Cloudflare 계정의 32자 Account ID여야 합니다. custom domain, bucket URL, r2.dev URL은 R2_PUBLIC_URL에만 사용하세요.",
    );
  }

  return issues;
};

const getR2AccountId = () => {
  const accountId = process.env.R2_ACCOUNT_ID?.trim()
    .replace(/^https?:\/\//, "")
    .replace(/\.r2\.cloudflarestorage\.com\/?$/, "")
    .replace(/\/.*$/, "");

  if (!accountId || !R2_ACCOUNT_ID_PATTERN.test(accountId)) {
    return null;
  }

  return accountId;
};

const getSupabaseAdmin = () => {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase admin environment variables are missing.");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

const getR2Client = () => {
  const accountId = getR2AccountId();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    throw new Error("R2 environment variables are missing.");
  }

  if (!accountId) {
    throw new Error(
      "R2_ACCOUNT_ID must be the 32-character Cloudflare account ID, not a custom domain or bucket URL.",
    );
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    forcePathStyle: true,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
};

const getR2PublicUrl = (imageKey: string) => {
  const publicUrl = process.env.R2_PUBLIC_URL;

  if (!publicUrl) {
    throw new Error("R2_PUBLIC_URL environment variable is missing.");
  }

  return `${publicUrl.replace(/\/$/, "")}/${imageKey}`;
};

const getR2Bucket = () => {
  const bucket = process.env.R2_BUCKET;

  if (!bucket) {
    throw new Error("R2_BUCKET environment variable is missing.");
  }

  return bucket;
};

type NewGalleryImage = {
  bytes: Buffer;
  contentType: string;
  extension: string;
  originalName: string;
};

export const createGalleryImages = async (images: NewGalleryImage[]) => {
  if (!images.length) {
    return 0;
  }

  const bucket = getR2Bucket();
  const r2 = getR2Client();
  const uploadedAt = Date.now();
  const uploadDate = new Date(uploadedAt).toISOString().slice(0, 10);

  const uploadResults = await Promise.allSettled(
    images.map(async (image, index) => {
      const imageKey = `gallery/${uploadDate}/${uploadedAt + index}-${image.originalName}.${image.extension}`;

      await r2.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: imageKey,
          Body: image.bytes,
          ContentType: image.contentType,
          CacheControl: "public, max-age=31536000, immutable",
        }),
      );

      return {
        image_key: imageKey,
        image_url: getR2PublicUrl(imageKey),
        alt: "MAD INTER SKI in 비발디파크 현장 사진",
      };
    }),
  );

  const uploadedRows = uploadResults
    .filter(
      (result): result is PromiseFulfilledResult<{
        image_key: string;
        image_url: string;
        alt: string;
      }> => result.status === "fulfilled",
    )
    .map((result) => result.value);

  if (!uploadedRows.length) {
    const firstFailure = uploadResults.find(
      (result): result is PromiseRejectedResult => result.status === "rejected",
    );
    throw new GalleryUploadError("r2", firstFailure?.reason);
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from(GALLERY_TABLE).insert(uploadedRows);

  if (error) {
    throw new GalleryUploadError("supabase", error);
  }

  return uploadedRows.length;
};

export const deleteGalleryImages = async (ids: string[]) => {
  const uniqueIds = [...new Set(ids)].filter(Boolean);

  if (!uniqueIds.length) {
    return 0;
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(GALLERY_TABLE)
    .select("id,image_key")
    .in("id", uniqueIds);

  if (error || !data?.length) {
    throw new GalleryUploadError("supabase", error);
  }

  const bucket = getR2Bucket();
  const r2 = getR2Client();

  try {
    const result = await r2.send(
      new DeleteObjectsCommand({
        Bucket: bucket,
        Delete: {
          Objects: data.map((image) => ({ Key: image.image_key })),
          Quiet: true,
        },
      }),
    );

    if (result.Errors?.length) {
      throw new Error(
        `R2 delete failed for ${result.Errors.length} object(s).`,
      );
    }
  } catch (error) {
    throw new GalleryUploadError("r2", error);
  }

  const { error: deleteError } = await supabase
    .from(GALLERY_TABLE)
    .delete()
    .in(
      "id",
      data.map((image) => image.id),
    );

  if (deleteError) {
    throw new GalleryUploadError("supabase", deleteError);
  }

  return data.length;
};

export const getGalleryImages = async (): Promise<GalleryImage[]> => {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(GALLERY_TABLE)
    .select("id,image_key,image_url,alt,created_at")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(24);

  if (error || !data) {
    return [];
  }

  return (data as GalleryPhotoRow[]).map((image) => ({
    id: image.id,
    src: image.image_url,
    alt: image.alt ?? "MAD INTER SKI in 비발디파크 현장 사진",
    imageKey: image.image_key,
    fileName: image.image_key.split("/").at(-1) ?? image.id,
    uploadedAt: new Date(image.created_at).getTime(),
  }));
};
