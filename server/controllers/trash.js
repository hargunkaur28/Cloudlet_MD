const File = require('../models/File');
const Folder = require('../models/Folder');

// @route   GET /api/trash
exports.getTrash = async (req, res) => {
  try {
    const folders = await Folder.find({ owner: req.user._id, isTrashed: true });
    const files = await File.find({ owner: req.user._id, isTrashed: true });
    res.json({ success: true, folders, files });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PATCH /api/trash/:id/restore
exports.restoreItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query; // 'file' or 'folder'

    if (type === 'folder') {
      const folder = await Folder.findOneAndUpdate(
        { _id: id, owner: req.user._id },
        { isTrashed: false, trashedAt: null },
        { new: true }
      );
      if (!folder) return res.status(404).json({ success: false, message: 'Folder not found' });
    } else {
      const file = await File.findOneAndUpdate(
        { _id: id, owner: req.user._id },
        { isTrashed: false, trashedAt: null },
        { new: true }
      );
      if (!file) return res.status(404).json({ success: false, message: 'File not found' });
    }

    res.json({ success: true, message: 'Item restored' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   DELETE /api/trash/:id/permanent
exports.permanentDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;

    if (type === 'folder') {
      // For folders, we delete the folder. 
      // Files inside will be "orphaned" or should have been deleted too.
      // For now, just delete the folder record.
      await Folder.findOneAndDelete({ _id: id, owner: req.user._id });
    } else {
      const file = await File.findOne({ _id: id, owner: req.user._id });
      if (!file) return res.status(404).json({ success: false, message: 'File not found' });

      // Delete from Cloudinary
      const { cloudinary } = require('../utils/cloudinary');
      await cloudinary.uploader.destroy(file.publicId);
      
      await File.findByIdAndDelete(id);
    }

    res.json({ success: true, message: 'Item permanently deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   DELETE /api/trash/empty
exports.emptyTrash = async (req, res) => {
  try {
    // This is more complex because we need to delete from Cloudinary too.
    const trashedFiles = await File.find({ owner: req.user._id, isTrashed: true });
    const { cloudinary } = require('../utils/cloudinary');

    for (const file of trashedFiles) {
      await cloudinary.uploader.destroy(file.publicId);
    }

    await File.deleteMany({ owner: req.user._id, isTrashed: true });
    await Folder.deleteMany({ owner: req.user._id, isTrashed: true });

    res.json({ success: true, message: 'Trash emptied' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
