import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/surahs — used by the frontend when running the Next.js-only deployment
// (i.e. without the standalone Express server in server/).
export async function GET() {
  const surahs = await prisma.surah.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json({ data: surahs });
}
