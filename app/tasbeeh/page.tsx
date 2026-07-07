"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { RotateCcw, Cloud, CloudOff } from "lucide-react";

const zikrOptions = ["SubhanAllah", "Alhamdulillah", "Allahu Akbar", "La ilaha illallah", "Astaghfirullah"];

export default function TasbeehPage() {
  const { status } = useSession();
  const [zikr, setZikr] = useState(zikrOptions[0]);
  // Signed-in users: hydrated from and persisted to TasbeehCount via /api/tasbeeh
  // (debounced ~600ms after each tap). Guests: kept in-memory for this session only.
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [target, setTarget] = useState(33);
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/tasbeeh")
      .then((r) => r.json())
      .then((res) => {
        const loaded: Record<string, number> = {};
        for (const row of res.data ?? []) loaded[row.zikrName] = row.count;
        setCounts((c) => ({ ...loaded, ...c }));
      });
  }, [status]);

  const count = counts[zikr] ?? 0;

  function persist(zikrName: string, newCount: number) {
    if (status !== "authenticated") return;
    clearTimeout(saveTimers.current[zikrName]);
    saveTimers.current[zikrName] = setTimeout(() => {
      fetch("/api/tasbeeh", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zikrName, count: newCount, targetCount: target }),
      });
    }, 600);
  }

  function increment() {
    setCounts((c) => {
      const next = (c[zikr] ?? 0) + 1;
      persist(zikr, next);
      return { ...c, [zikr]: next };
    });
  }
  function reset() {
    setCounts((c) => {
      persist(zikr, 0);
      return { ...c, [zikr]: 0 };
    });
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10 text-center sm:px-6">
      <h1 className="font-display text-3xl font-bold">Tasbeeh Counter</h1>

      <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-ink/50 dark:text-white/50">
        {status === "authenticated" ? (
          <>
            <Cloud className="h-3.5 w-3.5" /> Synced to your account
          </>
        ) : (
          <>
            <CloudOff className="h-3.5 w-3.5" /> Guest mode — sign in to save your history
          </>
        )}
      </p>

      <select
        value={zikr}
        onChange={(e) => setZikr(e.target.value)}
        className="mt-6 w-full rounded-xl border border-primary-200 bg-white p-3 text-center font-medium dark:border-primary-800 dark:bg-night-card"
      >
        {zikrOptions.map((z) => (
          <option key={z} value={z}>{z}</option>
        ))}
      </select>

      <button
        onClick={increment}
        className="mt-8 flex h-56 w-56 select-none items-center justify-center rounded-full bg-primary-700 text-6xl font-bold text-white shadow-goldGlow transition active:scale-95 mx-auto"
        aria-label={`Tap to count ${zikr}`}
      >
        {count}
      </button>

      <p className="mt-4 text-sm text-ink/60 dark:text-white/60">Target: {target}{count >= target ? " — Masha'Allah, target reached!" : ""}</p>

      <div className="mt-4 flex items-center justify-center gap-3">
        {[33, 99, 100].map((t) => (
          <button
            key={t}
            onClick={() => setTarget(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${target === t ? "bg-gold text-primary-900" : "bg-primary-50 dark:bg-primary-900"}`}
          >
            {t}
          </button>
        ))}
        <button onClick={reset} className="flex items-center gap-1 rounded-full bg-primary-50 px-4 py-1.5 text-sm font-medium dark:bg-primary-900">
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
      </div>

      <div className="mt-10 rounded-xl2 border border-primary-100 bg-white p-4 text-left text-sm dark:border-primary-900 dark:bg-night-card">
        <p className="mb-2 font-semibold">History (this session)</p>
        {Object.keys(counts).length === 0 && <p className="text-ink/50 dark:text-white/50">No zikr counted yet.</p>}
        <ul className="space-y-1">
          {Object.entries(counts).map(([z, c]) => (
            <li key={z} className="flex justify-between">
              <span>{z}</span>
              <span className="font-medium">{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
