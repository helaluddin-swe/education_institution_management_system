const jwt = require("jsonwebtoken");
const { User } = require("../models/AuthModel");

// 1. Protect Middleware (Authentication)
exports.protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided, access denied." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /**
     * CRITICAL CHANGE: 
     * In the School Management System, we use 'profileId' with a refPath.
     * Ensure this matches your User Schema field name.
     */
    const user = await User.findById(decoded.id)
      .select("-password")
      .populate('profileId'); 

    if (!user) {
      return res.status(401).json({ success: false, message: "User session not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    res.status(401).json({ success: false, message: "Session expired or invalid token." });
  }
};

// 2. Role-Based Authorization
// Usage: authorize('admin', 'teacher')
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

// 3. Shorthand for Admin only (Optional helper)
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: "Administrative clearance required." });
  }
};