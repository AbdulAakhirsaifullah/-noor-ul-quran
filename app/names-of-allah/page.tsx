import names from "@/data/namesOfAllah.json";

export default function NamesOfAllahPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">99 Names of Allah</h1>
      <p className="mt-2 text-ink/60 dark:text-white/60">Al-Asma ul-Husna — the Most Beautiful Names.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {names.map((n: any) => (
          <div key={n.number} className="rounded-xl2 border border-primary-100 bg-white p-5 text-center shadow-card dark:border-primary-900 dark:bg-night-card">
            <span className="text-xs text-gold-dark">#{n.number}</span>
            <p className="font-arabic mt-1 text-2xl text-primary-700 dark:text-gold-light">{n.arabic}</p>
            <p className="mt-1 text-sm font-semibold">{n.transliteration}</p>
            <p className="mt-1 text-xs text-ink/60 dark:text-white/60">{n.meaningEnglish}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs text-ink/40 dark:text-white/40">
        Showing a starter subset — expand `data/namesOfAllah.json` to all 99 before launch (see data/README.md).
      </p>
    </div>
  );
}
