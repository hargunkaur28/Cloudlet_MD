const File = require('../models/File');
const User = require('../models/User');
const { cloudinary } = require('../utils/cloudinary');

// @route   GET /api/admin/files
exports.getAllFiles = async (req, res) => {
  try {
    const files = await File.find().populate('owner', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, files });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    // For each user we can aggregate file counts, or do it on frontend
    // Aggregation is better
    const usersWithStats = await Promise.all(users.map(async (user) => {
      const fileCount = await File.countDocuments({ owner: user._id });
      return {
        ...user._doc,
        fileCount
      };
    }));

    res.json({ success: true, users: usersWithStats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   DELETE /api/admin/files/:id
exports.adminDeleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(file.publicId);

    // Delete from MongoDB
    await file.deleteOne();

    res.json({ success: true, message: 'File removed by admin' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// @route   DELETE /api/admin/users/:id
exports.adminDeleteUser = async (req, res) => {
  try {
    console.log('Admin deletion request for user ID:', req.params.id);
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot delete an admin user' });
    }

    // Find all files owned by the user
    const files = await File.find({ owner: user._id });

    // Delete files from Cloudinary
    for (const file of files) {
      try {
        await cloudinary.uploader.destroy(file.publicId);
      } catch (err) {
        console.error(`Failed to delete Cloudinary file ${file.publicId}:`, err);
      }
    }

    // Delete files from MongoDB
    await File.deleteMany({ owner: user._id });

    // Delete the user
    await user.deleteOne();

    res.json({ success: true, message: 'User and their files removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
