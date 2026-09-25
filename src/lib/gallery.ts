import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";

const GALLERY_TABLE = process.env.SUPABASE_GALLERY_TABLE ?? "gallery_photos";

type GalleryPhotoRow = {
  id: string;
  image_key: string;
  image_url: string;
  alt: string | null;
  created_at: string;
};

export type GalleryImage = {
  src: string;
  alt: string;
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
    process.env.R2_ACCOUNT_ID &&
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
  const accountId = process.env.R2_ACCOUNT_ID?.trim()
    .replace(/^https?:\/\//, "")
    .replace(/\.r2\.cloudflarestorage\.com\/?$/, "")
    .replace(/\/.*$/, "");
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 environment variables are missing.");
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

export const createGalleryImage = async ({
  bytes,
  contentType,
  extension,
  originalName,
}: {
  bytes: Buffer;
  contentType: string;
  extension: string;
  originalName: string;
}) => {
  const bucket = process.env.R2_BUCKET;

  if (!bucket) {
    throw new Error("R2_BUCKET environment variable is missing.");
  }

  const imageKey = `gallery/${new Date().toISOString().slice(0, 10)}/${Date.now()}-${originalName}.${extension}`;
  const imageUrl = getR2PublicUrl(imageKey);
  const r2 = getR2Client();

  try {
    await r2.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: imageKey,
        Body: bytes,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
  } catch (error) {
    throw new GalleryUploadError("r2", error);
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from(GALLERY_TABLE).insert({
    image_key: imageKey,
    image_url: imageUrl,
    alt: "MAD INTER SKI in 비발디파크 현장 사진",
  });

  if (error) {
    throw new GalleryUploadError("supabase", error);
  }
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
    src: image.image_url,
    alt: image.alt ?? "MAD INTER SKI in 비발디파크 현장 사진",
    fileName: image.image_key.split("/").at(-1) ?? image.id,
    uploadedAt: new Date(image.created_at).getTime(),
  }));
};
