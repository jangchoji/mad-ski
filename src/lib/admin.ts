import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "mad_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 8;

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

export const isAdminConfigured = () =>
  Boolean(
    process.env.ADMIN_ID &&
      process.env.ADMIN_PASSWORD &&
      process.env.ADMIN_SESSION_SECRET,
  );

export const isAdminAuthenticated = async () => {
  if (!isAdminConfigured()) {
    return false;
  }

  const cookieStore = await cookies();
  const raw = cookieStore.get(ADMIN_COOKIE)?.value;

  if (!raw) {
    return false;
  }

  const [adminId, signature] = raw.split(".");

  if (!adminId || !signature || adminId !== process.env.ADMIN_ID) {
    return false;
  }

  return safeEqual(signature, sign(adminId));
};

export const verifyAdminLogin = (id: string, password: string) => {
  if (!isAdminConfigured()) {
    return false;
  }

  return id === process.env.ADMIN_ID && password === process.env.ADMIN_PASSWORD;
};

export const setAdminSession = async (id: string) => {
  const cookieStore = await cookies();

  cookieStore.set({
    name: ADMIN_COOKIE,
    value: `${id}.${sign(id)}`,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
};

export const clearAdminSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
};
