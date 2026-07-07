"use client";

import { useEffect, useState } from "react";

interface Timings {
  Fajr: string; Sunrise: string; Dhuhr: string; Asr: string; Maghrib: string; Isha: string;
}

export default function PrayerTimesPage() {
  const [timings, setTimings] = useState<Timings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locationLabel, setLocationLabel] = useState("Detecting location...");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation isn't supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocationLabel(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
        try {
          const base = process.env.NEXT_PUBLIC_PRAYER_TIMES_API_BASE_URL ?? "https://api.aladhan.com/v1";
          const res = await fetch(`${base}/timings?latitude=${latitude}&longitude=${longitude}&method=2`);
          const json = await res.json();
          setTimings(json.data.timings);
        } catch {
          setError("Couldn't reach the prayer times service.");
        }
      },
      () => setError("Location permission was denied — enable it to see local prayer times.")
    );
  }, []);

  const rows = timings
    ? [
        ["Fajr", timings.Fajr],
        ["Sunrise", timings.Sunrise],
        ["Dhuhr", timings.Dhuhr],
        ["Asr", timings.Asr],
        ["Maghrib", timings.Maghrib],
        ["Isha", timings.Isha],
      ]
    : [];

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-center">Prayer Times</h1>
      <p className="mt-2 text-center text-sm text-ink/60 dark:text-white/60">{locationLabel}</p>

      {error && <p className="mt-6 rounded-xl bg-red-50 p-4 text-center text-sm text-red-700">{error}</p>}

      {timings && (
        <div className="mt-8 divide-y divide-primary-100 overflow-hidden rounded-xl2 border border-primary-100 bg-white dark:divide-primary-900 dark:border-primary-900 dark:bg-night-card">
          {rows.map(([name, time]) => (
            <div key={name} className="flex items-center justify-between px-6 py-4">
              <span className="font-medium">{name}</span>
              <span className="font-display text-lg text-primary-700 dark:text-gold-light">{time}</span>
            </div>
          ))}
        </div>
      )}

      {!timings && !error && (
        <p className="mt-8 text-center text-sm text-ink/50 dark:text-white/50">Waiting for location permission…</p>
      )}
    </div>
  );
}
