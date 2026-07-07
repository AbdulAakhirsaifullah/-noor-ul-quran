export default function RamadanPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">Ramadan</h1>
      <p className="mt-2 text-ink/60 dark:text-white/60">
        Sehri &amp; Iftar times (derive from the same Aladhan timings used on /prayer-times —
        Sehri ends at Fajr, Iftar begins at Maghrib), Ramadan duas (filter `/duas?category=Ramadan`
        once seeded), Laylat-ul-Qadr reminders, and a Zakat calculator.
      </p>
    </div>
  );
}
