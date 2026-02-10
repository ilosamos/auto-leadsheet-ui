/**
 * Upload a file to a GCS signed URL with progress tracking.
 *
 * Required bucket CORS: if you get "Header was included in signedheaders, but not in the request"
 * for content-type, the bucket preflight is not allowing request headers. Set CORS so that:
 * - method includes "PUT" and "OPTIONS"
 * - responseHeader includes "Content-Type" and "x-goog-content-length-range"
 *
 * Example (gsutil or Cloud Storage API):
 * [{
 *   "maxAgeSeconds": 3600,
 *   "method": ["PUT", "GET", "HEAD", "OPTIONS"],
 *   "origin": ["*"],
 *   "responseHeader": ["Content-Type", "x-goog-content-length-range"]
 * }]
 */
const MAX_UPLOAD_BYTES = 100 * 1024 * 1024; // 100 MiB

export function uploadToSignedUrl(
  file: File,
  signedUrl: string,
  contentType: string,
  onProgress: (progress: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("PUT", signedUrl);

    // Must match exactly what the backend signed (same header names and values).
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.setRequestHeader("x-goog-content-length-range", `0,${MAX_UPLOAD_BYTES}`);

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        onProgress((e.loaded / e.total) * 100);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Upload network error")));
    xhr.addEventListener("abort", () => reject(new Error("Upload aborted")));

    xhr.send(file);
  });
}
