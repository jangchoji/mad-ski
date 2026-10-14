"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearAdminSession,
  isAdminAuthenticated,
  setAdminSession,
  verifyAdminLogin,
} from "@/lib/admin";
import {
  createGalleryImages,
  deleteGalleryImages,
  GalleryUploadError,
  isGalleryStorageConfigured,
} from "@/lib/gallery";
import {
  createNotice,
  deleteNotices,
  NoticeError,
  updateNotice,
} from "@/lib/notices";
import { createPopupAd, deletePopupAds, PopupAdError } from "@/lib/popup-ads";
import { createReviewCustomer, ReviewError } from "@/lib/reviews";

const MAX_FILE_SIZE = 12 * 1024 * 1024;
const MAX_FILE_COUNT = 20;
const MAX_TOTAL_UPLOAD_SIZE = 80 * 1024 * 1024;

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
    .slice(0, 44) || "mad-ski-photo";

const sanitizeLoginId = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 40);

const isFile = (value: FormDataEntryValue): value is File =>
  typeof value === "object" &&
  value !== null &&
  "arrayBuffer" in value &&
  "size" in value &&
  "type" in value &&
  "name" in value;

export async function loginAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!verifyAdminLogin(id, password)) {
    redirect("/admin?error=login");
  }

  await setAdminSession(id);
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin");
}

export async function uploadPhotosAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin?error=session");
  }

  if (!isGalleryStorageConfigured()) {
    redirect("/admin?error=storage");
  }

  const photos = formData
    .getAll("photos")
    .filter(isFile)
    .filter((file) => file.size > 0)
    .slice(0, MAX_FILE_COUNT);

  if (!photos.length) {
    redirect("/admin?error=file");
  }

  const validPhotos = photos.filter(
    (photo) => MIME_TO_EXTENSION[photo.type] && photo.size <= MAX_FILE_SIZE,
  );
  const totalSize = validPhotos.reduce((sum, photo) => sum + photo.size, 0);

  if (!validPhotos.length || totalSize > MAX_TOTAL_UPLOAD_SIZE) {
    redirect("/admin?error=file");
  }

  let uploaded = 0;
  let failedStep: "r2" | "supabase" | "upload" | null = null;

  try {
    const galleryImages = await Promise.all(
      validPhotos.map(async (photo) => {
        const extension = MIME_TO_EXTENSION[photo.type];

        if (!extension) {
          throw new Error(`Unsupported image type: ${photo.type}`);
        }

        const bytes = Buffer.from(await photo.arrayBuffer());
        const fileName = [
          sanitizeName(photo.name),
          randomBytes(4).toString("hex"),
        ].join("-");

        return {
          bytes,
          contentType: photo.type,
          extension,
          originalName: fileName,
        };
      }),
    );

    uploaded = await createGalleryImages(galleryImages);
  } catch (error) {
    console.error("Gallery upload failed", error);
    failedStep = error instanceof GalleryUploadError ? error.step : "upload";
  }

  if (!uploaded) {
    redirect(failedStep ? `/admin?error=${failedStep}` : "/admin?error=file");
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect(`/admin?tab=gallery&uploaded=${uploaded}`);
}

export async function deletePhotosAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin?error=session");
  }

  if (!isGalleryStorageConfigured()) {
    redirect("/admin?error=storage");
  }

  const ids = formData
    .getAll("photoIds")
    .map((id) => String(id))
    .filter(Boolean);

  if (!ids.length) {
    redirect("/admin?error=delete");
  }

  let deleted = 0;

  try {
    deleted = await deleteGalleryImages(ids);
  } catch (error) {
    console.error("Gallery delete failed", error);
    const failedStep =
      error instanceof GalleryUploadError ? error.step : "delete";
    redirect(`/admin?error=${failedStep}`);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect(`/admin?tab=gallery&deleted=${deleted}`);
}

export async function createNoticeAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin?error=session");
  }

  if (!isGalleryStorageConfigured()) {
    redirect("/admin?error=storage");
  }

  const title = String(formData.get("title") ?? "").trim().slice(0, 80);
  const content = String(formData.get("content") ?? "").trim().slice(0, 2000);
  const imageFile = formData.get("image");

  if (
    !title ||
    !content ||
    imageFile === null ||
    !isFile(imageFile) ||
    !imageFile.size
  ) {
    redirect("/admin?error=notice");
  }

  if (!MIME_TO_EXTENSION[imageFile.type] || imageFile.size > MAX_FILE_SIZE) {
    redirect("/admin?error=file");
  }

  try {
    const extension = MIME_TO_EXTENSION[imageFile.type];

    if (!extension) {
      throw new NoticeError("validation");
    }

    const image = {
      bytes: Buffer.from(await imageFile.arrayBuffer()),
      contentType: imageFile.type,
      extension,
      originalName: [
        sanitizeName(imageFile.name),
        randomBytes(4).toString("hex"),
      ].join("-"),
    };

    await createNotice({
      title,
      content,
      image,
    });
  } catch (error) {
    console.error("Notice creation failed", error);
    const failedStep =
      error instanceof NoticeError ? error.step : "notice";
    redirect(`/admin?error=${failedStep}`);
  }

  revalidatePath("/");
  revalidatePath("/notice");
  revalidatePath("/admin");
  redirect("/admin?tab=notice&notice=created");
}

