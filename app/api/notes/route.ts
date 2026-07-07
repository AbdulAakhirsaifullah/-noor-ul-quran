import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/notes — current user's notes, newest first
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in to view notes." }, { status: 401 });
  }

  const notes = await prisma.note.findMany({
    where: { userId: (session.user as any).id },
    include: { ayah: { include: { surah: true } } },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ data: notes });
}

// POST /api/notes — create a note tied to an Ayah
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in to write notes." }, { status: 401 });
  }

  const { ayahId, content } = await req.json();
  if (!ayahId || !content?.trim()) {
    return NextResponse.json({ error: "ayahId and content are required." }, { status: 400 });
  }

  const note = await prisma.note.create({
    data: { userId: (session.user as any).id, ayahId, content: content.trim() },
  });
  return NextResponse.json({ data: note }, { status: 201 });
}

// PATCH /api/notes — update a note's content ({ id, content })
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const { id, content } = await req.json();
  const existing = await prisma.note.findUnique({ where: { id } });
  if (!existing || existing.userId !== (session.user as any).id) {
    return NextResponse.json({ error: "Note not found." }, { status: 404 });
  }

  const note = await prisma.note.update({ where: { id }, data: { content } });
  return NextResponse.json({ data: note });
}

// DELETE /api/notes?id=xxx
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing note id." }, { status: 400 });

  const existing = await prisma.note.findUnique({ where: { id } });
  if (!existing || existing.userId !== (session.user as any).id) {
    return NextResponse.json({ error: "Note not found." }, { status: 404 });
  }

  await prisma.note.delete({ where: { id } });
  return NextResponse.json({ data: { deleted: true } });
}
