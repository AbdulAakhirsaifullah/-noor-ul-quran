# Sample / Seed Data

These JSON files are used by `prisma/seed.ts` to populate the database on first setup,
and act as a static fallback in the frontend when the API/DB is unavailable.

- `duas.json` — 17 verified daily duas across the requested categories (Morning, Evening,
  Sleeping, Travel, Istikhara, Parents, Forgiveness, Rain, Sickness, Protection, etc.)
  Each entry cites its hadith/Quran reference — always cross-check with a scholar or
  trusted source (e.g. hisnulmuslim.com) before publishing to production.
- `namesOfAllah.json` — a **starter subset (26 of 99)** of the Beautiful Names of Allah.
  Expand this to the full 99 before launch — a verified list is available at
  sunnah.com or via the `https://api.aladhan.com/v1/asmaAlHusna` endpoint, which the
  seed script can be pointed at instead of this static file (see `prisma/seed.ts`).
- `smallSurahs.json` — the 13 short, frequently-recited Surahs (Al-Ikhlas through Al-Fil).
- `namazSteps.json` — the sequence of recitations within Salah, from Takbeer to Salam.
- `quranSurahMeta.json` — metadata (name, meaning, revelation place, ayah count) for
  all 114 Surahs, used to seed the `surahs` table. Full Arabic/translation text for all
  6,236 ayahs is **not bundled here** (it's large) — `prisma/seed.ts` fetches it from the
  public Al Quran Cloud API (`api.alquran.cloud`) at seed time. See SETUP.md.

⚠️ Religious content note: every text here should be reviewed by someone with the
appropriate knowledge before going live — this scaffold prioritizes structure and
correctness of *code*, not scholarly certification of *content*.
