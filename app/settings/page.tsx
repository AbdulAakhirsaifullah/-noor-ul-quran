"use client";

import { useTheme } from "@/components/layout/ThemeProvider";

export default function SettingsPage() {
  const { theme, toggleTheme, elderMode, toggleElderMode } = useTheme();

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">Settings</h1>

      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between rounded-xl2 border border-primary-100 bg-white p-4 dark:border-primary-900 dark:bg-night-card">
          <span className="font-medium">Dark Mode</span>
          <button onClick={toggleTheme} className="rounded-full bg-primary-600 px-4 py-1.5 text-sm font-medium text-white">
            {theme === "dark" ? "On" : "Off"}
          </button>
        </div>
        <div className="flex items-center justify-between rounded-xl2 border border-primary-100 bg-white p-4 dark:border-primary-900 dark:bg-night-card">
          <span className="font-medium">Elder Mode (larger text)</span>
          <button onClick={toggleElderMode} className="rounded-full bg-primary-600 px-4 py-1.5 text-sm font-medium text-white">
            {elderMode ? "On" : "Off"}
          </button>
        </div>
        <p className="text-xs text-ink/50 dark:text-white/50">
          Language, Arabic font size, translation toggle, audio speed, and auto-scroll live in the
          `User` model's preference fields — surface each as a control here once signed in.
        </p>
      </div>
    </div>
  );
}