export async function updateNoticeAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin?error=session");
  }

  if (!isGalleryStorageConfigured()) {
    redirect("/admin?error=storage");
  }

  const id = String(formData.get("noticeId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim().slice(0, 80);
  const content = String(formData.get("content") ?? "").trim().slice(0, 2000);
  const imageFile = formData.get("image");

  if (!id || !title || !content) {
    redirect("/admin?error=notice");
  }

  let image:
    | {
        bytes: Buffer;
        contentType: string;
        extension: string;
        originalName: string;
      }
    | undefined;

  if (imageFile !== null && isFile(imageFile) && imageFile.size > 0) {
    if (!MIME_TO_EXTENSION[imageFile.type] || imageFile.size > MAX_FILE_SIZE) {
      redirect("/admin?error=file");
    }

    const extension = MIME_TO_EXTENSION[imageFile.type];

    if (!extension) {
      redirect("/admin?error=file");
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
    await updateNotice({
      id,
      title,
      content,
      image,
    });
  } catch (error) {
    console.error("Notice update failed", error);
    const failedStep =
      error instanceof NoticeError ? error.step : "notice";
    redirect(`/admin?error=${failedStep}`);
  }

  revalidatePath("/");
  revalidatePath("/notice");
  revalidatePath("/admin");
  redirect(`/admin?tab=notice&noticeId=${id}&notice=updated`);
}

export async function deleteNoticesAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin?error=session");
  }

  if (!isGalleryStorageConfigured()) {
    redirect("/admin?error=storage");
  }

  const ids = formData
    .getAll("noticeIds")
    .map((id) => String(id))
    .filter(Boolean);

  if (!ids.length) {
    redirect("/admin?error=noticeDelete");
  }

  let deleted = 0;

  try {
    deleted = await deleteNotices(ids);
  } catch (error) {
    console.error("Notice delete failed", error);
    const failedStep =
      error instanceof NoticeError ? error.step : "noticeDelete";
    redirect(`/admin?error=${failedStep}`);
  }

  revalidatePath("/");
  revalidatePath("/notice");
  revalidatePath("/admin");
  redirect(`/admin?tab=notice&noticeDeleted=${deleted}`);
}

export async function createPopupAdAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin?error=session");
  }

  if (!isGalleryStorageConfigured()) {
    redirect("/admin?error=storage");
  }

  const imageFile = formData.get("image");

  if (imageFile === null || !isFile(imageFile) || !imageFile.size) {
    redirect("/admin?error=popup");
  }

  if (!MIME_TO_EXTENSION[imageFile.type] || imageFile.size > MAX_FILE_SIZE) {
    redirect("/admin?error=file");
  }

  try {
    const extension = MIME_TO_EXTENSION[imageFile.type];

    if (!extension) {
      throw new PopupAdError("validation");
    }

    await createPopupAd({
      bytes: Buffer.from(await imageFile.arrayBuffer()),
      contentType: imageFile.type,
      extension,
      originalName: [
        sanitizeName(imageFile.name),
        randomBytes(4).toString("hex"),
      ].join("-"),
    });
  } catch (error) {
    console.error("Popup ad creation failed", error);
    const failedStep =
      error instanceof PopupAdError ? error.step : "popup";
    redirect(`/admin?error=${failedStep}`);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?tab=popup&popup=created");
}

export async function deletePopupAdsAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin?error=session");
  }

  if (!isGalleryStorageConfigured()) {
    redirect("/admin?error=storage");
  }

  const ids = formData
    .getAll("popupIds")
    .map((id) => String(id))
    .filter(Boolean);

  if (!ids.length) {
    redirect("/admin?error=popupDelete");
  }

  let deleted = 0;

  try {
    deleted = await deletePopupAds(ids);
  } catch (error) {
    console.error("Popup ad delete failed", error);
    const failedStep =
      error instanceof PopupAdError ? error.step : "popupDelete";
    redirect(`/admin?error=${failedStep}`);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect(`/admin?tab=popup&popupDeleted=${deleted}`);
}

export async function createReviewCustomerAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin?error=session");
  }

  const name = String(formData.get("name") ?? "").trim().slice(0, 40);
  const phone = String(formData.get("phone") ?? "").trim().slice(0, 40);
  const memo = String(formData.get("memo") ?? "").trim().slice(0, 500);
  const loginId = sanitizeLoginId(String(formData.get("loginId") ?? ""));
  const password = String(formData.get("password") ?? "");

  if (!name || loginId.length < 4 || password.length < 4) {
    redirect("/admin?error=customer");
  }

  try {
    await createReviewCustomer({
      name,
      phone,
      memo,
      loginId,
      password,
    });
  } catch (error) {
    console.error("Review customer creation failed", error);
    const failedStep =
      error instanceof ReviewError ? error.step : "customer";
    redirect(`/admin?error=${failedStep}`);
  }

  revalidatePath("/admin");
  redirect("/admin?tab=reviews&customer=created");
}
