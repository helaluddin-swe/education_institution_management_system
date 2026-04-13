// middleware/adminMiddleware.js
const adminMiddleware = (req, res, next) => {
    // Log for debugging (remove in production)
    // console.log("Checking Admin Role for:", req.user?.email, "Role:", req.user?.role);

    if (req.user && (req.user.role === 'admin')) {
        next();
    } else {
        // Return 403 Forbidden
        res.status(403).json({ 
            success: false, 
            message: "Access denied: This area requires Administrator clearance." 
        });
    }
};

module.exports = adminMiddleware;