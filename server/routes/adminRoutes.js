const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const {
  getAllFiles,
  getAllUsers,
  adminDeleteFile,
  adminDeleteUser
} = require('../controllers/admin');

// Apply middleware
router.use(protect);
router.use(admin);

router.get('/files', getAllFiles);
router.get('/users', getAllUsers);
router.delete('/files/:id', adminDeleteFile);
router.delete('/users/:id', adminDeleteUser);

module.exports = router;
