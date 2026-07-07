export default function IslamicCalendarPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">Islamic Calendar</h1>
      <p className="mt-2 text-ink/60 dark:text-white/60">
        Hijri date conversion and upcoming Islamic events. Wire this page to
        `https://api.aladhan.com/v1/gToH` for live Gregorian→Hijri conversion, and to the
        `islamic_events` table (seeded in prisma/seed.ts) for the events list below.
      </p>
    </div>
  );
}
