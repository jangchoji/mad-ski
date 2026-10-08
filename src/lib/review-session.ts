import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getReviewCustomerById } from "@/lib/reviews";

const REVIEW_COOKIE = "mad_review_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 14;

const getSessionSecret = () => process.env.ADMIN_SESSION_SECRET ?? "";

const sign = (value: string) =>
  createHmac("sha256", getSessionSecret()).update(value).digest("hex");

const safeEqual = (a: string, b: string) => {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
};

export const setReviewSession = async (customerId: string) => {
  const cookieStore = await cookies();

  cookieStore.set({
    name: REVIEW_COOKIE,
    value: `${customerId}.${sign(customerId)}`,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/review",
    maxAge: SESSION_MAX_AGE,
  });
};

export const clearReviewSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(REVIEW_COOKIE);
};

export const getReviewSessionCustomer = async () => {
  if (!getSessionSecret()) {
    return null;
  }

  const cookieStore = await cookies();
  const raw = cookieStore.get(REVIEW_COOKIE)?.value;

  if (!raw) {
    return null;
  }

  const [customerId, signature] = raw.split(".");

  if (!customerId || !signature || !safeEqual(signature, sign(customerId))) {
    return null;
  }

  return getReviewCustomerById(customerId);
};
