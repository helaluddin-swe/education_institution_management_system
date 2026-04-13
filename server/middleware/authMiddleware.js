const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  // 1. Get token from header (format: Bearer <token>)
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "No token, authorization denied" });
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Add user ID to request object
    req.user = decoded; 
    next(); // Move to the controller
  } catch (error) {
    res.status(401).json({ success: false, message: "Token is not valid" });
  }
};

module.exports = authMiddleware;