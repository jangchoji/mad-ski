import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";

const POPUP_ADS_TABLE = process.env.SUPABASE_POPUP_ADS_TABLE ?? "popup_ads";
const R2_ACCOUNT_ID_PATTERN = /^[a-f0-9]{32}$/i;

type PopupAdRow = {
  id: string;
  image_key: string;
  image_url: string;
  link_url?: string | null;
  created_at: string;
};

export type PopupAd = {
  id: string;
  imageKey: string;
  imageUrl: string;
  linkUrl: string | null;
  createdAt: number;
};

export class PopupAdError extends Error {
  constructor(
    public readonly step: "r2" | "supabase" | "validation" | "popupLink",
    cause?: unknown,
  ) {
    super(`Popup ad failed at ${step}`);
    this.name = "PopupAdError";
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

const mapPopupAd = (ad: PopupAdRow): PopupAd => ({
  id: ad.id,
  imageKey: ad.image_key,
  imageUrl: ad.image_url,
  linkUrl: normalizePopupLink(ad.link_url),
  createdAt: new Date(ad.created_at).getTime(),
});

export const normalizePopupLink = (value?: string | null): string | null => {
  const trimmed = value?.trim();

  if (!trimmed) {
    return null;
  }

  try {
    const hasScheme = /^[a-z][a-z\d+.-]*:/i.test(trimmed);
    const url = new URL(
      hasScheme ? trimmed : `https://${trimmed.replace(/^\/\//, "")}`,
    );

    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) {
      throw new Error("Invalid popup link");
    }

    return url.href;
  } catch {
    throw new PopupAdError("popupLink");
  }
};

const deletePopupImage = async (imageKey: string) => {
  try {
    await getR2Client().send(
      new DeleteObjectCommand({
        Bucket: getR2Bucket(),
        Key: imageKey,
      }),
    );
  } catch (error) {
    throw new PopupAdError("r2", error);
  }
};

export const createPopupAd = async (
  image: {
    bytes: Buffer;
    contentType: string;
    extension: string;
    originalName: string;
  },
  link?: string | null,
) => {
  const linkUrl = normalizePopupLink(link);
  if (!image.bytes.length) {
    throw new PopupAdError("validation");
  }

  const uploadedAt = Date.now();
  const imageKey = `popup-ads/${new Date(uploadedAt).toISOString().slice(0, 10)}/${uploadedAt}-${image.originalName}.${image.extension}`;

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
    throw new PopupAdError("r2", error);
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from(POPUP_ADS_TABLE).insert({
    image_key: imageKey,
    image_url: getR2PublicUrl(imageKey),
    link_url: linkUrl,
  });

  if (error) {
    await deletePopupImage(imageKey);
    throw new PopupAdError("supabase", error);
  }
};

export const updatePopupAdLink = async (id: string, link: string | null) => {
  if (!id) {
    throw new PopupAdError("validation");
  }

  const linkUrl = normalizePopupLink(link);
  const { data, error } = await getSupabaseAdmin()
    .from(POPUP_ADS_TABLE)
    .update({ link_url: linkUrl })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    throw new PopupAdError("supabase", error);
  }
};

export const deletePopupAds = async (ids: string[]) => {
  const uniqueIds = [...new Set(ids)].filter(Boolean);

  if (!uniqueIds.length) {
    return 0;
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(POPUP_ADS_TABLE)
    .select("id,image_key")
    .in("id", uniqueIds);

  if (error || !data?.length) {
    throw new PopupAdError("supabase", error);
  }

  await Promise.all(data.map((ad) => deletePopupImage(ad.image_key)));

  const { error: deleteError } = await supabase
    .from(POPUP_ADS_TABLE)
    .delete()
    .in(
      "id",
      data.map((ad) => ad.id),
    );

  if (deleteError) {
    throw new PopupAdError("supabase", deleteError);
  }

  return data.length;
};

export const getPopupAds = async (limit = 12): Promise<PopupAd[]> => {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(POPUP_ADS_TABLE)
    .select("*")
    .eq("is_visible", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return (data as PopupAdRow[]).map(mapPopupAd);
};

export const getActivePopupAd = async () => {
  const [popupAd] = await getPopupAds(1);

  return popupAd ?? null;
};
