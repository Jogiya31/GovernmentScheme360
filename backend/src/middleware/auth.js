// src/middleware/auth.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

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
  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired session token. Please log in again.",
      });
    }

    // 3. Attach decoded user (userId, email, role, departmentId) to the request
    req.user = decodedUser;
    next();
  });
}

module.exports = { authenticateToken, JWT_SECRET };