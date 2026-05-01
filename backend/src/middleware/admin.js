import jwt from "jsonwebtoken";

function bearerToken(req) {
  const h = req.headers.authorization;
  if (!h || typeof h !== "string" || !h.startsWith("Bearer ")) return null;
  return h.slice(7).trim();
}

export function requireAdmin(req, res, next) {
  const token = bearerToken(req);
  const secret = process.env.JWT_SECRET;

  if (token && secret) {
    try {
      const decoded = jwt.verify(token, secret);
      if (decoded && decoded.role === "admin") {
        return next();
      }
    } catch {
      return res.status(401).json({ error: "Invalid or expired session" });
    }
  }

  const key = req.headers["x-admin-key"] || req.body?.adminKey;
  const expected = process.env.ADMIN_API_KEY;
  if (expected && key === expected) {
    return next();
  }

  return res.status(401).json({ error: "Unauthorized" });
}
