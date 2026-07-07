"use client";

import { useMemo, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Repeat, Bookmark, Copy, Share2 } from "lucide-react";
import { audioUrlFor } from "@/lib/quranApi";

interface SurahMeta {
  id: number;
  nameArabic: string;
  nameEnglish: string;
  nameTranslation: string;
  revelationPlace: string;
  totalAyahs: number;
}

interface Props {
  meta: SurahMeta;
  editions: any[]; // [arabicEdition, englishEdition, urduEdition] from Al Quran Cloud
}

export function SurahReader({ meta, editions }: Props) {
  const [showTranslation, setShowTranslation] = useState(true);
  const [showTafsir, setShowTafsir] = useState(false);
  const [fontSize, setFontSize] = useState(32);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [reciter] = useState("mishary_rashid");

  const arabic = editions.find((e) => e.edition?.identifier === "quran-uthmani") ?? editions[0];
  const english = editions.find((e) => e.edition?.language === "en");
  const urdu = editions.find((e) => e.edition?.language === "ur");

  const ayahs = useMemo(() => {
    if (!arabic?.ayahs) return [];
    return arabic.ayahs.map((a: any, i: number) => ({
      numberInSurah: a.numberInSurah,
      numberInQuran: a.number,
      arabic: a.text,
      english: english?.ayahs?.[i]?.text,
      urdu: urdu?.ayahs?.[i]?.text,
    }));
  }, [arabic, english, urdu]);

  function playAyah(numberInQuran: number) {
    setPlayingAyah(numberInQuran);
    const audio = new Audio(audioUrlFor(reciter, numberInQuran));
    audio.play().catch(() => {});
    audio.onended = () => setPlayingAyah(null);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {/* Surah header */}
      <div className="rounded-xl3 bg-primary-700 p-8 text-center text-white">
        <p className="font-arabic text-4xl">{meta.nameArabic}</p>
        <h1 className="mt-2 font-display text-2xl font-bold">{meta.nameEnglish}</h1>
        <p className="mt-1 text-primary-100/80">
          {meta.nameTranslation} · {meta.revelationPlace} · {meta.totalAyahs} Ayahs
        </p>
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl2 border border-primary-100 bg-white p-4 dark:border-primary-900 dark:bg-night-card">
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => setShowTranslation((v) => !v)}
            className={`rounded-full px-3 py-1.5 font-medium ${showTranslation ? "bg-primary-600 text-white" : "bg-primary-50 dark:bg-primary-900"}`}
          >
            Translation
          </button>
          <button
            onClick={() => setShowTafsir((v) => !v)}
            className={`rounded-full px-3 py-1.5 font-medium ${showTafsir ? "bg-primary-600 text-white" : "bg-primary-50 dark:bg-primary-900"}`}
          >
            Tafsir
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <button onClick={() => setFontSize((f) => Math.max(20, f - 2))} aria-label="Decrease font size" className="rounded-full bg-primary-50 px-3 py-1.5 dark:bg-primary-900">A-</button>
          <button onClick={() => setFontSize((f) => Math.min(56, f + 2))} aria-label="Increase font size" className="rounded-full bg-primary-50 px-3 py-1.5 dark:bg-primary-900">A+</button>
        </div>
      </div>

      {/* Ayahs */}
      <div className="mt-6 space-y-6">
        {ayahs.length === 0 && (
          <p className="rounded-xl2 border border-dashed border-primary-200 p-6 text-center text-sm text-ink/60 dark:text-white/60">
            Live Quran text couldn't be loaded right now (no network to the Quran API in this
            preview). In production this pulls Arabic + Urdu + English text from the Al Quran
            Cloud API automatically.
          </p>
        )}
        {ayahs.map((a: any) => (
          <div key={a.numberInQuran} className="rounded-xl2 border border-primary-100 bg-white p-6 shadow-card dark:border-primary-900 dark:bg-night-card">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/15 text-xs font-semibold text-gold-dark">
                {a.numberInSurah}
              </span>
              <div className="flex gap-1 text-ink/50 dark:text-white/50">
                <button onClick={() => playAyah(a.numberInQuran)} aria-label="Play ayah" className="rounded-full p-2 hover:bg-primary-50 dark:hover:bg-primary-900">
                  {playingAyah === a.numberInQuran ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button aria-label="Bookmark ayah" className="rounded-full p-2 hover:bg-primary-50 dark:hover:bg-primary-900"><Bookmark className="h-4 w-4" /></button>
                <button aria-label="Copy ayah" className="rounded-full p-2 hover:bg-primary-50 dark:hover:bg-primary-900"><Copy className="h-4 w-4" /></button>
                <button aria-label="Share ayah" className="rounded-full p-2 hover:bg-primary-50 dark:hover:bg-primary-900"><Share2 className="h-4 w-4" /></button>
              </div>
            </div>
            <p dir="rtl" className="ayah-arabic text-right" style={{ fontSize }}>{a.arabic}</p>
            {showTranslation && (
              <div className="mt-4 space-y-2 border-t border-primary-100 pt-4 text-sm dark:border-primary-900">
                {a.english && <p className="text-ink/80 dark:text-white/80">{a.english}</p>}
                {a.urdu && <p dir="rtl" className="text-right text-ink/80 dark:text-white/80">{a.urdu}</p>}
              </div>
            )}
            {showTafsir && (
              <p className="mt-3 rounded-lg bg-primary-50 p-3 text-xs text-ink/60 dark:bg-primary-900 dark:text-white/60">
                Tafsir content loads here from the `tafsirs` table (see Prisma schema) — populate
                via the Admin Panel's "Manage Tafsir" section.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
