const express = require('express');
const router = express.Router();
const { getTrash, restoreItem, permanentDelete, emptyTrash } = require('../controllers/trash');
const protect = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getTrash);
router.patch('/:id/restore', restoreItem);
router.delete('/:id/permanent', permanentDelete);
router.delete('/empty', emptyTrash);

module.exports = router;
