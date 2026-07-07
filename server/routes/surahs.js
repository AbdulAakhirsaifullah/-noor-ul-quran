const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

// GET /api/surahs — list all surahs
router.get("/", async (_req, res, next) => {
  try {
    const surahs = await prisma.surah.findMany({ orderBy: { id: "asc" } });
    res.json({ data: surahs });
  } catch (err) {
    next(err);
  }
});

// GET /api/surahs/:id — one surah with its ayahs
router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1 || id > 114) {
      return res.status(400).json({ error: "Surah id must be an integer between 1 and 114." });
    }
    const surah = await prisma.surah.findUnique({
      where: { id },
      include: { ayahs: { orderBy: { numberInSurah: "asc" } } },
    });
    if (!surah) return res.status(404).json({ error: "Surah not found." });
    res.json({ data: surah });
  } catch (err) {
    next(err);
  }
});

// GET /api/surahs/search/:keyword — keyword search across ayah translations
router.get("/search/:keyword", async (req, res, next) => {
  try {
    const { keyword } = req.params;
    const results = await prisma.ayah.findMany({
      where: {
        OR: [
          { translationEnglish: { contains: keyword, mode: "insensitive" } },
          { translationUrdu: { contains: keyword, mode: "insensitive" } },
        ],
      },
      take: 50,
      include: { surah: { select: { nameEnglish: true, nameArabic: true } } },
    });
    res.json({ data: results, count: results.length });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
