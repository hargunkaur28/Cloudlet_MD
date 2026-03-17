const File = require('../models/File');
const Folder = require('../models/Folder');
const Notification = require('../models/Notification');
const User = require('../models/User');
const streamUpload = require('../utils/cloudinary');
const { cloudinary } = require('../utils/cloudinary');

// @route   POST /api/files/upload
exports.uploadFile = async (req, res) => {
  try {
    const { folderId } = req.body;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }
    const fileData = await streamUpload(req);
    
    let fileType = 'other';
    if (req.file.mimetype.startsWith('image/')) {
      fileType = 'image';
    } else if (req.file.mimetype === 'application/pdf') {
      fileType = 'pdf';
    } else {
      fileType = req.file.mimetype.split('/')[1] || 'other';
    }

    const file = await File.create({
      filename: req.file.originalname,
      url: fileData.secure_url,
      publicId: fileData.public_id,
      fileType,
      size: req.file.size,
      owner: req.user._id,
      folderId: folderId || null
    });
    res.status(201).json({ success: true, file });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/files
exports.getFiles = async (req, res) => {
  try {
    const files = await File.find({ 
      owner: req.user._id,
      isTrashed: { $ne: true }
    }).sort('-createdAt');
    res.json({ success: true, files });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/files/:id
exports.getFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id).populate('owner', 'name email');
    if (!file) return res.status(404).json({ success: false, message: 'File not found' });
    
    // Check access
    const isOwner = file.owner._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isShared = file.sharedWith.some(s => s.user.toString() === req.user._id.toString());
    
    if (!isOwner && !isAdmin && !isShared) {
      return res.status(403).json({ success: false, message: 'Access denied', fileDetails: { filename: file.filename, owner: file.owner } });
    }
    
    res.json({ success: true, file });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// @route   GET /api/files/:id/view
exports.getFileView = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ success: false, message: 'File not found' });
    
    // Check access
    const isOwner = file.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isShared = file.sharedWith.some(s => s.user.toString() === req.user._id.toString());
    
    if (!isOwner && !isAdmin && !isShared) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    // For PDFs, Cloudinary "delivery" URLs can return 401 in server-side fetches and/or fail in
    // Chrome's PDF viewer frame. A signed Cloudinary download URL is reliable.
    const resolvedUrl =
      file.fileType === 'pdf'
        ? cloudinary.utils.private_download_url(file.publicId, 'pdf', {
            resource_type: 'image',
            type: 'upload',
          })
        : file.url;

    // If the client asks for JSON (XHR/fetch), return the URL instead of redirecting.
    // Redirecting to a cross-origin URL (Cloudinary) with credentials causes CORS failures in XHR.
    const wantsJson =
      req.query.format === 'json' ||
      (req.headers.accept && req.headers.accept.includes('application/json'));

    if (wantsJson) {
      return res.json({ success: true, url: resolvedUrl });
    }

    // Browser navigation case: redirect to the resolved URL
    return res.redirect(resolvedUrl);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PATCH /api/files/:id/star
exports.toggleStarFile = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, owner: req.user._id });
    if (!file) return res.status(404).json({ success: false, message: 'File not found' });
    
    file.isStarred = !file.isStarred;
    await file.save();
    res.json({ success: true, file });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/files/starred
