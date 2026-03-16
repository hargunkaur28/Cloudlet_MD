const express = require('express');
const router = express.Router();
const { signup, login, logout, getMe, updateProfile, updatePassword, forgotPassword, resetPassword } = require('../controllers/auth');
const protect = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
