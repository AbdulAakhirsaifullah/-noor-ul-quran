import smallSurahs from "@/data/smallSurahs.json";

export default function SmallSurahsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">Small Surahs</h1>
      <p className="mt-2 text-ink/60 dark:text-white/60">Short Surahs, frequently recited in daily prayers.</p>

      <div className="mt-8 space-y-5">
        {smallSurahs.map((s: any) => (
          <div key={s.surahId} className="rounded-xl2 border border-primary-100 bg-white p-6 shadow-card dark:border-primary-900 dark:bg-night-card">
            <h2 className="font-display text-lg font-semibold">{s.name}</h2>
            <p dir="rtl" className="ayah-arabic mt-3 text-right text-2xl">{s.arabic}</p>
            <p className="mt-3 text-sm">{s.translationEnglish}</p>
            <p dir="rtl" className="mt-1 text-right text-sm">{s.translationUrdu}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
