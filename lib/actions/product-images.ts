"use server";

import { createAdminClient } from "@/lib/supabase";
import {
  requireAdmin,
  handleServerError,
  checkRateLimit,
  createAuditLog,
} from "@/lib/security";

const PRODUCT_IMAGES_BUCKET = "product-images";
const MAX_PRODUCT_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_PRODUCT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function getExtension(file: File): string {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "jpg" || extension === "jpeg") return "jpg";
  if (extension === "png") return "png";
  if (extension === "webp") return "webp";

  throw new Error("Product Image must be JPG, PNG, or WebP");
}

function validateProductImageFile(file: File): void {
  if (!ALLOWED_PRODUCT_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Product Image must be JPG, PNG, or WebP");
  }

  if (file.size > MAX_PRODUCT_IMAGE_SIZE) {
    throw new Error("Product Image must be 5MB or smaller");
  }

  getExtension(file);
}

async function ensureProductImagesBucket(): Promise<void> {
  const client = createAdminClient();
  const { data: buckets, error: listError } =
    await client.storage.listBuckets();

  if (listError) {
    throw listError;
  }

  const bucketExists = buckets.some(
    (bucket) => bucket.name === PRODUCT_IMAGES_BUCKET
  );

  if (bucketExists) return;

  const { error: createError } = await client.storage.createBucket(
    PRODUCT_IMAGES_BUCKET,
    {
      public: true,
      fileSizeLimit: MAX_PRODUCT_IMAGE_SIZE,
      allowedMimeTypes: ALLOWED_PRODUCT_IMAGE_TYPES,
    }
  );

  if (createError) {
    throw createError;
  }
}

export async function uploadProductImage(formData: FormData) {
  try {
    const adminEmail = await requireAdmin();

    if (!checkRateLimit(`${adminEmail}:upload_product_image`, 40, 3600000)) {
      throw new Error("Too many image uploads. Please try again later.");
    }

    const file = formData.get("image");

    if (!(file instanceof File)) {
      throw new Error("Product Image is required");
    }

    validateProductImageFile(file);

    await ensureProductImagesBucket();

    const client = createAdminClient();
    const extension = getExtension(file);
    const filePath = `products/${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await client.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .upload(filePath, file, {
        contentType: file.type,
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = client.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .getPublicUrl(filePath);

    await createAuditLog("UPLOAD", "product_image", filePath, {
      bucket: PRODUCT_IMAGES_BUCKET,
      fileName: file.name,
      size: file.size,
      type: file.type,
    });

    return { success: true, url: data.publicUrl };
  } catch (error) {
    const { message, isValidationError } = handleServerError(error);
    return {
      success: false,
      error: message,
      isValidationError,
    };
  }
}
