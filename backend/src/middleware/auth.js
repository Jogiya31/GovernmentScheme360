// src/middleware/auth.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "5m";

function authenticateToken(req, res, next) {
  // 1. Read the Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <TOKEN>"

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Authentication token missing.",
    });
  }

  // 2. Validate token signature and expiration
  jwt.verify(token, JWT_SECRET, { maxAge: JWT_EXPIRES_IN }, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired session token. Please log in again.",
      });
    }

    // 3. Attach decoded user (userId, email, phone) to the request
    req.user = decodedUser;
    next();
  });
}

module.exports = { authenticateToken, JWT_SECRET, JWT_EXPIRES_IN };