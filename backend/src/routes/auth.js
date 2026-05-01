import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD;
  const secret = process.env.JWT_SECRET;

  if (!expectedUser || !expectedPass || !secret) {
    return res.status(503).json({ error: "Admin login is not configured on the server" });
  }
  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Username and password required" });
  }
  if (username !== expectedUser || password !== expectedPass) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const expiresIn = process.env.ADMIN_JWT_EXPIRES || "8h";
  const token = jwt.sign({ role: "admin" }, secret, { expiresIn });
  res.json({ token });
});

export default router;
