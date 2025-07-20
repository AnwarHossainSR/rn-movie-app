const express = require("express");
const prisma = require("../db");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const searchHistory = await prisma.searchHistory.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  res.json(searchHistory);
});

router.post("/", authMiddleware, async (req, res) => {
  const { query } = req.body;
  try {
    const search = await prisma.searchHistory.create({
      data: { userId: req.user.id, query },
    });
    res.json(search);
  } catch (err) {
    console.error("Failed to save search:", err);
    res.status(500).json({ error: "Failed to save search" });
  }
});

module.exports = router;
