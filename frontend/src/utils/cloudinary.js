// Direct, unsigned browser -> Cloudinary upload. The cloud name and unsigned
// upload preset are public-safe (no API secret involved) and are supplied via
// Vite env vars. Because the browser uploads straight to Cloudinary, large image
// payloads never pass through the application's serverless functions.
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB

// Uploads a single image file and resolves to its Cloudinary secure_url.
// Throws an Error with a user-friendly message on misconfiguration, invalid
// input, or upload failure.
export async function uploadToCloudinary(file) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Image uploads are not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET."
    );
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Please choose a JPEG, PNG, or WebP image.");
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image must be 2 MB or smaller.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    throw new Error("Upload failed. Please try again.");
  }

  const data = await res.json();
  if (!data.secure_url) {
    throw new Error("Upload failed. Please try again.");
  }

  return data.secure_url;
}
