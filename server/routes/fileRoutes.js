const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const {
  uploadFile,
  getFiles,
  deleteFile,
  getFile,
  requestAccess,
  grantAccess,
  getSharedFiles
} = require('../controllers/files');

// All file routes are protected
router.use(protect);

router.post('/upload', upload.single('file'), uploadFile);
router.get('/', getFiles);
router.get('/shared-with-me', getSharedFiles); // Put this above /:id to avoid collision
router.delete('/:id', deleteFile);
router.get('/:id', getFile);
router.post('/:id/request-access', requestAccess);
router.patch('/:id/grant-access', grantAccess);

module.exports = router;
