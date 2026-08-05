import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { makeThumbnail, optimizeImage } from "@/lib/image";
import type { PlantResult } from "@/types";

export const runtime = "nodejs";

/**
 * GET /api/history
 * Optional query: ?favorites=1  (favorites only)
 * Optional query: ?q=searchterm
 * Returns the scan history, newest first.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const favoritesOnly = searchParams.get("favorites") === "1";
    const q = searchParams.get("q")?.trim();

    const where: Record<string, unknown> = {};
    if (favoritesOnly) where.isFavorite = true;
    if (q) {
      // SQLite doesn't support mode-insensitive contains via Prisma well,
      // use contains with insensitive (Prisma maps to LIKE for SQLite).
      where.OR = [
        { plantName: { contains: q } },
        { latinName: { contains: q } },
        { category: { contains: q } },
      ];
    }

    const items = await db.scanHistory.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    // Parse JSON string fields back to arrays
    const parsed = items.map((it) => ({
      id: it.id,
      imageThumb: it.imageThumb,
      imageData: it.imageData,
      plantName: it.plantName,
      latinName: it.latinName,
      category: it.category,
      confidence: it.confidence,
      habitat: it.habitat,
      benefits: safeParseArr(it.benefits),
      care: safeParseArr(it.care),
      dangerLevel: it.dangerLevel,
      description: it.description,
      detected: it.detected,
      isFavorite: it.isFavorite,
      createdAt: it.createdAt.toISOString(),
    }));

    return NextResponse.json({ items: parsed });
  } catch (err) {
    console.error("[/api/history GET] error:", err);
    return NextResponse.json(
      { error: "LOAD_FAILED", message: "Failed to load history." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/history
 * Body: { image: dataURL, result: PlantResult, isFavorite?: boolean }
 * Saves a scan to history. Returns the created item.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "INVALID_BODY", message: "Request body must be JSON." },
        { status: 400 }
      );
    }

    const { image, result, isFavorite } = body as {
      image?: string;
      result?: PlantResult;
      isFavorite?: boolean;
    };

    if (!image || !image.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "INVALID_IMAGE", message: "A valid image is required." },
        { status: 400 }
      );
    }
    if (!result || typeof result !== "object") {
      return NextResponse.json(
        { error: "INVALID_RESULT", message: "A valid result object is required." },
        { status: 400 }
      );
    }

    // Optimize stored image + create thumbnail
    const [optimized, thumb] = await Promise.all([
      optimizeImage(image).catch(() => image),
      makeThumbnail(image).catch(() => image),
    ]);

    const created = await db.scanHistory.create({
      data: {
        imageData: optimized,
        imageThumb: thumb,
        plantName: result.plantName || "Unknown",
        latinName: result.latinName || "Unknown sp.",
        category: result.category || "Tumbuhan",
        confidence: Number(result.confidence) || 0,
        habitat: result.habitat || "-",
        benefits: JSON.stringify(result.benefits || []),
        care: JSON.stringify(result.care || []),
        dangerLevel: result.dangerLevel || "Rendah",
        description: result.description || "",
        detected: result.detected !== false,
        isFavorite: Boolean(isFavorite),
      },
    });

    return NextResponse.json({
      item: {
        id: created.id,
        imageThumb: created.imageThumb,
        imageData: created.imageData,
        plantName: created.plantName,
        latinName: created.latinName,
        category: created.category,
        confidence: created.confidence,
        habitat: created.habitat,
        benefits: safeParseArr(created.benefits),
        care: safeParseArr(created.care),
        dangerLevel: created.dangerLevel,
        description: created.description,
        detected: created.detected,
        isFavorite: created.isFavorite,
        createdAt: created.createdAt.toISOString(),
      },
    });
  } catch (err) {
    console.error("[/api/history POST] error:", err);
    return NextResponse.json(
      { error: "SAVE_FAILED", message: "Failed to save scan." },
      { status: 500 }
    );
  }
}

function safeParseArr(s: string | null | undefined): string[] {
  if (!s) return [];
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v.map((x) => String(x)) : [];
  } catch {
    return [];
  }
}
