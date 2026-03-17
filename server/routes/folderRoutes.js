const express = require('express');
const router = express.Router();
const { 
  createFolder, 
  getDriveRoot, 
  getFolderContents, 
  renameFolder, 
  toggleStarFolder, 
  trashFolder,
  shareByEmail,
  getSharedFolders,
  moveFolder,
  updateFolderColor
} = require('../controllers/folders');
const protect = require('../middleware/authMiddleware');

router.use(protect); // All folder routes protected

router.post('/', createFolder);
router.get('/', getDriveRoot);
router.get('/shared-with-me', getSharedFolders);
router.get('/:id', getFolderContents);
router.patch('/:id/rename', renameFolder);
router.patch('/:id/star', toggleStarFolder);
router.post('/:id/share-email', shareByEmail);
router.patch('/:id/move', moveFolder);
router.patch('/:id/color', updateFolderColor);
router.delete('/:id', trashFolder);

module.exports = router;
