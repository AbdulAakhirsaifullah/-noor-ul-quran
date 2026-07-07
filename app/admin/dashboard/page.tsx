import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || !isAdmin((session.user as any)?.role)) {
    redirect("/admin/login");
  }

  const [userCount, surahCount, duaCount, bookmarkCount] = await Promise.all([
    prisma.user.count(),
    prisma.surah.count(),
    prisma.dua.count(),
    prisma.bookmark.count(),
  ]);

  const stats = [
    { label: "Registered Users", value: userCount },
    { label: "Surahs", value: surahCount },
    { label: "Duas", value: duaCount },
    { label: "Bookmarks Saved", value: bookmarkCount },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
      <p className="mt-1 text-ink/60 dark:text-white/60">Signed in as {session.user?.email}</p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl2 border border-primary-100 bg-white p-5 dark:border-primary-900 dark:bg-night-card">
            <p className="text-3xl font-bold text-primary-700 dark:text-gold-light">{s.value}</p>
            <p className="mt-1 text-sm text-ink/60 dark:text-white/60">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {["Manage Surahs", "Manage Audio", "Manage Tafsir", "Manage Duas", "Manage Users", "Analytics"].map((item) => (
          <div key={item} className="rounded-xl2 border border-dashed border-primary-200 p-6 text-sm text-ink/60 dark:border-primary-800 dark:text-white/60">
            <p className="font-semibold text-ink dark:text-white">{item}</p>
            <p className="mt-1">CRUD UI for this panel plugs into the matching Prisma model — wire up a table + form here.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
