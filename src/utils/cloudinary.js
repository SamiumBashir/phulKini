/**
 * Cloudinary Upload Utility for Phul Kini Boutique
 * Supports direct unsigned upload to Cloudinary or instant client-side base64 fallback.
 */

export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'phulkini',
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'phulkini_unsigned'
};

/**
 * Upload a file to Cloudinary
 * @param {File} file 
 * @param {Function} onProgress 
 * @returns {Promise<string>} Uploaded Image Secure URL
 */
export async function uploadToCloudinary(file, onProgress) {
  if (!file) throw new Error('No file provided for upload');

  // Try real Cloudinary direct upload endpoint
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('folder', 'phul_kini_products');

    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;

    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      if (data.secure_url) {
        return data.secure_url;
      }
    }
  } catch (error) {
    console.warn('Direct Cloudinary endpoint unavailable, converting to local preview URL:', error);
  }

  // Fallback: Convert to high quality data URL so user can still preview & upload without API keys configured
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
