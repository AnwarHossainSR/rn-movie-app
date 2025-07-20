const express = require("express");
const prisma = require("../db");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const savedMovies = await prisma.savedMovie.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
  });
  res.json(savedMovies);
});

router.post("/", authMiddleware, async (req, res) => {
  const { movieId, title, posterUrl } = req.body;
  try {
    const savedMovie = await prisma.savedMovie.create({
      data: { userId: req.user.id, movieId, title, posterUrl },
    });
    res.json(savedMovie);
  } catch (err) {
    console.log("Failed to save movie:", err);
    res.status(500).json({ error: "Failed to save movie" });
  }
});

router.delete("/:movieId", authMiddleware, async (req, res) => {
  const { movieId } = req.params;
  try {
    await prisma.savedMovie.deleteMany({
      where: { userId: req.user.id, movieId: parseInt(movieId) },
    });
    res.json({ message: "Movie removed from saved list" });
  } catch (err) {
    console.log("Failed to remove movie:", err);
    res.status(500).json({ error: "Failed to remove movie" });
  }
});

module.exports = router;
