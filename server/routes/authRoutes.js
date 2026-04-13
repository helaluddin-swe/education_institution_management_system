const express = require('express');

const { protect } = require('../middleware/middleware');
const { registerUser, loginUser, getMe, updateUserProfile } = require('../controllers/AuthController');
const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateUserProfile);

module.exports = router;