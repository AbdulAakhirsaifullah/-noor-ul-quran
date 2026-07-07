/**
 * Noor-ul-Quran — Database Seed Script
 *
 * Populates: Surahs (114), Ayahs (6,236 — fetched from the public Al Quran Cloud
 * API), Duas, Names of Allah, Namaz Steps, Small Surahs, Reciters, an Admin user,
 * and a handful of Islamic calendar events.
 *
 * Run with: npm run db:seed
 */
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

function loadJson<T = any>(relativePath: string): T {
  const fullPath = path.join(process.cwd(), relativePath);
  return JSON.parse(fs.readFileSync(fullPath, "utf-8"));
}

const surahMeta = loadJson("data/quranSurahMeta.json");
const duas = loadJson("data/duas.json");
const namesOfAllah = loadJson("data/namesOfAllah.json");
const namazSteps = loadJson("data/namazSteps.json");
const smallSurahs = loadJson("data/smallSurahs.json");
const prisma = new PrismaClient();
const QURAN_API = process.env.QURAN_API_BASE_URL ?? "https://api.alquran.cloud/v1";

async function seedSurahs() {
  console.log("Seeding surahs...");
  for (const s of surahMeta as any[]) {
    // crude siparah-start estimate; refine with a proper juz-boundary table in production
    const siparahStart = Math.max(1, Math.min(30, Math.ceil((s.id / 114) * 30)));
    await prisma.surah.upsert({
      where: { id: s.id },
      update: {},
      create: {
        id: s.id,
        nameArabic: s.nameArabic,
        nameEnglish: s.nameEnglish,
        nameTranslation: s.nameTranslation,
        revelationPlace: s.revelationPlace,
        revelationOrder: s.revelationOrder,
        totalAyahs: s.totalAyahs,
        siparahStart,
        bismillahPresent: s.bismillahPresent,
      },
    });
  }
  console.log(`  -> ${surahMeta.length} surahs upserted.`);
}

/**
 * Ayah text/translations are ~6,236 rows — too large to bundle as static JSON.
 * We pull them at seed-time from the Al Quran Cloud public API (Arabic + Urdu +
 * English editions) so the DB is fully populated without shipping a huge file.
 * This requires network access at seed-time; if unavailable, this step is skipped
 * gracefully and the app will still run (surah list/metadata still works).
 */
async function seedAyahs() {
  console.log("Seeding ayahs (this calls an external API and may take a while)...");
  try {
    const editions = ["quran-uthmani", "ur.jalandhry", "en.sahih"];
    const [arabicRes, urduRes, englishRes] = await Promise.all(
      editions.map((e) => fetch(`${QURAN_API}/quran/${e}`).then((r) => r.json()))
    );

    const arabicSurahs = arabicRes.data.surahs;
    const urduSurahs = urduRes.data.surahs;
    const englishSurahs = englishRes.data.surahs;

    let globalCount = 0;
    for (let i = 0; i < arabicSurahs.length; i++) {
      const surahId = i + 1;
      const ayahsAr = arabicSurahs[i].ayahs;
      const ayahsUr = urduSurahs[i].ayahs;
      const ayahsEn = englishSurahs[i].ayahs;

      for (let j = 0; j < ayahsAr.length; j++) {
        globalCount++;
        await prisma.ayah.upsert({
          where: { numberInQuran: ayahsAr[j].number },
          update: {},
          create: {
            surahId,
            numberInSurah: ayahsAr[j].numberInSurah,
            numberInQuran: ayahsAr[j].number,
            siparahNumber: ayahsAr[j].juz,
            rukuNumber: ayahsAr[j].ruku,
            pageNumber: ayahsAr[j].page,
            textArabic: ayahsAr[j].text,
            translationUrdu: ayahsUr[j]?.text ?? null,
            translationEnglish: ayahsEn[j]?.text ?? null,
            sajdah: Boolean(ayahsAr[j].sajda),
          },
        });
      }
    }
    console.log(`  -> ${globalCount} ayahs upserted.`);
  } catch (err) {
    console.warn("  !! Skipped ayah seeding (no network or API unavailable):", (err as Error).message);
    console.warn("     Run `npm run db:seed` again once network access to api.alquran.cloud is available.");
  }
}

