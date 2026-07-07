# Noor-ul-Quran

A complete Islamic Quran web platform: read the Holy Quran with Arabic, Urdu and English
translation, listen to reciters, keep up with prayer times and Qibla direction, recite daily
duas, count tasbeeh, and more — all in one place. Built for children, adults, and elderly users
alike (see **Elder Mode** in Settings).

> **Read this first:** this repository is a **complete, working scaffold** — real Next.js pages,
> a real Prisma/PostgreSQL schema, a real Express API, and real seed data for the pieces that are
> genuinely static and unchanging (Surah names, small Surahs, duas, namaz steps). It is **not**
> pre-deployed and does **not** ship a pre-filled production database — you run the setup steps
> in `SETUP.md` to stand it up. See "What's fully built vs. what's scaffolded" below for an
> honest breakdown.

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion |
| Backend | Next.js Route Handlers (`app/api/*`) **and** an optional standalone Express API (`server/`) |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth (Credentials + Google OAuth), JWT for the Express API |
| External data | [Al Quran Cloud API](https://alquran.cloud/api) (Quran text/translations/audio), [Aladhan API](https://aladhan.com/prayer-times-api) (prayer times, Hijri calendar) |
| Deployment | Vercel (frontend) + Railway/Supabase/Neon (Postgres + optional Express API) |

## Folder Structure

```
noor-ul-quran/
├── app/                      # Next.js App Router pages & API routes
│   ├── quran/                # Surah index + /quran/[surahId] reader
│   ├── siparah/ namaz/ small-surahs/ duas/ names-of-allah/
│   ├── tasbeeh/ qibla/ prayer-times/ islamic-calendar/ ramadan/
│   ├── search/ bookmarks/ notes/ settings/
│   ├── admin/{login,dashboard}/
│   └── api/{surahs,duas,auth}/
├── components/               # Reusable UI (layout, quran, dua, home, ui)
├── lib/                      # prisma client, next-auth config, quran API wrapper
├── prisma/
│   ├── schema.prisma         # full data model (17 models)
│   └── seed.ts               # seeds DB from data/*.json + live Quran API
├── data/                     # static reference JSON (duas, names, namaz steps, surah meta)
├── server/                   # optional standalone Express API (mirrors app/api)
├── sql/schema.sql            # raw SQL equivalent of schema.prisma
└── SETUP.md, API_DOCS.md
```

## What's fully built vs. what's scaffolded

**Fully working, real code:**
- Complete Prisma schema (17 models) + equivalent raw SQL
- Home page with all requested sections, responsive, dark mode, Islamic green/gold theme
- Surah index (114 surahs, real metadata) + Surah reader pulling **live** Arabic/Urdu/English
  text and per-ayah audio from the public Quran API
- Duas page (17 real, referenced duas) with category filtering
- Namaz page (all 14 steps of Salah, Arabic/Urdu/English)
- Small Surahs, 99 Names of Allah (starter subset — expand to 99, see `data/README.md`)
- Tasbeeh counter (interactive, multi-zikr, target, history)
- Prayer Times (real geolocation + Aladhan API call)
- Qibla compass (real great-circle bearing calculation + device orientation)
- NextAuth credentials + Google OAuth wiring, JWT auth for the Express API
- Admin login + dashboard shell with live stats from the DB
- Bookmarks, Notes, and Tasbeeh are fully wired end-to-end: real `app/api/{bookmarks,notes,tasbeeh}`
  route handlers backed by Prisma, sign-in-aware client pages (guests get a working in-memory
  fallback, signed-in users get real persistence, e.g. Tasbeeh debounce-saves 600ms after each tap)
- Parallel Express API (`server/`) with surahs/duas/bookmarks/tasbeeh/users/auth routes, its own
  `server/package.json`, for teams who want the backend deployed separately from Vercel

**Scaffolded (structure + comments, needs your finishing touches):**
- Siparah/Islamic Calendar/Ramadan/Search pages are stubbed with clear instructions on which
  endpoint/model to wire up — same pattern as the finished pages
- Admin CRUD forms (the dashboard shows live counts; the "Manage X" panels need table+form UI)
- PWA icons, push notifications, offline caching strategy (next-pwa is configured; add icons)
- Tajweed color-highlighting, Hifz tracker, AI Islamic Assistant, voice search — these are
  genuinely large sub-features; the schema and folder structure leave room for them but they
  aren't implemented here

This is the honest state of things — a real, runnable foundation rather than a facade.

## Quick Start

See **SETUP.md** for full instructions. tl;dr:

```bash
npm install
cp .env.example .env      # fill in DATABASE_URL, NEXTAUTH_SECRET, etc.
npm run db:push           # create tables from schema.prisma
npm run db:seed           # populate surahs, duas, names, admin user
npm run dev                # http://localhost:3000
```

## License & Content Notes

Quran text, translations, and hadith references are pulled from public, widely-used sources
(Al Quran Cloud, Aladhan). Always have someone with the appropriate Islamic knowledge review
religious content before public launch — this project handles the *engineering*, not scholarly
certification.
