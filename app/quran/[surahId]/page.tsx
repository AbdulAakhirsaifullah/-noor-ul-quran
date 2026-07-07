import surahMeta from "@/data/quranSurahMeta.json";
import { getSurah } from "@/lib/quranApi";
import { SurahReader } from "@/components/quran/SurahReader";
import { notFound } from "next/navigation";

interface Props {
  params: { surahId: string };
}

export function generateStaticParams() {
  return surahMeta.map((s: any) => ({ surahId: String(s.id) }));
}

export default async function SurahPage({ params }: Props) {
  const surahId = Number(params.surahId);
  const meta = (surahMeta as any[]).find((s) => s.id === surahId);
  if (!meta) return notFound();

  // Fetch live text/translations; SurahReader also works with just `meta` if this fails.
  let editions: any[] = [];
  try {
    editions = await getSurah(surahId);
  } catch {
    editions = [];
  }

  return <SurahReader meta={meta} editions={editions} />;
}
