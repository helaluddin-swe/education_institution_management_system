// middleware/adminMiddleware.js
const adminMiddleware = (req, res, next) => {
    // Check if req.user exists (populated by authMiddleware) and verify role
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        // 403 Forbidden is the correct status for role-based denial
        res.status(403).json({ 
            success: false, 
            message: "Access denied: This area requires Administrator clearance." 
        });
    }
};

module.exports = adminMiddleware;