async function seedDuas() {
  console.log("Seeding duas...");
  for (const d of duas as any[]) {
    await prisma.dua.create({ data: d });
  }
  console.log(`  -> ${duas.length} duas inserted.`);
}

async function seedNamesOfAllah() {
  console.log("Seeding 99 Names of Allah (starter subset)...");
  for (const n of namesOfAllah as any[]) {
    await prisma.nameOfAllah.upsert({
      where: { number: n.number },
      update: {},
      create: n,
    });
  }
  console.log(`  -> ${namesOfAllah.length} names inserted.`);
}

async function seedNamazSteps() {
  console.log("Seeding namaz steps...");
  for (const step of namazSteps as any[]) {
    await prisma.namazStep.upsert({
      where: { order: step.order },
      update: {},
      create: step,
    });
  }
  console.log(`  -> ${namazSteps.length} namaz steps inserted.`);
}

async function seedSmallSurahs() {
  console.log("Seeding small surahs...");
  for (const s of smallSurahs as any[]) {
    await prisma.smallSurah.upsert({
      where: { surahId: s.surahId },
      update: {},
      create: {
        surahId: s.surahId,
        arabic: s.arabic,
        transliteration: s.name,
        translationUrdu: s.translationUrdu,
        translationEnglish: s.translationEnglish,
      },
    });
  }
  console.log(`  -> ${smallSurahs.length} small surahs inserted.`);
}

async function seedReciters() {
  console.log("Seeding reciters...");
  const reciters = [
    { key: "mishary_rashid", name: "Mishary Rashid Alafasy", style: "Murattal", audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy" },
    { key: "abdul_rahman_sudais", name: "Abdul Rahman Al-Sudais", style: "Murattal", audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.abdurrahmaansudais" },
    { key: "maher_al_muaiqly", name: "Maher Al Muaiqly", style: "Murattal", audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.mahermuaiqly" },
    { key: "abdul_basit", name: "Abdul Basit Abdus Samad", style: "Mujawwad", audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.abdulbasitmurattal" },
  ];
  for (const r of reciters) {
    await prisma.reciter.upsert({ where: { key: r.key }, update: {}, create: r });
  }
  console.log(`  -> ${reciters.length} reciters inserted.`);
}

async function seedIslamicEvents() {
  console.log("Seeding Islamic calendar events...");
  const events = [
    { title: "Start of Ramadan", hijriDate: "1 Ramadan", category: "Ramadan", description: "The beginning of the month of fasting." },
    { title: "Laylat al-Qadr", hijriDate: "27 Ramadan (estimated)", category: "Ramadan", description: "The Night of Decree, sought within the last ten nights of Ramadan." },
    { title: "Eid al-Fitr", hijriDate: "1 Shawwal", category: "Eid", description: "Festival marking the end of Ramadan." },
    { title: "Day of Arafah", hijriDate: "9 Dhul Hijjah", category: "Hajj", description: "The most important day of Hajj." },
    { title: "Eid al-Adha", hijriDate: "10 Dhul Hijjah", category: "Eid", description: "Festival of Sacrifice." },
    { title: "Ashura", hijriDate: "10 Muharram", category: "Ashura", description: "A recommended day of fasting." },
    { title: "Mawlid al-Nabi", hijriDate: "12 Rabi-ul-Awwal", category: "Rabi-ul-Awwal", description: "Commemoration of the birth of Prophet Muhammad ﷺ (observance varies by school of thought)." },
  ];
  for (const e of events) {
    await prisma.islamicEvent.create({ data: e });
  }
  console.log(`  -> ${events.length} events inserted.`);
}

async function seedAdmin() {
  console.log("Seeding admin account...");
  const email = process.env.ADMIN_EMAIL ?? "admin@noorulquran.app";
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { name: "Admin", email, password: hashed, role: Role.ADMIN },
  });
  console.log(`  -> Admin ready: ${email} (change the password after first login!)`);
}

async function main() {
  await seedSurahs();
  await seedAyahs();
  await seedDuas();
  await seedNamesOfAllah();
  await seedNamazSteps();
  await seedSmallSurahs();
  await seedReciters();
  await seedIslamicEvents();
  await seedAdmin();
  console.log("\n✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
