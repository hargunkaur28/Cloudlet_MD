const Folder = require('../models/Folder');
const File = require('../models/File');

// @route   POST /api/folders
exports.createFolder = async (req, res) => {
  try {
    const { name, color, parent } = req.body;
    const folder = await Folder.create({
      name,
      color: color || '#4f46e5',
      parent: parent || null,
      owner: req.user._id
    });
    res.status(201).json({ success: true, folder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/folders
exports.getDriveRoot = async (req, res) => {
  try {
    const folders = await Folder.find({ 
      owner: req.user._id, 
      parent: null,
      isTrashed: { $ne: true }
    });
    const files = await File.find({ 
      owner: req.user._id, 
      folderId: null,
      isTrashed: { $ne: true }
    });
    res.json({ success: true, folders, files });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/folders/:id
exports.getFolderContents = async (req, res) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, owner: req.user._id });
    if (!folder) return res.status(404).json({ success: false, message: 'Folder not found' });

    const subfolders = await Folder.find({ 
      parent: req.params.id, 
      owner: req.user._id,
      isTrashed: { $ne: true }
    });
    const files = await File.find({ 
      folderId: req.params.id, 
      owner: req.user._id,
      isTrashed: { $ne: true }
    });

    res.json({ success: true, folder, subfolders, files });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PATCH /api/folders/:id/rename
exports.renameFolder = async (req, res) => {
  try {
    const { name } = req.body;
    const folder = await Folder.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { name },
      { new: true }
    );
    if (!folder) return res.status(404).json({ success: false, message: 'Folder not found' });
    res.json({ success: true, folder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PATCH /api/folders/:id/star
exports.toggleStarFolder = async (req, res) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, owner: req.user._id });
    if (!folder) return res.status(404).json({ success: false, message: 'Folder not found' });
    
    folder.isStarred = !folder.isStarred;
    await folder.save();
    res.json({ success: true, folder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   DELETE /api/folders/:id (Soft Delete)
exports.trashFolder = async (req, res) => {
  try {
    const folder = await Folder.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { isTrashed: true, trashedAt: new Date() },
      { new: true }
    );
    if (!folder) return res.status(404).json({ success: false, message: 'Folder not found' });
    res.json({ success: true, message: 'Folder moved to trash' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/folders/:id/share-email
exports.shareByEmail = async (req, res) => {
  try {
    const { email, permission } = req.body;
    const folder = await Folder.findById(req.params.id);
    if (!folder) return res.status(404).json({ success: false, message: 'Folder not found' });
    
    if (folder.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only owner can share' });
    }

    const User = require('../models/User');
    const targetUser = await User.findOne({ email });
    if (targetUser) {
      const alreadyShared = folder.sharedWith.find(s => s.user.toString() === targetUser._id.toString());
      if (!alreadyShared) {
        folder.sharedWith.push({ user: targetUser._id, permission: permission || 'view' });
      } else {
        alreadyShared.permission = permission || 'view';
      }
      await folder.save();
      
      const Notification = require('../models/Notification');
      await Notification.create({
        recipient: targetUser._id,
        sender: req.user._id,
        folder: folder._id,
        type: 'access_approved',
        message: `${req.user.name} shared folder "${folder.name}" with you`
      });

      res.json({ success: true, message: `Folder shared with ${email}` });
    } else {
      res.json({ success: true, message: `User not found. Invitation link logged.` });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/folders/shared-with-me
exports.getSharedFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ 
      'sharedWith.user': req.user._id, 
      isTrashed: { $ne: true } 
    }).populate('owner', 'name email');
    res.json({ success: true, folders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// @route   PATCH /api/folders/:id/move
exports.moveFolder = async (req, res) => {
  try {
    const { targetFolderId } = req.body;
    const folder = await Folder.findOne({ _id: req.params.id, owner: req.user._id });
    if (!folder) return res.status(404).json({ success: false, message: 'Folder not found' });
    
    // Prevent moving a folder into itself
    if (targetFolderId === req.params.id) {
      return res.status(400).json({ success: false, message: 'Cannot move folder into itself' });
    }

    folder.parent = targetFolderId || null;
    await folder.save();
    res.json({ success: true, folder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// @route   PATCH /api/folders/:id/color
exports.updateFolderColor = async (req, res) => {
  try {
    const { color } = req.body;
    const folder = await Folder.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { color },
      { new: true }
    );
    if (!folder) return res.status(404).json({ success: false, message: 'Folder not found or unauthorized' });
    res.json({ success: true, folder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
