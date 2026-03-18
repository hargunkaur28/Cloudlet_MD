const File = require('../models/File');
const Folder = require('../models/Folder');

// @route   GET /api/search
// @desc    Search for files and folders by name
// @access  Private
exports.searchAll = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.json({ success: true, files: [], folders: [] });
    }

    // Escape special regex characters
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(escapedQuery, 'i');

    const files = await File.find({
      owner: req.user._id,
      filename: searchRegex,
      isTrashed: { $ne: true }
    })
    .sort('-createdAt')
    .limit(20);

    const folders = await Folder.find({
      owner: req.user._id,
      name: searchRegex,
      isTrashed: { $ne: true }
    })
    .sort('-createdAt')
    .limit(10);

    res.json({ success: true, files, folders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
