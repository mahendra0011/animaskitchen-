import { v2 as cloudinary } from "cloudinary";

// Cloudinary configuration
const cloudinaryUrl = process.env["CLOUDINARY_URL"];
const cloudName = process.env["CLOUDINARY_CLOUD_NAME"];
const apiKey = process.env["CLOUDINARY_API_KEY"];
const apiSecret = process.env["CLOUDINARY_API_SECRET"];

if (cloudinaryUrl) {
  cloudinary.config({
    cloudinary_url: cloudinaryUrl,
  });
} else if (cloudName && apiKey) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export interface UploadOptions {
  folder?: string;
  publicId?: string;
  resourceType?: "image" | "video" | "raw" | "auto";
}

/**
 * Upload Base64 data URI or buffer/URL to Cloudinary
 */
export async function uploadToCloudinary(
  fileContent: string,
  options: UploadOptions = {},
): Promise<{ url: string; secureUrl: string; publicId: string; format?: string }> {
  const result = await cloudinary.uploader.upload(fileContent, {
    folder: options.folder || "animas-kitchen",
    resource_type: options.resourceType || "auto",
    public_id: options.publicId,
    overwrite: true,
  });

  return {
    url: result.url,
    secureUrl: result.secure_url,
    publicId: result.public_id,
    format: result.format,
  };
}

export { cloudinary };
