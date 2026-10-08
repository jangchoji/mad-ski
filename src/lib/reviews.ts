import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";

const CUSTOMERS_TABLE = process.env.SUPABASE_REVIEW_CUSTOMERS_TABLE ?? "review_customers";
const REVIEWS_TABLE = process.env.SUPABASE_CUSTOMER_REVIEWS_TABLE ?? "customer_reviews";
const R2_ACCOUNT_ID_PATTERN = /^[a-f0-9]{32}$/i;

type ReviewCustomerRow = {
  id: string;
  name: string;
  phone: string | null;
  memo: string | null;
  login_id: string;
  password_cipher: string | null;
  created_at: string;
};

type CustomerReviewRow = {
  id: string;
  author_name: string;
  content: string;
  image_url: string | null;
  created_at: string;
};

export type ReviewCustomer = {
  id: string;
  name: string;
  phone: string;
  memo: string;
  loginId: string;
  password: string;
  createdAt: number;
};

export type CustomerReview = {
  id: string;
  authorName: string;
  content: string;
  imageUrl: string | null;
  createdAt: number;
};

export class ReviewError extends Error {
  constructor(
    public readonly step: "auth" | "r2" | "supabase" | "validation",
    cause?: unknown,
  ) {
    super(`Review failed at ${step}`);
    this.name = "ReviewError";
    this.cause = cause;
  }
}

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

const isSupabaseConfigured = () =>
  Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

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

export const hashReviewPassword = (password: string) => {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");

  return `scrypt$${salt}$${hash}`;
};

const getPasswordCipherKey = () =>
  createHash("sha256")
    .update(process.env.ADMIN_SESSION_SECRET ?? "")
    .digest();

const encryptReviewPassword = (password: string) => {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getPasswordCipherKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(password, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [
    "aes-256-gcm",
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted.toString("hex"),
  ].join("$");
};

const decryptReviewPassword = (cipherText: string | null) => {
  if (!cipherText) {
    return "";
  }

  try {
    const [scheme, iv, authTag, encrypted] = cipherText.split("$");

    if (scheme !== "aes-256-gcm" || !iv || !authTag || !encrypted) {
      return "";
    }

    const decipher = createDecipheriv(
      "aes-256-gcm",
      getPasswordCipherKey(),
      Buffer.from(iv, "hex"),
    );
    decipher.setAuthTag(Buffer.from(authTag, "hex"));

    return Buffer.concat([
      decipher.update(Buffer.from(encrypted, "hex")),
      decipher.final(),
    ]).toString("utf8");
  } catch {
    return "";
  }
};

const verifyReviewPassword = (password: string, storedHash: string) => {
  const [scheme, salt, hash] = storedHash.split("$");

  if (scheme !== "scrypt" || !salt || !hash) {
    return false;
  }

  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, 64);

  return expected.length === actual.length && timingSafeEqual(expected, actual);
};

export const createReviewCustomer = async ({
  name,
  phone,
  memo,
  loginId,
  password,
}: {
  name: string;
  phone: string;
  memo: string;
  loginId: string;
  password: string;
}) => {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from(CUSTOMERS_TABLE).insert({
    name,
    phone: phone || null,
    memo: memo || null,
    login_id: loginId,
    password_hash: hashReviewPassword(password),
    password_cipher: encryptReviewPassword(password),
  });

  if (error) {
    throw new ReviewError("supabase", error);
  }
};

export const getReviewCustomers = async (): Promise<ReviewCustomer[]> => {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(CUSTOMERS_TABLE)
    .select("id,name,phone,memo,login_id,password_cipher,created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) {
    return [];
  }

  return (data as ReviewCustomerRow[]).map((customer) => ({
    id: customer.id,
    name: customer.name,
    phone: customer.phone ?? "",
    memo: customer.memo ?? "",
    loginId: customer.login_id,
    password: decryptReviewPassword(customer.password_cipher),
    createdAt: new Date(customer.created_at).getTime(),
  }));
};

export const verifyReviewCustomerLogin = async (
  loginId: string,
  password: string,
) => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(CUSTOMERS_TABLE)
    .select("id,name,login_id,password_hash")
    .eq("login_id", loginId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const customer = data as {
    id: string;
    name: string;
    login_id: string;
    password_hash: string;
  };

  if (!verifyReviewPassword(password, customer.password_hash)) {
    return null;
  }

  return {
    id: customer.id,
    name: customer.name,
    loginId: customer.login_id,
  };
};

export const getReviewCustomerById = async (id: string) => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(CUSTOMERS_TABLE)
    .select("id,name,login_id")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const customer = data as { id: string; name: string; login_id: string };

  return {
    id: customer.id,
    name: customer.name,
    loginId: customer.login_id,
  };
};

export const createCustomerReview = async ({
  customerId,
  authorName,
  content,
  image,
}: {
  customerId: string;
  authorName: string;
  content: string;
  image?: {
    bytes: Buffer;
    contentType: string;
    extension: string;
    originalName: string;
  };
}) => {
  let imageKey: string | null = null;
  let imageUrl: string | null = null;

  if (image) {
    const uploadedAt = Date.now();
    imageKey = `reviews/${new Date(uploadedAt).toISOString().slice(0, 10)}/${uploadedAt}-${image.originalName}.${image.extension}`;
    imageUrl = getR2PublicUrl(imageKey);

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
      throw new ReviewError("r2", error);
    }
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from(REVIEWS_TABLE).insert({
    customer_id: customerId,
    author_name: authorName,
    content,
    image_key: imageKey,
    image_url: imageUrl,
  });

  if (error) {
    throw new ReviewError("supabase", error);
  }
};

export const getPublishedReviews = async (): Promise<CustomerReview[]> => {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(REVIEWS_TABLE)
    .select("id,author_name,content,image_url,created_at")
    .eq("is_visible", true)
    .order("created_at", { ascending: false })
    .limit(12);

  if (error || !data) {
    return [];
  }

  return (data as CustomerReviewRow[]).map((review) => ({
    id: review.id,
    authorName: review.author_name,
    content: review.content,
    imageUrl: review.image_url,
    createdAt: new Date(review.created_at).getTime(),
  }));
};
