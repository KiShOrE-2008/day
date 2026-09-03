/**
 * Client-side Image Validation & Canvas Compression Utility
 */

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const MAX_DIMENSION = 1200; // max width/height in px
const QUALITY = 0.82;

export function validateImageFile(file) {
  if (!file) return { valid: true };

  if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: 'Invalid file format. Please upload a JPG, PNG, or WebP photo.',
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: 'Photo is too large (max 5 MB). Please choose a smaller image.',
    };
  }

  return { valid: true };
}

export async function compressImage(file) {
  if (!file) return null;

  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Downscale if width or height exceeds MAX_DIMENSION
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available for compression.'));
          return;
        }

        // Draw image with smooth scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP blob (fallback to JPEG if WebP unsupported)
        const targetType = 'image/webp';

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              // Fallback to jpeg
              canvas.toBlob(
                (jpegBlob) => {
                  if (jpegBlob) resolve(jpegBlob);
                  else reject(new Error('Failed to compress image canvas.'));
                },
                'image/jpeg',
                QUALITY
              );
            }
          },
          targetType,
          QUALITY
        );
      };

      img.onerror = () => reject(new Error('Failed to load image for processing.'));
      img.src = event.target.result;
    };

    reader.onerror = () => reject(new Error('Failed to read photo file.'));
    reader.readAsDataURL(file);
  });
}
