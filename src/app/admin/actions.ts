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
  redirect(`/admin?uploaded=${uploaded}`);
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
  redirect(`/admin?deleted=${deleted}`);
}
