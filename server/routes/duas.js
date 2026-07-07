const express = require("express");
const prisma = require("../config/prisma");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /api/duas?category=Morning
router.get("/", async (req, res, next) => {
  try {
    const { category } = req.query;
    const duas = await prisma.dua.findMany({
      where: category ? { category: String(category) } : undefined,
      orderBy: { order: "asc" },
    });
    res.json({ data: duas });
  } catch (err) {
    next(err);
  }
});

// POST /api/duas — admin only, add a new dua
router.post("/", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const dua = await prisma.dua.create({ data: req.body });
    res.status(201).json({ data: dua });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
