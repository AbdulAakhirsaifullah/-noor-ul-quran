import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const duas = await prisma.dua.findMany({
    where: category ? { category } : undefined,
    orderBy: { order: "asc" },
  });
  return NextResponse.json({ data: duas });
}
