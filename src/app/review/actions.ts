"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearReviewSession,
  getReviewSessionCustomer,
  setReviewSession,
} from "@/lib/review-session";
import {
  createCustomerReview,
  ReviewError,
  verifyReviewCustomerLogin,
} from "@/lib/reviews";

const MAX_REVIEW_IMAGE_SIZE = 8 * 1024 * 1024;

const MIME_TO_EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const sanitizeName = (name: string) =>
  name
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 44) || "mad-ski-review";

const isFile = (value: FormDataEntryValue): value is File =>
  typeof value === "object" &&
  value !== null &&
  "arrayBuffer" in value &&
  "size" in value &&
  "type" in value &&
  "name" in value;

export async function reviewLoginAction(formData: FormData) {
  const loginId = String(formData.get("loginId") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const customer = await verifyReviewCustomerLogin(loginId, password);

  if (!customer) {
    redirect("/review?error=login");
  }

  await setReviewSession(customer.id);
  redirect("/review");
}

export async function reviewLogoutAction() {
  await clearReviewSession();
  redirect("/review");
}

export async function submitReviewAction(formData: FormData) {
  const customer = await getReviewSessionCustomer();

  if (!customer) {
    redirect("/review?error=session");
  }

  const content = String(formData.get("content") ?? "").trim().slice(0, 1200);
  const imageFile = formData.get("image");

  if (content.length < 10) {
    redirect("/review?error=content");
  }

  let image:
    | {
        bytes: Buffer;
        contentType: string;
        extension: string;
        originalName: string;
      }
    | undefined;

  if (imageFile && isFile(imageFile) && imageFile.size > 0) {
    const extension = MIME_TO_EXTENSION[imageFile.type];

    if (!extension || imageFile.size > MAX_REVIEW_IMAGE_SIZE) {
      redirect("/review?error=image");
    }

    image = {
      bytes: Buffer.from(await imageFile.arrayBuffer()),
      contentType: imageFile.type,
      extension,
      originalName: [
        sanitizeName(imageFile.name),
        randomBytes(4).toString("hex"),
      ].join("-"),
    };
  }

  try {
    await createCustomerReview({
      customerId: customer.id,
      authorName: customer.name,
      content,
      image,
    });
  } catch (error) {
    console.error("Review submission failed", error);
    const failedStep = error instanceof ReviewError ? error.step : "review";
    redirect(`/review?error=${failedStep}`);
  }

  revalidatePath("/");
  revalidatePath("/review");
  redirect("/review?submitted=1");
}
