const jwt = require("jsonwebtoken");
const prisma = require("../db");

const authMiddleware = async (req, res, next) => {
  const token =
    req.cookies.token || req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!req.user) {
      return res.status(401).json({ error: "User not found" });
    }
    next();
  } catch (err) {
    console.log("Authentication error:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
