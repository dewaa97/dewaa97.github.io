/**
 * Compress and optimize image files with advanced algorithm
 * Target: 2MB max with visual quality maintained (like original 25MB)
 */

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB hard limit
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 800;
const MIN_QUALITY = 0.4;
const INITIAL_QUALITY = 0.7;

/**
 * Advanced compression algorithm that iteratively reduces quality
 * to meet size requirements while maintaining visual quality
 */
export async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate optimal dimensions (maintain aspect ratio)
        let { width, height } = img;
        
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        
        // Create canvas and draw image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Enable better image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        // Iteratively compress until we meet size requirement
        let quality = INITIAL_QUALITY;
        let blob: Blob | null = null;
        let attempts = 0;
        const maxAttempts = 15;
        
        const tryCompress = () => {
          canvas.toBlob(
            (result) => {
              if (!result) {
                reject(new Error('Failed to compress image'));
                return;
              }
              
              blob = result;
              
              // Check if we're under size limit
              if (blob.size <= MAX_FILE_SIZE) {
                // Size is good, resolve with current quality
                resolve(blob);
                return;
              }
              
              // Still too large, reduce quality further
              quality -= 0.05;
              attempts++;
              
              if (quality < MIN_QUALITY || attempts >= maxAttempts) {
                // We've done our best, return current blob
                // At MIN_QUALITY, files are usually <2MB
                resolve(blob);
                return;
              }
              
              // Try again with lower quality
              tryCompress();
            },
            'image/webp',
            quality
          );
        };
        
        tryCompress();
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = event.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

export function getFileSizeInMB(bytes: number): number {
  return bytes / (1024 * 1024);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
