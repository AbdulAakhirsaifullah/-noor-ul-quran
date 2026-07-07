"use client";

import Link from "next/link";
import { useState } from "react";
import { Moon, Sun, Menu, X, Search, BookOpenText } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const links = [
  { href: "/quran", label: "Quran" },
  { href: "/siparah", label: "30 Siparah" },
  { href: "/namaz", label: "Namaz" },
  { href: "/duas", label: "Duas" },
  { href: "/prayer-times", label: "Prayer Times" },
  { href: "/qibla", label: "Qibla" },
  { href: "/tasbeeh", label: "Tasbeeh" },
  { href: "/ramadan", label: "Ramadan" },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-primary-100 bg-paper/90 backdrop-blur dark:bg-night/90 dark:border-primary-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary-700 dark:text-primary-100">
          <BookOpenText className="h-6 w-6 text-gold" aria-hidden />
          Noor-ul-Quran
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-ink/80 hover:text-primary-600 dark:text-white/80 dark:hover:text-gold transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/search" aria-label="Search" className="rounded-full p-2 hover:bg-primary-50 dark:hover:bg-primary-900">
            <Search className="h-5 w-5" />
          </Link>
          <button onClick={toggleTheme} aria-label="Toggle dark mode" className="rounded-full p-2 hover:bg-primary-50 dark:hover:bg-primary-900">
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
          <button className="lg:hidden rounded-full p-2 hover:bg-primary-50 dark:hover:bg-primary-900" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden flex flex-col gap-1 border-t border-primary-100 px-4 py-3 dark:border-primary-900">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900">
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
