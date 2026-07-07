import Link from "next/link";
import siparahNames from "@/data/siparahNames.json";

export default function SiparahPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">30 Siparah</h1>
      <p className="mt-2 text-ink/60 dark:text-white/60">
        Browse the Quran by Juz (Para) — each card shows its traditional name.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {siparahNames.map(({ number, name, arabic }) => (
          <Link
            key={number}
            href={`/siparah/${number}`}
            className="flex flex-col items-center justify-center gap-1 rounded-xl2 border border-primary-100 bg-white p-4 text-center shadow-card transition hover:border-gold/50 hover:shadow-lg dark:border-primary-900 dark:bg-night-card"
          >
            <span className="text-2xl font-bold text-primary-700 dark:text-gold-light">{number}</span>
            <span dir="rtl" className="font-arabic text-lg text-ink dark:text-white">{arabic}</span>
            <span className="text-xs font-medium text-ink/70 dark:text-white/70">{name}</span>
            <span className="text-[10px] uppercase tracking-wide text-ink/40 dark:text-white/40">
              Siparah
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}