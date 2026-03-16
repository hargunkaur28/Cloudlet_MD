const File = require('../models/File');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { streamUpload, cloudinary } = require('../utils/cloudinary');

// @route   POST /api/files/upload
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    // Upload to Cloudinary
    const result = await streamUpload(req);

    // Save metadata to MongoDB
    const file = await File.create({
      filename: req.file.originalname,
      url: result.secure_url,
      publicId: result.public_id,
      fileType: result.resource_type === 'image' || result.format === 'pdf' ? (result.format === 'pdf' ? 'pdf' : 'image') : 'other',
      size: req.file.size,
      owner: req.user._id
    });

    res.status(201).json({ success: true, file });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'File upload failed' });
  }
};

// @route   GET /api/files
exports.getFiles = async (req, res) => {
  try {
    const files = await File.find({ owner: req.user._id })
      .populate('accessRequests.user', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, files });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   DELETE /api/files/:id
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    if (file.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this file' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(file.publicId);

    // Delete from MongoDB
    await file.deleteOne();

    res.json({ success: true, message: 'File removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/files/:id
exports.getFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('sharedWith.user', 'name');

    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    // Check permissions
    if (file.owner._id.toString() === req.user._id.toString()) {
      return res.json({ success: true, file });
    }

    const hasAccess = file.sharedWith.find(share => share.user._id.toString() === req.user._id.toString());
    if (hasAccess) {
      return res.json({ success: true, file });
    }

    // User does not have access, they need to request it
    res.status(403).json({ success: false, message: 'Access denied', fileDetails: { filename: file.filename, owner: file.owner } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/files/:id/request-access
exports.requestAccess = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    // Check if already requested
    const existingReq = file.accessRequests.find(r => r.user.toString() === req.user._id.toString());
    if (existingReq) {
      return res.status(400).json({ success: false, message: 'Access already requested' });
    }

    file.accessRequests.push({ user: req.user._id, status: 'pending' });
    await file.save();

    // Notify owner
    await Notification.create({
      recipient: file.owner,
      sender: req.user._id,
      file: file._id,
      type: 'access_request',
      message: `${req.user.name} requested access to ${file.filename}`
    });

    res.json({ success: true, message: 'Access requested specifically' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PATCH /api/files/:id/grant-access
exports.grantAccess = async (req, res) => {
  try {
    const { userId, status, permission } = req.body; // status: 'approved' | 'rejected', permission: 'view' | 'edit'
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    if (file.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only owner can grant access' });
    }

    // Update request status
    const requestIndex = file.accessRequests.findIndex(r => r.user.toString() === userId);
    if (requestIndex !== -1) {
      file.accessRequests[requestIndex].status = status;
    }

    // If approved, add to sharedWith
    if (status === 'approved') {
      const alreadyShared = file.sharedWith.find(s => s.user.toString() === userId);
      if (!alreadyShared) {
        file.sharedWith.push({ user: userId, permission: permission || 'view' });
      } else {
        alreadyShared.permission = permission || 'view';
      }
    }

    await file.save();

    // Notify requester
    const statusText = status === 'approved' ? 'approved' : 'rejected';
    await Notification.create({
      recipient: userId,
      sender: req.user._id,
      file: file._id,
      type: status === 'approved' ? 'access_approved' : 'access_rejected',
      message: `Your request for ${file.filename} was ${statusText}`
    });

    res.json({ success: true, message: `Access ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/files/shared-with-me
exports.getSharedFiles = async (req, res) => {
  try {
    const files = await File.find({ 'sharedWith.user': req.user._id }).populate('owner', 'name email');
    res.json({ success: true, files });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
