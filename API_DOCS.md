# API Documentation

Two equivalent APIs are provided:
- **Next.js Route Handlers** at `/api/*` (runs alongside the frontend, deploys to Vercel as-is)
- **Standalone Express API** in `server/`, mounted at `/api/*` on its own port (for teams who
  want backend and frontend deployed separately)

Both talk to the same PostgreSQL database via Prisma and share response shapes below.

Base URL (Next.js): `http://localhost:3000/api`
Base URL (Express): `http://localhost:5000/api`

All responses are JSON. Successful responses wrap data as `{ "data": ... }`. Errors are
`{ "error": "message" }` with an appropriate HTTP status code.

---

## Surahs

### `GET /surahs`
List all 114 surahs.
```json
{ "data": [ { "id": 1, "nameArabic": "الفاتحة", "nameEnglish": "Al-Fatiha", "totalAyahs": 7, ... } ] }
```

### `GET /surahs/:id`
One surah with all its ayahs. `id` is 1–114.
```json
{ "data": { "id": 1, "nameEnglish": "Al-Fatiha", "ayahs": [ { "numberInSurah": 1, "textArabic": "...", "translationEnglish": "..." } ] } }
```
`404` if the surah doesn't exist. `400` if `id` isn't a valid integer 1–114. (Express only —
the Next.js version currently exposes list + single via server components directly; add a
matching route handler at `app/api/surahs/[id]/route.ts` if you need this exact endpoint
client-side.)

### `GET /surahs/search/:keyword` (Express)
Keyword search across ayah translations (English + Urdu), case-insensitive, capped at 50
results.

---

## Duas

### `GET /duas?category=Morning`
List duas, optionally filtered by category (`Morning`, `Evening`, `Sleeping`, `Wake Up`,
`Entering Home`, `Leaving Home`, `Entering Mosque`, `Leaving Mosque`, `Eating`, `After Eating`,
`Travel`, `Istikhara`, `Parents`, `Forgiveness`, `Rain`, `Sickness`, `Protection`).

### `POST /duas` (Express, admin only)
Requires `Authorization: Bearer <jwt>` for an admin user.
```json
{ "category": "Morning", "title": "...", "arabic": "...", "transliteration": "...", "urdu": "...", "english": "...", "reference": "..." }
```

---

## Auth (Express)

### `POST /auth/register`
```json
{ "name": "Ali Khan", "email": "ali@example.com", "password": "at-least-8-chars" }
```
`201` → `{ "data": { "token": "<jwt>", "user": { "id", "name", "email" } } }`
`409` if email is already registered.

### `POST /auth/login`
```json
{ "email": "ali@example.com", "password": "..." }
```
`200` → `{ "data": { "token": "<jwt>", "user": { "id", "name", "email", "role" } } }`
`401` on invalid credentials.

For the Next.js frontend, prefer NextAuth (`/api/auth/[...nextauth]`) over calling these
directly — `signIn("credentials", { email, password })` from `next-auth/react`.

---

## Users

### `GET /users/me` (auth required)
Current user's profile + preferences.

### `PATCH /users/me` (auth required)
Update preferences. Allowed fields: `name`, `language`, `theme`, `arabicFontSize`,
`translationOn`, `tafsirOn`, `audioSpeed`, `autoScroll`, `favoriteReciter`.

### `GET /users` (admin only)
List all users — powers the Admin Dashboard's "Manage Users" panel.

---

## Bookmarks (auth required)

### `GET /bookmarks`
Current user's saved ayahs/surahs/siparahs.

### `POST /bookmarks`
```json
{ "ayahId": "clxyz...", "label": "Reminder for patience" }
```

### `DELETE /bookmarks/:id` (Express) / `DELETE /bookmarks?id=xxx` (Next.js route handler)
Removes a bookmark (only if it belongs to the requesting user). The two backends use their
respective idiomatic style — Express path params vs. a query string, since a Next.js Route
Handler at `app/api/bookmarks/route.ts` doesn't have a dynamic `[id]` segment.

---

## Notes (auth required, Next.js only — `app/api/notes/route.ts`)

### `GET /notes`
Current user's notes, newest first, each with its parent Ayah + Surah.

### `POST /notes`
```json
{ "ayahId": "clxyz...", "content": "This reminds me to be patient during hardship." }
```

### `PATCH /notes`
```json
{ "id": "clxyz...", "content": "Updated reflection text." }
```

### `DELETE /notes?id=xxx`
Removes a note (only if it belongs to the requesting user).

---

## Tasbeeh (auth required)

### `GET /tasbeeh`
All zikr counters for the current user. Unauthenticated requests get `{ data: [] }` so the
client can fall back to a local, in-memory counter for guests.

### `PUT /tasbeeh`
Upsert a counter. The Tasbeeh page debounces this call ~600ms after the last tap.
```json
{ "zikrName": "SubhanAllah", "count": 34, "targetCount": 33 }
```

---

## External APIs used

| Purpose | Provider | Docs |
|---|---|---|
| Quran text, translations, audio | Al Quran Cloud | https://alquran.cloud/api |
| Prayer times, Hijri calendar | Aladhan | https://aladhan.com/prayer-times-api |

Both are free and require no API key, which is why `lib/quranApi.ts` and the
`/prayer-times` page call them directly from the server/client rather than proxying through
your own backend — reduces load and latency. If you later want to cache/rate-limit these,
proxy them through a Next.js route handler.
