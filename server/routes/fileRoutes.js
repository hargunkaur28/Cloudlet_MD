const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const {
  uploadFile,
  getFiles,
  getFile,
  deleteFile,
  requestAccess,
  grantAccess,
  getSharedFiles,
  updateFile,
  toggleStarFile,
  getStarredItems,
  trashFile,
  moveFile,
  shareByEmail,
  getRecentFiles,
  getStorageUsage,
  getFileView
} = require('../controllers/files');

// All file routes are protected
router.use(protect);

router.post('/upload', upload.single('file'), uploadFile);
router.get('/', getFiles);
router.get('/starred', getStarredItems);
router.get('/recent', getRecentFiles);
router.get('/storage', getStorageUsage);
router.get('/shared-with-me', getSharedFiles);
router.get('/:id', getFile);
router.patch('/:id', upload.single('file'), updateFile);
router.patch('/:id/star', toggleStarFile);
router.patch('/:id/move', moveFile);
router.delete('/:id', trashFile); // Changed to soft delete
router.get('/:id/view', getFileView);
router.post('/:id/share-email', shareByEmail);
router.post('/:id/request-access', requestAccess);
router.patch('/:id/grant-access', grantAccess);

module.exports = router;
