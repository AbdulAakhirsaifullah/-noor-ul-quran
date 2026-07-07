/**
 * Thin wrapper around the public Al Quran Cloud API, used both as a live data
 * source and as the reference the seed script pulls from. Falls back cleanly
 * so pages don't crash if the API is briefly unavailable.
 */
const BASE = process.env.QURAN_API_BASE_URL ?? "https://api.alquran.cloud/v1";

export async function getSurahList() {
  const res = await fetch(`${BASE}/surah`, { next: { revalidate: 60 * 60 * 24 } });
  if (!res.ok) throw new Error("Failed to fetch surah list");
  const json = await res.json();
  return json.data as Array<{
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
    numberOfAyahs: number;
  }>;
}

export async function getSurah(surahNumber: number, editions: string[] = ["quran-uthmani", "en.sahih", "ur.jalandhry"]) {
  const res = await fetch(`${BASE}/surah/${surahNumber}/editions/${editions.join(",")}`, {
    next: { revalidate: 60 * 60 * 24 },
  });
  if (!res.ok) throw new Error(`Failed to fetch surah ${surahNumber}`);
  const json = await res.json();
  return json.data; // array, one entry per edition, each with .ayahs[]
}

export async function searchQuran(keyword: string, edition = "en") {
  const res = await fetch(`${BASE}/search/${encodeURIComponent(keyword)}/all/${edition}`);
  if (!res.ok) throw new Error("Search failed");
  const json = await res.json();
  return json.data?.matches ?? [];
}

export function audioUrlFor(reciterKey: string, ayahNumberInQuran: number) {
  // cdn.islamic.network hosts per-ayah mp3s keyed by global ayah number
  const reciterMap: Record<string, string> = {
    mishary_rashid: "ar.alafasy",
    abdul_rahman_sudais: "ar.abdurrahmaansudais",
    maher_al_muaiqly: "ar.mahermuaiqly",
    abdul_basit: "ar.abdulbasitmurattal",
  };
  const edition = reciterMap[reciterKey] ?? "ar.alafasy";
  return `https://cdn.islamic.network/quran/audio/128/${edition}/${ayahNumberInQuran}.mp3`;
}
