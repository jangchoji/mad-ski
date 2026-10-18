import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";

const NOTICES_TABLE = process.env.SUPABASE_NOTICES_TABLE ?? "notices";
const R2_ACCOUNT_ID_PATTERN = /^[a-f0-9]{32}$/i;

type NoticeRow = {
  id: string;
  title: string;
  content: string;
  image_key: string | null;
  image_url: string | null;
  created_at: string;
};

export type Notice = {
  id: string;
  title: string;
  content: string;
  imageKey: string | null;
  imageUrl: string | null;
  createdAt: number;
};

export class NoticeError extends Error {
  constructor(
    public readonly step: "r2" | "supabase" | "validation",
    cause?: unknown,
  ) {
    super(`Notice failed at ${step}`);
    this.name = "NoticeError";
    this.cause = cause;
  }
}

const isSupabaseConfigured = () =>
  Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

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

const getR2Client = () => {
  const accountId = getR2AccountId();
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

const getR2Bucket = () => {
  const bucket = process.env.R2_BUCKET;

  if (!bucket) {
    throw new Error("R2_BUCKET environment variable is missing.");
  }

  return bucket;
};

const getR2PublicUrl = (imageKey: string) => {
  const publicUrl = process.env.R2_PUBLIC_URL;

  if (!publicUrl) {
    throw new Error("R2_PUBLIC_URL environment variable is missing.");
  }

  return `${publicUrl.replace(/\/$/, "")}/${imageKey}`;
};

const mapNotice = (notice: NoticeRow): Notice => ({
  id: notice.id,
  title: notice.title,
  content: notice.content,
  imageKey: notice.image_key,
  imageUrl: notice.image_url,
  createdAt: new Date(notice.created_at).getTime(),
});

const uploadNoticeImage = async (image: {
  bytes: Buffer;
  contentType: string;
  extension: string;
  originalName: string;
}) => {
  const uploadedAt = Date.now();
  const imageKey = `notices/${new Date(uploadedAt).toISOString().slice(0, 10)}/${uploadedAt}-${image.originalName}.${image.extension}`;

  try {
    await getR2Client().send(
      new PutObjectCommand({
        Bucket: getR2Bucket(),
        Key: imageKey,
        Body: image.bytes,
        ContentType: image.contentType,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
  } catch (error) {
    throw new NoticeError("r2", error);
  }

  return {
    imageKey,
    imageUrl: getR2PublicUrl(imageKey),
  };
};

const deleteNoticeImage = async (imageKey: string) => {
  try {
    await getR2Client().send(
      new DeleteObjectCommand({
        Bucket: getR2Bucket(),
        Key: imageKey,
      }),
    );
  } catch (error) {
    throw new NoticeError("r2", error);
  }
};

export const createNotice = async ({
  title,
  content,
  image,
}: {
  title: string;
  content: string;
  image?: {
    bytes: Buffer;
    contentType: string;
    extension: string;
    originalName: string;
  };
}) => {
  if (!title || !content) {
    throw new NoticeError("validation");
  }

  const uploadedImage = image ? await uploadNoticeImage(image) : null;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from(NOTICES_TABLE).insert({
    title,
    content,
    image_key: uploadedImage?.imageKey ?? null,
    image_url: uploadedImage?.imageUrl ?? null,
  });

  if (error) {
    if (uploadedImage) {
      await deleteNoticeImage(uploadedImage.imageKey);
    }
    throw new NoticeError("supabase", error);
  }
};

export const updateNotice = async ({
  id,
  title,
  content,
  image,
}: {
  id: string;
  title: string;
  content: string;
  image?: {
    bytes: Buffer;
    contentType: string;
    extension: string;
    originalName: string;
  };
}) => {
  if (!id || !title || !content) {
    throw new NoticeError("validation");
  }

  const supabase = getSupabaseAdmin();
  const { data: currentNotice, error: selectError } = await supabase
    .from(NOTICES_TABLE)
    .select("id,image_key")
    .eq("id", id)
    .maybeSingle();

  if (selectError || !currentNotice) {
    throw new NoticeError("supabase", selectError);
  }

  const uploadedImage = image ? await uploadNoticeImage(image) : null;
  const updateValues: {
    title: string;
    content: string;
    image_key?: string;
    image_url?: string;
  } = {
    title,
    content,
  };

  if (uploadedImage) {
    updateValues.image_key = uploadedImage.imageKey;
    updateValues.image_url = uploadedImage.imageUrl;
  }

  const { error } = await supabase
    .from(NOTICES_TABLE)
    .update(updateValues)
    .eq("id", id);

  if (error) {
    if (uploadedImage) {
      await deleteNoticeImage(uploadedImage.imageKey);
    }
    throw new NoticeError("supabase", error);
  }

  const oldImageKey = currentNotice.image_key;

  if (uploadedImage && oldImageKey && oldImageKey !== uploadedImage.imageKey) {
    try {
      await deleteNoticeImage(oldImageKey);
    } catch (error) {
      console.error("Failed to delete replaced notice image", error);
    }
  }
};

export const deleteNotices = async (ids: string[]) => {
  const uniqueIds = [...new Set(ids)].filter(Boolean);

  if (!uniqueIds.length) {
    return 0;
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(NOTICES_TABLE)
    .select("id,image_key")
    .in("id", uniqueIds);

  if (error || !data?.length) {
    throw new NoticeError("supabase", error);
  }

  const imageKeys = data
    .map((notice) => notice.image_key)
    .filter((key): key is string => Boolean(key));

  if (imageKeys.length) {
    await Promise.all(imageKeys.map(deleteNoticeImage));
  }

  const { error: deleteError } = await supabase
    .from(NOTICES_TABLE)
    .delete()
    .in(
      "id",
      data.map((notice) => notice.id),
    );

  if (deleteError) {
    throw new NoticeError("supabase", deleteError);
  }

  return data.length;
};

export const getPublishedNotices = async (limit = 6): Promise<Notice[]> => {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(NOTICES_TABLE)
    .select("id,title,content,image_key,image_url,created_at")
    .eq("is_visible", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return (data as NoticeRow[]).map(mapNotice);
};

export const getPublishedNoticeById = async (
  id: string,
): Promise<Notice | null> => {
  if (!isSupabaseConfigured() || !id) {
    return null;
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(NOTICES_TABLE)
    .select("id,title,content,image_key,image_url,created_at")
    .eq("id", id)
    .eq("is_visible", true)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapNotice(data as NoticeRow);
};

// Fetch all public IDs in pages; the homepage query intentionally returns only six notices.
export const getPublishedNoticeIds = async (): Promise<string[]> => {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabaseAdmin();
  const ids: string[] = [];
  const pageSize = 500;
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await supabase
      .from(NOTICES_TABLE)
      .select("id")
      .eq("is_visible", true)
      .order("id", { ascending: true })
      .range(offset, offset + pageSize - 1);
    if (error) throw new NoticeError("supabase", error);
    ids.push(...data.map((notice) => notice.id));
    if (data.length < pageSize) return ids;
  }
};