exports.getStarredItems = async (req, res) => {
  try {
    const folders = await Folder.find({ owner: req.user._id, isStarred: true, isTrashed: { $ne: true } });
    const files = await File.find({ owner: req.user._id, isStarred: true, isTrashed: { $ne: true } });
    res.json({ success: true, folders, files });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   DELETE /api/files/:id (Soft Delete)
exports.trashFile = async (req, res) => {
  try {
    const file = await File.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { isTrashed: true, trashedAt: new Date() },
      { new: true }
    );
    if (!file) return res.status(404).json({ success: false, message: 'File not found' });
    res.json({ success: true, message: 'File moved to trash' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/files/:id/share-email
exports.shareByEmail = async (req, res) => {
  try {
    const { email, permission } = req.body;
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ success: false, message: 'File not found' });
    
    if (file.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only owner can share' });
    }

    const targetUser = await User.findOne({ email });
    if (targetUser) {
      // Add to sharedWith
      const alreadyShared = file.sharedWith.find(s => s.user.toString() === targetUser._id.toString());
      if (!alreadyShared) {
        file.sharedWith.push({ user: targetUser._id, permission: permission || 'view' });
      } else {
        alreadyShared.permission = permission || 'view';
      }
      await file.save();
      
      // Notify
      await Notification.create({
        recipient: targetUser._id,
        sender: req.user._id,
        file: file._id,
        type: 'access_approved',
        message: `${req.user.name} shared ${file.filename} with you`
      });

      res.json({ success: true, message: `Shared with ${email}` });
    } else {
      // Invite logic
      const inviteUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/signup?email=${email}&sharedFile=${file._id}`;
      console.log(`--- INVITATION FOR ${email} ---`);
      console.log(inviteUrl);
      console.log('-------------------------------');
      res.json({ success: true, message: `Invitation link generated for ${email} (check console)` });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/files/:id/request-access
exports.requestAccess = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ success: false, message: 'File not found' });

    const existingReq = file.accessRequests.find(r => r.user.toString() === req.user._id.toString());
    if (existingReq) return res.status(400).json({ success: false, message: 'Access already requested' });

    file.accessRequests.push({ user: req.user._id, status: 'pending' });
    await file.save();

    await Notification.create({
      recipient: file.owner,
      sender: req.user._id,
      file: file._id,
      type: 'access_request',
      message: `${req.user.name} requested access to ${file.filename}`
    });

    res.json({ success: true, message: 'Access requested' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PATCH /api/files/:id/grant-access
exports.grantAccess = async (req, res) => {
  try {
    const { userId, status, permission } = req.body;
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ success: false, message: 'File not found' });

    if (file.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const request = file.accessRequests.find(r => r.user.toString() === userId);
    if (request) request.status = status;

    if (status === 'approved') {
      const alreadyShared = file.sharedWith.find(s => s.user.toString() === userId);
      if (!alreadyShared) file.sharedWith.push({ user: userId, permission: permission || 'view' });
      else alreadyShared.permission = permission || 'view';
    }

    await file.save();

    await Notification.create({
      recipient: userId,
      sender: req.user._id,
      file: file._id,
      type: status === 'approved' ? 'access_approved' : 'access_rejected',
      message: `Your request for ${file.filename} was ${status}`
    });

    res.json({ success: true, message: `Access ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/files/shared-with-me
exports.getSharedFiles = async (req, res) => {
  try {
    const files = await File.find({ 'sharedWith.user': req.user._id, isTrashed: { $ne: true } }).populate('owner', 'name email');
    res.json({ success: true, files });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PATCH /api/files/:id
exports.updateFile = async (req, res) => {
  try {
    const { filename } = req.body;
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ success: false, message: 'File not found' });

    if (file.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (req.file) {
      const { cloudinary } = require('../utils/cloudinary');
      await cloudinary.uploader.destroy(file.publicId);
      const result = await streamUpload(req);
      file.url = result.secure_url;
      file.publicId = result.public_id;
      file.fileType = req.file.mimetype.split('/')[1] || 'other';
      file.size = req.file.size;
    }

    if (filename) file.filename = filename;
    await file.save();
    res.json({ success: true, file });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// @route   PATCH /api/files/:id/move
exports.moveFile = async (req, res) => {
  try {
    const { targetFolderId } = req.body;
    const file = await File.findOne({ _id: req.params.id, owner: req.user._id });
    if (!file) return res.status(404).json({ success: false, message: 'File not found' });

    file.folderId = targetFolderId || null;
    await file.save();
    res.json({ success: true, file });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// @route   GET /api/files/recent
exports.getRecentFiles = async (req, res) => {
  try {
    const files = await File.find({ 
      owner: req.user._id, 
      isTrashed: { $ne: true } 
    })
    .sort({ createdAt: -1 })
    .limit(10);
    res.json({ success: true, files });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// @route   GET /api/files/storage
exports.getStorageUsage = async (req, res) => {
  try {
    const stats = await File.aggregate([
      { $match: { owner: req.user._id } },
      { $group: { _id: null, totalSize: { $sum: "$size" } } }
    ]);
    
    const totalSize = stats.length > 0 ? stats[0].totalSize : 0;
    
    // Default limit 500MB
    const limit = 500 * 1024 * 1024;
    const percentage = (totalSize / limit) * 100;

    res.json({ 
      success: true, 
      used: totalSize, 
      limit, 
      percentage: Math.min(percentage, 100).toFixed(2) 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
