-- ============================================================
-- Noor-ul-Quran — Raw SQL Schema (PostgreSQL)
-- Equivalent to prisma/schema.prisma — use this if you are not
-- using Prisma migrations, or to review the schema directly.
-- Run with: psql -U noor_user -d noor_ul_quran -f sql/schema.sql
-- ============================================================

CREATE TYPE role_enum AS ENUM ('USER', 'ADMIN');

CREATE TABLE users (
  id               TEXT PRIMARY KEY,
  name             TEXT,
  email            TEXT UNIQUE NOT NULL,
  email_verified   TIMESTAMP,
  password         TEXT,
  image            TEXT,
  role             role_enum NOT NULL DEFAULT 'USER',
  language         TEXT NOT NULL DEFAULT 'en',
  theme            TEXT NOT NULL DEFAULT 'light',
  arabic_font_size INTEGER NOT NULL DEFAULT 28,
  translation_on   BOOLEAN NOT NULL DEFAULT TRUE,
  tafsir_on        BOOLEAN NOT NULL DEFAULT FALSE,
  audio_speed      REAL NOT NULL DEFAULT 1.0,
  auto_scroll      BOOLEAN NOT NULL DEFAULT TRUE,
  favorite_reciter TEXT NOT NULL DEFAULT 'mishary_rashid',
  created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE surahs (
  id                 INTEGER PRIMARY KEY,
  name_arabic        TEXT NOT NULL,
  name_english       TEXT NOT NULL,
  name_translation   TEXT NOT NULL,
  revelation_place   TEXT NOT NULL,
  revelation_order   INTEGER NOT NULL,
  total_ayahs        INTEGER NOT NULL,
  siparah_start      INTEGER NOT NULL,
  bismillah_present  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at         TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE ayahs (
  id                   TEXT PRIMARY KEY,
  surah_id             INTEGER NOT NULL REFERENCES surahs(id),
  number_in_surah      INTEGER NOT NULL,
  number_in_quran      INTEGER UNIQUE NOT NULL,
  siparah_number       INTEGER NOT NULL,
  ruku_number          INTEGER,
  page_number          INTEGER,
  text_arabic          TEXT NOT NULL,
  text_uthmani         TEXT,
  translation_urdu     TEXT,
  translation_english  TEXT,
  word_by_word         JSONB,
  audio_url            TEXT,
  sajdah               BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (surah_id, number_in_surah)
);
CREATE INDEX idx_ayahs_siparah ON ayahs(siparah_number);

CREATE TABLE tafsirs (
  id        TEXT PRIMARY KEY,
  ayah_id   TEXT NOT NULL REFERENCES ayahs(id),
  surah_id  INTEGER NOT NULL REFERENCES surahs(id),
  source    TEXT NOT NULL,
  language  TEXT NOT NULL DEFAULT 'en',
  content   TEXT NOT NULL
);

CREATE TABLE reciters (
  id             TEXT PRIMARY KEY,
  key            TEXT UNIQUE NOT NULL,
  name           TEXT NOT NULL,
  style          TEXT,
  audio_base_url TEXT NOT NULL
);

CREATE TABLE bookmarks (
  id             TEXT PRIMARY KEY,
  user_id        TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ayah_id        TEXT REFERENCES ayahs(id),
  surah_id       INTEGER,
  siparah_number INTEGER,
  label          TEXT,
  created_at     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE notes (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ayah_id    TEXT NOT NULL REFERENCES ayahs(id),
  content    TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE reading_progress (
  id               TEXT PRIMARY KEY,
  user_id          TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  surah_id         INTEGER NOT NULL,
  last_ayah_number INTEGER NOT NULL,
  updated_at       TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, surah_id)
);

CREATE TABLE reading_goals (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type         TEXT NOT NULL,
  target       INTEGER NOT NULL,
  current_day  INTEGER NOT NULL DEFAULT 0,
  streak       INTEGER NOT NULL DEFAULT 0,
  started_at   TIMESTAMP NOT NULL DEFAULT NOW(),
  target_date  TIMESTAMP
);

CREATE TABLE tasbeeh_counts (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  zikr_name    TEXT NOT NULL,
  count        INTEGER NOT NULL DEFAULT 0,
  target_count INTEGER,
  updated_at   TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, zikr_name)
);

CREATE TABLE duas (
  id              TEXT PRIMARY KEY,
  category        TEXT NOT NULL,
  title           TEXT NOT NULL,
  arabic          TEXT NOT NULL,
  transliteration TEXT NOT NULL,
  urdu            TEXT NOT NULL,
  english         TEXT NOT NULL,
  meaning         TEXT,
  reference       TEXT,
  audio_url       TEXT,
  "order"         INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX idx_duas_category ON duas(category);

CREATE TABLE names_of_allah (
  id                TEXT PRIMARY KEY,
  number            INTEGER UNIQUE NOT NULL,
  arabic            TEXT NOT NULL,
  transliteration   TEXT NOT NULL,
  meaning_english   TEXT NOT NULL,
  meaning_urdu      TEXT NOT NULL,
  benefits          TEXT,
  audio_url         TEXT
);

CREATE TABLE namaz_steps (
  id        TEXT PRIMARY KEY,
  "order"   INTEGER UNIQUE NOT NULL,
  title     TEXT NOT NULL,
  arabic    TEXT NOT NULL,
  urdu      TEXT NOT NULL,
  english   TEXT NOT NULL,
  audio_url TEXT
);

CREATE TABLE small_surahs (
  id                    TEXT PRIMARY KEY,
  surah_id              INTEGER UNIQUE NOT NULL,
  arabic                TEXT NOT NULL,
  transliteration       TEXT NOT NULL,
  translation_urdu      TEXT NOT NULL,
  translation_english   TEXT NOT NULL,
  audio_url             TEXT
);

CREATE TABLE hadiths (
  id            TEXT PRIMARY KEY,
  collection    TEXT NOT NULL,
  book_number   TEXT,
  hadith_number TEXT,
  arabic        TEXT,
  english       TEXT NOT NULL,
  urdu          TEXT,
  narrator      TEXT,
  grade         TEXT
);

CREATE TABLE articles (
  id          TEXT PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  excerpt     TEXT,
  content     TEXT NOT NULL,
  cover_image TEXT,
  author_id   TEXT,
  published   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE islamic_events (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  hijri_date  TEXT NOT NULL,
  description TEXT,
  category    TEXT NOT NULL
);

CREATE TABLE analytics_events (
  id         TEXT PRIMARY KEY,
  user_id    TEXT,
  event_type TEXT NOT NULL,
  metadata   JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_analytics_type_date ON analytics_events(event_type, created_at);
