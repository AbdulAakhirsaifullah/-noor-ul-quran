const express = require("express");
const prisma = require("../config/prisma");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /api/users/me
router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, language: true, theme: true, arabicFontSize: true },
    });
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/users/me — update settings/preferences
router.patch("/me", requireAuth, async (req, res, next) => {
  try {
    const allowed = ["name", "language", "theme", "arabicFontSize", "translationOn", "tafsirOn", "audioSpeed", "autoScroll", "favoriteReciter"];
    const data = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
    const user = await prisma.user.update({ where: { id: req.user.id }, data });
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
});

// GET /api/users — admin only, for the Manage Users panel
router.get("/", requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: users });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
