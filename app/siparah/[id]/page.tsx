import { notFound } from "next/navigation";
import siparahNames from "@/data/siparahNames.json";
import { getJuz } from "@/lib/quranApi";
import { JuzReader } from "@/components/quran/JuzReader";

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return siparahNames.map((s) => ({ id: String(s.number) }));
}

export default async function SiparahDetailPage({ params }: Props) {
  const juzNumber = Number(params.id);
  const meta = siparahNames.find((s) => s.number === juzNumber);
  if (!meta || juzNumber < 1 || juzNumber > 30) return notFound();

  let editions: any[] = [];
  try {
    editions = await getJuz(juzNumber);
  } catch {
    editions = [];
  }

  return <JuzReader meta={meta} editions={editions} />;
}