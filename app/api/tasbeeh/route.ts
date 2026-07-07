import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/tasbeeh — all zikr counts for the current user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ data: [] }); // guests just use local state

  const counts = await prisma.tasbeehCount.findMany({
    where: { userId: (session.user as any).id },
  });
  return NextResponse.json({ data: counts });
}

// PUT /api/tasbeeh — upsert a count ({ zikrName, count, targetCount })
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in to save your tasbeeh history." }, { status: 401 });
  }

  const { zikrName, count, targetCount } = await req.json();
  if (!zikrName || typeof count !== "number") {
    return NextResponse.json({ error: "zikrName and count are required." }, { status: 400 });
  }

  const userId = (session.user as any).id;
  const updated = await prisma.tasbeehCount.upsert({
    where: { userId_zikrName: { userId, zikrName } },
    update: { count, targetCount },
    create: { userId, zikrName, count, targetCount },
  });
  return NextResponse.json({ data: updated });
}
