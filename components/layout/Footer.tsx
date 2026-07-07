import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-primary-100 bg-primary-700 py-10 text-primary-50 dark:border-primary-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="font-display text-lg">Noor-ul-Quran</p>
        <p className="mt-1 max-w-xl text-sm text-primary-100/80">
          One place for Quran, Namaz, Duas, Prayer Times and daily worship — built to be simple
          enough for a grandparent and rich enough for a hafiz.
        </p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-primary-100/80">
          <Link href="/quran" className="hover:text-gold">Quran</Link>
          <Link href="/duas" className="hover:text-gold">Duas</Link>
          <Link href="/prayer-times" className="hover:text-gold">Prayer Times</Link>
          <Link href="/settings" className="hover:text-gold">Settings</Link>
          <Link href="/admin/login" className="hover:text-gold">Admin</Link>
        </div>
        <p className="mt-6 text-xs text-primary-100/60">
          Quran text and prayer time data are sourced from public references (Al Quran Cloud,
          Aladhan) — always verify against a mushaf and local masjid for worship purposes.
        </p>
        <p className="mt-4 text-xs text-primary-100/70">
          Made with ❤️ by <span className="font-semibold text-gold">Abdul Aakhir Saifullah</span>
        </p>
      </div>
    </footer>
  );
}
