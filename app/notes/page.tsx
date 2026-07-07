"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { NotebookPen, Trash2 } from "lucide-react";

type NoteItem = {
  id: string;
  content: string;
  updatedAt: string;
  ayah: {
    numberInSurah: number;
    surah: { nameEnglish: string };
  };
};

export default function NotesPage() {
  const { status } = useSession();
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Record<string, string>>({});

  useEffect(() => {
    if (status !== "authenticated") {
      setLoading(false);
      return;
    }
    fetch("/api/notes")
      .then((r) => r.json())
      .then((res) => setNotes(res.data ?? []))
      .finally(() => setLoading(false));
  }, [status]);

  async function saveNote(id: string) {
    const content = editing[id];
    if (content === undefined) return;
    await fetch("/api/notes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, content }),
    });
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, content } : n)));
  }

  async function deleteNote(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    await fetch(`/api/notes?id=${id}`, { method: "DELETE" });
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink dark:text-white">Notes</h1>
      <p className="mt-2 text-ink/60 dark:text-white/60">
        Personal reflections you've written against specific Ayahs while reading. New notes are
        added from the Ayah action bar in the Quran reader.
      </p>

      {status === "unauthenticated" && (
        <div className="mt-8 rounded-xl2 border border-dashed border-primary-100 bg-white p-8 text-center shadow-card dark:border-primary-900 dark:bg-night-card">
          <NotebookPen className="mx-auto h-8 w-8 text-primary" />
          <p className="mt-3 text-ink/70 dark:text-white/70">Sign in to write and sync notes.</p>
          <button
            onClick={() => signIn()}
            className="mt-4 rounded-full bg-primary px-6 py-2 font-medium text-white shadow-card transition hover:bg-primary-700"
          >
            Sign in
          </button>
        </div>
      )}

      {status === "authenticated" && loading && (
        <div className="mt-8 space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl2 bg-primary-50 dark:bg-primary-900/40" />
          ))}
        </div>
      )}

      {status === "authenticated" && !loading && notes.length === 0 && (
        <p className="mt-8 text-ink/60 dark:text-white/60">No notes yet.</p>
      )}

      <ul className="mt-6 space-y-4">
        {notes.map((n) => (
          <li
            key={n.id}
            className="rounded-xl2 border border-primary-100 bg-white p-4 shadow-card dark:border-primary-900 dark:bg-night-card"
          >
            <p className="text-sm font-medium text-primary">
              {n.ayah.surah.nameEnglish} — Ayah {n.ayah.numberInSurah}
            </p>
            <textarea
              defaultValue={n.content}
              onChange={(e) => setEditing((s) => ({ ...s, [n.id]: e.target.value }))}
              onBlur={() => saveNote(n.id)}
              className="mt-2 w-full resize-none rounded-xl border border-primary-100 bg-paper p-3 text-sm text-ink outline-none focus:border-primary dark:border-primary-900 dark:bg-night dark:text-white"
              rows={3}
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => deleteNote(n.id)}
                className="flex items-center gap-1 rounded-full px-3 py-1 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
