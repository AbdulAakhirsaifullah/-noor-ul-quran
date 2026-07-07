"use client";
import { useState } from "react";

export default function SearchPage() {
  const [q, setQ] = useState("");
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">Search</h1>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search Surah, Ayah, keyword, or Dua..."
        className="mt-6 w-full rounded-xl border border-primary-200 p-3 dark:border-primary-800 dark:bg-night-card"
      />
      <p className="mt-4 text-sm text-ink/50 dark:text-white/50">
        Wire this input to `/api/surahs/search/:keyword` (ayah text) and `/api/duas?search=` for
        instant results — debounce input and call both endpoints in parallel.
      </p>
    </div>
  );
}
