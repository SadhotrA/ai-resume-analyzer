export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
  if (pdfjsLib) return pdfjsLib;
  if (loadPromise) return loadPromise;

  isLoading = true;
  try {
    // Use the build version of PDF.js
    const lib = await import("pdfjs-dist/build/pdf.mjs");
    
    // Handle both default export and named export cases
    const pdfLib = lib.default || lib;
    
    if (!pdfLib || !pdfLib.GlobalWorkerOptions) {
      throw new Error('Invalid PDF.js library loaded');
    }

    // Set the worker source to use local file
    pdfLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    pdfjsLib = pdfLib;
    isLoading = false;
    return pdfLib;
  } catch (error) {
    isLoading = false;
    throw new Error(`Failed to load PDF.js library: ${error}`);
  }
}

// Add a retry mechanism for PDF.js loading
async function loadPdfJsWithRetry(maxRetries: number = 3): Promise<any> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await loadPdfJs();
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  throw new Error('Failed to load PDF.js after multiple attempts');
}

export async function convertPdfToImage(
  file: File
): Promise<PdfConversionResult> {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      throw new Error('PDF conversion only works in browser environment');
    }

    // Check if file is actually a PDF
    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      throw new Error('File is not a PDF');
    }

    // Add timeout to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('PDF conversion timed out')), 30000); // 30 seconds timeout
    });

    const conversionPromise = async (): Promise<PdfConversionResult> => {
      const lib = await loadPdfJsWithRetry();
      if (!lib) {
        throw new Error('PDF.js library failed to load');
      }

      const arrayBuffer = await file.arrayBuffer();
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new Error('Failed to read file data');
      }

      const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
      if (!pdf) {
        throw new Error('Failed to load PDF document');
      }

      const page = await pdf.getPage(1);
      if (!page) {
        throw new Error('Failed to get first page');
      }

      const viewport = page.getViewport({ scale: 2 }); // Reduced scale for better performance
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error('Failed to get canvas context');
      }

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";

      await page.render({ canvasContext: context, viewport }).promise;

      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              try {
                // Create a File from the blob with the same name as the pdf
                const originalName = file.name.replace(/\.pdf$/i, "");
                const imageFile = new File([blob], `${originalName}.png`, {
                  type: "image/png",
                });

                resolve({
                  imageUrl: URL.createObjectURL(blob),
                  file: imageFile,
                });
              } catch (error) {
                reject(new Error(`Failed to create image file: ${error}`));
              }
            } else {
              reject(new Error("Failed to create image blob"));
            }
          },
          "image/png",
          0.9 // Set quality to 0.9 for better file size
        );
      });
    };

    // Race between conversion and timeout
    return await Promise.race([conversionPromise(), timeoutPromise]);
  } catch (err) {
    console.error('PDF conversion error:', err);
    
    // Handle specific version mismatch error
    if (err instanceof Error && err.message.includes('API version') && err.message.includes('Worker version')) {
      return {
        imageUrl: "",
        file: null,
        error: "PDF.js version mismatch. Please refresh the page and try again.",
      };
    }
    
    return {
      imageUrl: "",
      file: null,
      error: err instanceof Error ? err.message : `Failed to convert PDF: ${err}`,
    };
  }
}