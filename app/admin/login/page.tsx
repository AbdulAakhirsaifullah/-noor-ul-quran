"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = await signIn("credentials", { redirect: false, email, password });
    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push("/admin/dashboard");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm items-center px-4">
      <form onSubmit={handleSubmit} className="w-full rounded-xl2 border border-primary-100 bg-white p-8 shadow-card dark:border-primary-900 dark:bg-night-card">
        <h1 className="font-display text-2xl font-bold">Admin Login</h1>
        <p className="mt-1 text-sm text-ink/60 dark:text-white/60">Manage Surahs, Duas, Tafsir, and Users.</p>

        <label className="mt-6 block text-sm font-medium">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-primary-200 p-2.5 dark:border-primary-800 dark:bg-night"
        />

        <label className="mt-4 block text-sm font-medium">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-primary-200 p-2.5 dark:border-primary-800 dark:bg-night"
        />

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button type="submit" className="mt-6 w-full rounded-full bg-primary-700 py-2.5 font-semibold text-white hover:bg-primary-600">
          Sign In
        </button>
      </form>
    </div>
  );
}
