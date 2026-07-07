"use client";

import { useMemo, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import duas from "@/data/duas.json";

export default function DuasPage() {
  const categories = useMemo(() => ["All", ...Array.from(new Set(duas.map((d) => d.category)))], []);
  const [active, setActive] = useState("All");
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const filtered = active === "All" ? duas : duas.filter((d) => d.category === active);

  function playAudio(i: number, url?: string) {
    if (!url) return; // no recording uploaded yet for this dua
    setPlayingIndex(i);
    const audio = new Audio(url);
    audio.play().catch(() => setPlayingIndex(null));
    audio.onended = () => setPlayingIndex(null);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">Daily Duas</h1>
      <p className="mt-2 text-ink/60 dark:text-white/60">Supplications for every moment of the day.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              active === c ? "bg-primary-600 text-white" : "bg-primary-50 text-ink/70 hover:bg-primary-100 dark:bg-primary-900 dark:text-white/70"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-5">
        {filtered.map((d: any, i) => (
          <div key={i} className="rounded-xl2 border border-primary-100 bg-white p-6 shadow-card dark:border-primary-900 dark:bg-night-card">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-semibold">{d.title}</h2>
              <div className="flex shrink-0 items-center gap-2">
                <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-medium text-gold-dark">{d.category}</span>
                <button
                  onClick={() => playAudio(i, d.audioUrl)}
                  title={d.audioUrl ? "Play recitation" : "Audio coming soon"}
                  className={`rounded-full p-2 transition ${
                    d.audioUrl
                      ? "bg-primary-50 text-primary hover:bg-primary-100 dark:bg-primary-900 dark:text-primary-100"
                      : "cursor-not-allowed bg-ink/5 text-ink/30 dark:bg-white/5 dark:text-white/30"
                  }`}
                >
                  {playingIndex === i ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Line-by-line breakdown */}
            <p dir="rtl" className="ayah-arabic mt-4 text-right text-2xl">{d.arabic}</p>
            <p className="mt-3 text-sm italic text-ink/60 dark:text-white/60">{d.transliteration}</p>
            <p className="mt-2 text-sm">{d.english}</p>
            <p dir="rtl" className="mt-2 text-right text-sm">{d.urdu}</p>
            {d.meaning && <p className="mt-3 text-xs text-ink/50 dark:text-white/50">{d.meaning}</p>}
            {d.reference && <p className="mt-1 text-xs text-gold-dark">Reference: {d.reference}</p>}

            {/* Full dua, read as one continuous passage */}
            <div className="mt-5 rounded-xl border border-dashed border-gold/40 bg-gold/5 p-4">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gold-dark">
                Full Dua
              </p>
              <p dir="rtl" className="ayah-arabic text-right text-xl leading-loose">
                {d.arabic}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink/80 dark:text-white/80">
                {d.transliteration} — {d.english}
              </p>
              {!d.audioUrl && (
                <p className="mt-2 text-[11px] italic text-ink/40 dark:text-white/40">
                  🔇 Audio recitation not uploaded yet for this dua.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}