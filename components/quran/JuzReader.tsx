"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Play, Pause } from "lucide-react";
import { audioUrlFor } from "@/lib/quranApi";

interface Props {
  meta: { number: number; name: string };
  editions: any[];
}

export function JuzReader({ meta, editions }: Props) {
  const [showTranslation, setShowTranslation] = useState(true);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);

  const arabic = editions.find((e) => e.edition?.identifier === "quran-uthmani") ?? editions[0];
  const english = editions.find((e) => e.edition?.language === "en");
  const urdu = editions.find((e) => e.edition?.language === "ur");

  const groups = useMemo(() => {
    if (!arabic?.ayahs) return [];
    const out: Array<{
      surahNumber: number;
      surahName: string;
      ayahs: Array<{ numberInSurah: number; numberInQuran: number; arabic: string; english?: string; urdu?: string }>;
    }> = [];

    arabic.ayahs.forEach((a: any, i: number) => {
      const surahNumber = a.surah?.number ?? 0;
      const surahName = a.surah?.englishName ?? `Surah ${surahNumber}`;
      let group = out.find((g) => g.surahNumber === surahNumber && g === out[out.length - 1]);
      if (!group) {
        group = { surahNumber, surahName, ayahs: [] };
        out.push(group);
      }
      group.ayahs.push({
        numberInSurah: a.numberInSurah,
        numberInQuran: a.number,
        arabic: a.text,
        english: english?.ayahs?.[i]?.text,
        urdu: urdu?.ayahs?.[i]?.text,
      });
    });
    return out;
  }, [arabic, english, urdu]);

  function playAyah(numberInQuran: number) {
    setPlayingAyah(numberInQuran);
    const audio = new Audio(audioUrlFor("mishary_rashid", numberInQuran));
    audio.play().catch(() => {});
    audio.onended = () => setPlayingAyah(null);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="rounded-xl3 bg-primary-700 p-8 text-center text-white">
        <p className="text-sm uppercase tracking-wide text-primary-100/70">Siparah {meta.number}</p>
        <p dir="rtl" className="font-arabic text-3xl">{(meta as any).arabic}</p>
        <h1 className="mt-1 font-display text-2xl font-bold">{meta.name}</h1>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-xl2 border border-primary-100 bg-white p-3 dark:border-primary-900 dark:bg-night-card">
        <div className="flex gap-4 text-sm">
          <Link href="/siparah" className="text-primary hover:underline">
            ← All Siparah
          </Link>
          {meta.number > 1 && (
            <Link href={`/siparah/${meta.number - 1}`} className="text-primary hover:underline">
              Previous
            </Link>
          )}
          {meta.number < 30 && (
            <Link href={`/siparah/${meta.number + 1}`} className="text-primary hover:underline">
              Next
            </Link>
          )}
        </div>
        <button
          onClick={() => setShowTranslation((v) => !v)}
          className="rounded-full bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-100"
        >
          {showTranslation ? "Hide" : "Show"} Translation
        </button>
      </div>

      {groups.length === 0 && (
        <p className="mt-8 text-center text-ink/60 dark:text-white/60">
          Couldn't load this Siparah from the Quran API right now — check your internet connection
          and refresh.
        </p>
      )}

      <div className="mt-6 space-y-8">
        {groups.map((group, gi) => (
          <div key={gi}>
            <h2 className="mb-3 border-b border-primary-100 pb-2 text-sm font-semibold uppercase tracking-wide text-primary-600 dark:border-primary-900 dark:text-gold-light">
              {group.surahName}
            </h2>
            <div className="space-y-5">
              {group.ayahs.map((ayah) => (
                <div
                  key={ayah.numberInQuran}
                  id={`ayah-${ayah.numberInSurah}`}
                  className="rounded-xl2 border border-primary-50 bg-white p-4 shadow-card dark:border-primary-900/50 dark:bg-night-card"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p dir="rtl" className="font-arabic text-2xl leading-loose text-ink dark:text-white">
                      {ayah.arabic}{" "}
                      <span className="text-sm text-primary-500">({ayah.numberInSurah})</span>
                    </p>
                    <button
                      onClick={() => playAyah(ayah.numberInQuran)}
                      className="mt-1 shrink-0 rounded-full bg-primary-50 p-2 text-primary hover:bg-primary-100 dark:bg-primary-900 dark:text-primary-100"
                    >
                      {playingAyah === ayah.numberInQuran ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {showTranslation && (
                    <div className="mt-3 space-y-1 border-t border-primary-50 pt-3 text-sm dark:border-primary-900/50">
                      {ayah.english && <p className="text-ink/80 dark:text-white/80">{ayah.english}</p>}
                      {ayah.urdu && (
                        <p dir="rtl" className="font-arabic text-ink/70 dark:text-white/70">
                          {ayah.urdu}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}