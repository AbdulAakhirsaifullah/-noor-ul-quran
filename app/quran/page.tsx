import Link from "next/link";
import surahMeta from "@/data/quranSurahMeta.json";

export const metadata = { title: "Surah Index — Noor-ul-Quran" };

export default function QuranIndexPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">Surah Index</h1>
      <p className="mt-2 text-ink/60 dark:text-white/60">All 114 Surahs of the Holy Quran.</p>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {surahMeta.map((s: any) => (
          <Link
            key={s.id}
            href={`/quran/${s.id}`}
            className="flex items-center justify-between rounded-xl2 border border-primary-100 bg-white px-5 py-4 shadow-card transition hover:border-gold/50 hover:-translate-y-0.5 dark:border-primary-900 dark:bg-night-card"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-700 dark:bg-primary-900 dark:text-primary-100">
                {s.id}
              </span>
              <div>
                <p className="font-medium">{s.nameEnglish}</p>
                <p className="text-xs text-ink/50 dark:text-white/50">
                  {s.nameTranslation} · {s.revelationPlace} · {s.totalAyahs} Ayahs
                </p>
              </div>
            </div>
            <span className="font-arabic text-xl text-primary-700 dark:text-gold-light">{s.nameArabic}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
