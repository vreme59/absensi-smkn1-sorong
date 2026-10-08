/**
 * Client-side High Quality Image Compressor for Profile Pictures
 * Automatically downsizes large photos to optimal avatar dimensions (500x500 max)
 * while preserving sharpness and high visual fidelity.
 */

export interface CompressionResult {
  dataUrl: string;
  blob: Blob;
  file: File;
  originalSizeKB: number;
  compressedSizeKB: number;
  compressionRatioPercent: number;
}

export function compressAvatarImage(
  file: File,
  maxDimension = 512,
  quality = 0.85
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    const originalSizeKB = Math.round(file.size / 1024);
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Gagal membaca berkas gambar.'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Format berkas gambar tidak valid.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio square crop or proportional scale
        const minSide = Math.min(width, height);
        const sourceX = (width - minSide) / 2;
        const sourceY = (height - minSide) / 2;

        const targetSize = Math.min(minSide, maxDimension);

        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context tidak tersedia.'));
          return;
        }

        // Enable high-quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw cropped & scaled square
        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          minSide,
          minSide,
          0,
          0,
          targetSize,
          targetSize
        );

        // Convert to high-quality JPEG
        const dataUrl = canvas.toDataURL('image/jpeg', quality);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Gagal mengompres gambar.'));
              return;
            }

            const compressedSizeKB = Math.round(blob.size / 1024);
            const compressionRatioPercent = Math.max(
              0,
              Math.round(((originalSizeKB - compressedSizeKB) / Math.max(1, originalSizeKB)) * 100)
            );

            const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });

            resolve({
              dataUrl,
              blob,
              file: compressedFile,
              originalSizeKB,
              compressedSizeKB,
              compressionRatioPercent,
            });
          },
          'image/jpeg',
          quality
        );
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
