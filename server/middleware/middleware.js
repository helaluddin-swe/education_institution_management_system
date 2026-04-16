const jwt = require("jsonwebtoken");
const { User } = require("../models/AuthModel");

// 1. Protect Middleware (Authentication)
exports.protect = async (req, res, next) => {
  try {
    if (typeof next !== "function") {
      console.error("❌ next is not a function");
      return res.status(500).json({ message: "Middleware error" });
    }

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id)
      .select("-password")
      .populate("profileId");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    next(); // ✅ SAFE NOW
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// 2. Role-Based Authorization
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Role [${req.user?.role}] is not authorized to access this resource.` 
      });
    }
    next();
  };
};

// 3. Shorthand for Admin only
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: "Administrative clearance required." });
  }
};