import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

// GET /api/history
// GET /api/history?favorites=1
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const favorites = searchParams.get("favorites");

    const items = await db.scanHistory.findMany({
      where: favorites === "1" ? { isFavorite: true } : undefined,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Ubah JSON string menjadi array
    const normalizedItems = items.map((item) => ({
      ...item,
      benefits: parseJsonArray(item.benefits),
      care: parseJsonArray(item.care),
    }));

    return NextResponse.json({ items: normalizedItems });
  } catch (err) {
    console.error("[/api/history GET] error:", err);

    return NextResponse.json(
      {
        error: "FETCH_FAILED",
        message: "Failed to fetch history.",
      },
      { status: 500 }
    );
  }
}

// POST /api/history
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { image, result, isFavorite } = body;

    if (!image || !result) {
      return NextResponse.json(
        {
          error: "INVALID_DATA",
          message: "Image and result are required.",
        },
        { status: 400 }
      );
    }

    const item = await db.scanHistory.create({
      data: {
        imageThumb: image,
        imageData: image,

        plantName: result.plantName ?? "Unknown",
        latinName: result.latinName ?? "Unknown sp.",
        category: result.category ?? "Tumbuhan",
        confidence: Number(result.confidence ?? 0),
        habitat: result.habitat ?? "-",

        benefits: JSON.stringify(result.benefits ?? []),
        care: JSON.stringify(result.care ?? []),

        dangerLevel: result.dangerLevel ?? "Rendah",
        description: result.description ?? "",

        detected: result.detected ?? true,
        isFavorite: isFavorite ?? false,
      },
    });

    return NextResponse.json(
      { item },
      { status: 201 }
    );
  } catch (err) {
    console.error("[/api/history POST] error:", err);

    return NextResponse.json(
      {
        error: "CREATE_FAILED",
        message: "Failed to save history.",
      },
      { status: 500 }
    );
  }
}

// Helper untuk mengubah JSON string menjadi string[]
function parseJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (typeof value !== "string") {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed.map(String);
    }

    return [];
  } catch {
    return [];
  }
}