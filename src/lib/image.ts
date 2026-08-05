import sharp from "sharp";

/**
 * Extract the raw base64 + mime type from a data URL.
 */
export function parseDataUrl(
  dataUrl: string
): { data: string; mimeType: string } | null {
  const m = dataUrl.match(/^data:(image\/[\w+.-]+);base64,(.*)$/);
  if (!m) return null;
  return { data: m[2], mimeType: m[1] };
}

/**
 * Generate a small JPEG thumbnail (max width 420px) from a base64 data URL.
 * Used for history list previews to keep payload light.
 */
export async function makeThumbnail(dataUrl: string): Promise<string> {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) return dataUrl;
  const buf = Buffer.from(parsed.data, "base64");
  const thumb = await sharp(buf)
    .resize({ width: 420, withoutEnlargement: true })
    .jpeg({ quality: 72, mozjpeg: true })
    .toBuffer();
  return `data:image/jpeg;base64,${thumb.toString("base64")}`;
}

/**
 * Downscale an uploaded image to a reasonable size for storage & Gemini.
 * Max dimension ~1024px, JPEG.
 */
export async function optimizeImage(dataUrl: string): Promise<string> {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) return dataUrl;
  const buf = Buffer.from(parsed.data, "base64");
  const out = await sharp(buf)
    .resize({ width: 1024, withoutEnlargement: true })
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();
  return `data:image/jpeg;base64,${out.toString("base64")}`;
}
