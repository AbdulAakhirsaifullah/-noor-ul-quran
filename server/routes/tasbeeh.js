const express = require("express");
const prisma = require("../config/prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// GET /api/tasbeeh — all zikr counts for the current user
router.get("/", async (req, res, next) => {
  try {
    const counts = await prisma.tasbeehCount.findMany({ where: { userId: req.user.id } });
    res.json({ data: counts });
  } catch (err) {
    next(err);
  }
});

// PUT /api/tasbeeh — upsert a count (increment or reset) for a zikr
router.put("/", async (req, res, next) => {
  try {
    const { zikrName, count, targetCount } = req.body;
    const updated = await prisma.tasbeehCount.upsert({
      where: { userId_zikrName: { userId: req.user.id, zikrName } },
      update: { count, targetCount },
      create: { userId: req.user.id, zikrName, count, targetCount },
    });
    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
