import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export function validateCloudinaryImageFile(
  file: File,
  imageLabel: string
): void {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(`${imageLabel} must be JPG, PNG, or WebP`);
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(`${imageLabel} must be 5MB or smaller`);
  }
}

export async function uploadImageToCloudinary(
  file: File,
  folder: string
): Promise<UploadApiResponse> {
  configureCloudinary();

  const buffer = Buffer.from(await file.arrayBuffer());
  const publicId = `${Date.now()}-${crypto.randomUUID()}`;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: "image",
        overwrite: false,
        use_filename: false,
        unique_filename: false,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary upload failed"));
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
}
