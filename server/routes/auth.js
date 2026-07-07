const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const prisma = require("../config/prisma");

const router = express.Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }
    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: "An account with this email already exists." });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, password: hashed } });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ data: { token, user: { id: user.id, name: user.name, email: user.email } } });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
