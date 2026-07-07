# Setup Guide

## 1. Prerequisites
- Node.js 18.17+ and npm
- A PostgreSQL database — any of these work:
  - Local Postgres (`brew install postgresql` / `apt install postgresql`)
  - [Supabase](https://supabase.com) (free tier, gives you a connection string instantly)
  - [Railway](https://railway.app) or [Neon](https://neon.tech)

## 2. Clone & install
```bash
npm install
```

## 3. Configure environment variables
```bash
cp .env.example .env
```
Fill in at minimum:
- `DATABASE_URL` — your Postgres connection string
- `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` — `http://localhost:3000` for local dev

Leave `QURAN_API_BASE_URL` and `PRAYER_TIMES_API_BASE_URL` as their defaults — both point to
free public APIs that require no key.

## 4. Create the database schema
```bash
npm run db:push
```
This applies `prisma/schema.prisma` directly (good for getting started). For a real production
history of migrations, use `npm run db:migrate` instead once you're past the prototyping stage.

Alternatively, apply the raw SQL directly:
```bash
psql "$DATABASE_URL" -f sql/schema.sql
```

## 5. Seed the database
```bash
npm run db:seed
```
This will:
- Insert all 114 Surah records (instant, static data)
- Attempt to fetch and insert all ~6,236 Ayahs (Arabic/Urdu/English) from the public
  Al Quran Cloud API — **requires internet access**; if it fails, re-run `npm run db:seed`
  later once you have connectivity. The rest of the app still works without this step.
- Insert duas, names of Allah, namaz steps, small surahs, reciters, Islamic events
- Create an admin user from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`

## 6. Run the app
```bash
npm run dev
```
Visit `http://localhost:3000`.

## 7. (Optional) Run the standalone Express API
Only needed if you want a separately deployable backend instead of Next.js route handlers:
```bash
npm run server:dev
```
Runs on `http://localhost:5000` by default (`PORT` in `.env`). Point the frontend at it by
setting `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api` and swapping the relevant `fetch`
calls in `components/` from `/api/...` to `${process.env.NEXT_PUBLIC_API_BASE_URL}/...`.

## 8. Admin access
Visit `/admin/login` and sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in `.env`.
**Change this password immediately** via `npm run db:studio` (opens Prisma Studio, a GUI for
your database) if you're not building a proper "change password" UI yet.

## 9. Deployment

### Frontend → Vercel
1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add all variables from `.env` into Vercel's Environment Variables settings.
4. Deploy. Vercel auto-detects Next.js.

### Database → Supabase / Railway / Neon
Use the same `DATABASE_URL` in Vercel's env vars. Run `npm run db:push` and `npm run db:seed`
once, pointed at the production database (e.g. `DATABASE_URL=<prod-url> npm run db:seed`).

### Express API (if used) → Railway
1. New Railway project → deploy from GitHub, root directory as-is.
2. Start command: `npm run server:start`.
3. Set the same env vars (`DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL` = your Vercel URL).

## 10. Common issues
- **`db:seed` hangs or fails on ayahs** — the Al Quran Cloud API is temporarily down or your
  network blocks it; re-run later, the rest of seeding still completes.
- **NextAuth "Configuration" error** — usually a missing/short `NEXTAUTH_SECRET`.
- **Prisma Client not found** — run `npm run db:generate` after any `schema.prisma` change.
