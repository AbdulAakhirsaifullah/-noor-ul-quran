import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/bookmarks — current user's saved Ayahs/Surahs/Siparahs
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in to view bookmarks." }, { status: 401 });
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: (session.user as any).id },
    include: { ayah: { include: { surah: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ data: bookmarks });
}

// POST /api/bookmarks — save an Ayah, Surah, or Siparah
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in to save bookmarks." }, { status: 401 });
  }

  const body = await req.json();
  const { ayahId, surahId, siparahNumber, label } = body ?? {};

  if (!ayahId && !surahId && !siparahNumber) {
    return NextResponse.json(
      { error: "Provide at least one of ayahId, surahId, or siparahNumber." },
      { status: 400 }
    );
  }

  const bookmark = await prisma.bookmark.create({
    data: { userId: (session.user as any).id, ayahId, surahId, siparahNumber, label },
  });
  return NextResponse.json({ data: bookmark }, { status: 201 });
}

// DELETE /api/bookmarks?id=xxx
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing bookmark id." }, { status: 400 });

  const existing = await prisma.bookmark.findUnique({ where: { id } });
  if (!existing || existing.userId !== (session.user as any).id) {
    return NextResponse.json({ error: "Bookmark not found." }, { status: 404 });
  }

  await prisma.bookmark.delete({ where: { id } });
  return NextResponse.json({ data: { deleted: true } });
}
