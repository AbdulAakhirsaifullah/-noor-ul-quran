const jwt = require("jsonwebtoken");

/** Verifies a Bearer JWT and attaches the decoded user to req.user. */
function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header." });
  }
  try {
    req.user = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token." });
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== "ADMIN") return res.status(403).json({ error: "Admin access required." });
  next();
}

module.exports = { requireAuth, requireAdmin };
