const express = require("express");
const prisma = require("../config/prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// GET /api/bookmarks — current user's bookmarks
router.get("/", async (req, res, next) => {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: req.user.id },
      include: { ayah: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: bookmarks });
  } catch (err) {
    next(err);
  }
});

// POST /api/bookmarks — save an ayah/surah/siparah
router.post("/", async (req, res, next) => {
  try {
    const { ayahId, surahId, siparahNumber, label } = req.body;
    const bookmark = await prisma.bookmark.create({
      data: { userId: req.user.id, ayahId, surahId, siparahNumber, label },
    });
    res.status(201).json({ data: bookmark });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/bookmarks/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const bookmark = await prisma.bookmark.findUnique({ where: { id: req.params.id } });
    if (!bookmark || bookmark.userId !== req.user.id) {
      return res.status(404).json({ error: "Bookmark not found." });
    }
    await prisma.bookmark.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
