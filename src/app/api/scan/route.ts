import { NextRequest, NextResponse } from "next/server";
import { identifyPlant } from "@/lib/gemini";
import { optimizeImage } from "@/lib/image";
import type { PlantResult } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * POST /api/scan
 * Body: { image: string (data URL), apiKey: string, locale?: "id"|"en" }
 * Returns: PlantResult
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "INVALID_BODY", message: "Request body must be JSON." },
        { status: 400 }
      );
    }

    const { image, apiKey, locale } = body as {
      image?: string;
      apiKey?: string;
      locale?: "id" | "en";
    };

    if (!apiKey || typeof apiKey !== "string" || apiKey.length < 10) {
      return NextResponse.json(
        {
          error: "API_KEY_REQUIRED",
          message: "A valid Gemini API key is required.",
        },
        { status: 401 }
      );
    }

    if (!image || !image.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "INVALID_IMAGE", message: "A valid base64 image is required." },
        { status: 400 }
      );
    }

    // Optimize the image before sending to Gemini (faster, cheaper)
    const optimized = await optimizeImage(image).catch(() => image);

    const result: PlantResult = await identifyPlant(
      optimized,
      apiKey,
      locale === "en" ? "en" : "id"
    );

    return NextResponse.json({ result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    if (message === "API_KEY_REQUIRED") {
      return NextResponse.json(
        { error: "API_KEY_REQUIRED", message: "API key missing." },
        { status: 401 }
      );
    }
    if (message === "INVALID_IMAGE_FORMAT") {
      return NextResponse.json(
        { error: "INVALID_IMAGE", message: "Image format is invalid." },
        { status: 400 }
      );
    }
    // Gemini API errors usually contain "API_KEY" or "PERMISSION_DENIED" etc.
    if (/api[_ ]?key|invalid|permission|unauthor/i.test(message)) {
      return NextResponse.json(
        {
          error: "API_KEY_INVALID",
          message: "Gemini API key is invalid or unauthorized.",
        },
        { status: 401 }
      );
    }
    if (/quota|rate|429|resource/i.test(message)) {
      return NextResponse.json(
        {
          error: "RATE_LIMITED",
          message: "Gemini API quota or rate limit reached. Try again later.",
        },
        { status: 429 }
      );
    }
    // Geographic restriction — Gemini API not available in user's region
    if (/location is not supported|FAILED_PRECONDITION|region/i.test(message)) {
      return NextResponse.json(
        {
          error: "LOCATION_UNSUPPORTED",
          message:
            "Gemini API is not available in this region. Try a different network/region.",
        },
        { status: 403 }
      );
    }

    console.error("[/api/scan] error:", message);
    return NextResponse.json(
      { error: "SCAN_FAILED", message: "Failed to analyze image." },
      { status: 500 }
    );
  }
}
