const multer = require('multer');

// Configure multer to use memory storage
const storage = multer.memoryStorage();

// File limits (e.g. 10MB)
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

module.exports = upload;
