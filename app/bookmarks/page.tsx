"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { Bookmark as BookmarkIcon, Trash2, BookOpenText } from "lucide-react";

type BookmarkItem = {
  id: string;
  label: string | null;
  surahId: number | null;
  siparahNumber: number | null;
  createdAt: string;
  ayah: {
    numberInSurah: number;
    textArabic: string;
    surah: { id: number; nameEnglish: string; nameArabic: string };
  } | null;
};

export default function BookmarksPage() {
  const { status } = useSession();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") {
      setLoading(false);
      return;
    }
    fetch("/api/bookmarks")
      .then((r) => r.json())
      .then((res) => setBookmarks(res.data ?? []))
      .finally(() => setLoading(false));
  }, [status]);

  async function removeBookmark(id: string) {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    await fetch(`/api/bookmarks?id=${id}`, { method: "DELETE" });
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink dark:text-white">Bookmarks</h1>
      <p className="mt-2 text-ink/60 dark:text-white/60">
        Ayahs, Surahs, and Siparahs you've saved for later — synced to your account via the
        <code className="mx-1 rounded bg-primary-50 px-1 dark:bg-primary-900">Bookmark</code>
        model.
      </p>

      {status === "unauthenticated" && (
        <div className="mt-8 rounded-xl2 border border-dashed border-primary-100 bg-white p-8 text-center shadow-card dark:border-primary-900 dark:bg-night-card">
          <BookmarkIcon className="mx-auto h-8 w-8 text-primary" />
          <p className="mt-3 text-ink/70 dark:text-white/70">
            Sign in to save and sync your bookmarks across devices.
          </p>
          <button
            onClick={() => signIn()}
            className="mt-4 rounded-full bg-primary px-6 py-2 font-medium text-white shadow-card transition hover:bg-primary-700"
          >
            Sign in
          </button>
        </div>
      )}

      {status === "authenticated" && loading && (
        <div className="mt-8 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl2 bg-primary-50 dark:bg-primary-900/40" />
          ))}
        </div>
      )}

      {status === "authenticated" && !loading && bookmarks.length === 0 && (
        <p className="mt-8 text-ink/60 dark:text-white/60">
          No bookmarks yet. While reading, tap the bookmark icon on any Ayah to save it here.
        </p>
      )}

      <ul className="mt-6 space-y-3">
        {bookmarks.map((b) => (
          <li
            key={b.id}
            className="flex items-center justify-between gap-4 rounded-xl2 border border-primary-100 bg-white p-4 shadow-card dark:border-primary-900 dark:bg-night-card"
          >
            <div className="min-w-0">
              {b.ayah ? (
                <>
                  <p className="truncate font-medium text-ink dark:text-white">
                    {b.ayah.surah.nameEnglish} — Ayah {b.ayah.numberInSurah}
                  </p>
                  <p className="truncate font-arabic text-lg text-ink/80 dark:text-white/80" dir="rtl">
                    {b.ayah.textArabic}
                  </p>
                </>
              ) : (
                <p className="font-medium text-ink dark:text-white">
                  {b.label ?? (b.siparahNumber ? `Siparah ${b.siparahNumber}` : `Surah ${b.surahId}`)}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {b.ayah && (
                <Link
                  href={`/quran/${b.ayah.surah.id}#ayah-${b.ayah.numberInSurah}`}
                  className="rounded-full p-2 text-primary hover:bg-primary-50 dark:hover:bg-primary-900"
                  title="Continue reading"
                >
                  <BookOpenText className="h-5 w-5" />
                </Link>
              )}
              <button
                onClick={() => removeBookmark(b.id)}
                className="rounded-full p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                title="Remove"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
