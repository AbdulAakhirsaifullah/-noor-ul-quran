/**
 * Noor-ul-Quran — Standalone Express API (optional).
 *
 * Next.js App Router's own `app/api/*` route handlers are enough to run the
 * whole app on Vercel. This Express server exists for teams who want a
 * separately deployable backend (e.g. on Railway) that talks to the same
 * Postgres DB via the same Prisma client.
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const surahRoutes = require("./routes/surahs");
const duaRoutes = require("./routes/duas");
const bookmarkRoutes = require("./routes/bookmarks");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const tasbeehRoutes = require("./routes/tasbeeh");

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/health", (_req, res) => res.json({ status: "ok", service: "noor-ul-quran-api" }));

app.use("/api/surahs", surahRoutes);
app.use("/api/duas", duaRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tasbeeh", tasbeehRoutes);

// Central error handler — never leak stack traces to clients
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.publicMessage || "Something went wrong." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Noor-ul-Quran API listening on port ${PORT}`));
