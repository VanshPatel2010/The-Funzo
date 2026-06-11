"use server";

import {
  requireAdmin,
  handleServerError,
  checkRateLimit,
  createAuditLog,
} from "@/lib/security";
import {
  uploadImageToCloudinary,
  validateCloudinaryImageFile,
} from "@/lib/cloudinary";

const CATEGORY_IMAGES_FOLDER = "the-funzo/categories";

export async function uploadCategoryImage(formData: FormData) {
  try {
    const adminEmail = await requireAdmin();

    if (!checkRateLimit(`${adminEmail}:upload_category_image`, 30, 3600000)) {
      throw new Error("Too many image uploads. Please try again later.");
    }

    const file = formData.get("image");

    if (!(file instanceof File)) {
      throw new Error("Category Image is required");
    }

    validateCloudinaryImageFile(file, "Category Image");
    const upload = await uploadImageToCloudinary(file, CATEGORY_IMAGES_FOLDER);

    await createAuditLog("UPLOAD", "category_image", upload.public_id, {
      provider: "cloudinary",
      folder: CATEGORY_IMAGES_FOLDER,
      fileName: file.name,
      size: file.size,
      type: file.type,
      url: upload.secure_url,
    });

    return { success: true, url: upload.secure_url };
  } catch (error) {
    const { message, isValidationError } = handleServerError(error);
    return {
      success: false,
      error: message,
      isValidationError,
    };
  }
}
