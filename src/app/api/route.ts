import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

/**
 * PATCH /api/history/[id]
 * Body: { isFavorite?: boolean }
 * Toggles favorite or updates fields.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));

    const data: Record<string, unknown> = {};
    if (typeof body.isFavorite === "boolean") data.isFavorite = body.isFavorite;

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "NO_FIELDS", message: "No updatable fields provided." },
        { status: 400 }
      );
    }

    const updated = await db.scanHistory.update({
      where: { id },
      data,
      select: { id: true, isFavorite: true },
    });

    return NextResponse.json({ item: updated });
  } catch (err) {
    console.error("[/api/history PATCH] error:", err);
    return NextResponse.json(
      { error: "UPDATE_FAILED", message: "Failed to update entry." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/history/[id]
 * Deletes a single scan history entry.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.scanHistory.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/history DELETE] error:", err);
    return NextResponse.json(
      { error: "DELETE_FAILED", message: "Failed to delete entry." },
      { status: 500 }
    );
  }
}
