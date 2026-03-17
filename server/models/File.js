const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  fileType: { type: String, required: true },
  size: { type: Number, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sharedWith: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      permission: { type: String, enum: ['view', 'edit'] }
    }
  ],
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null },
  isStarred: { type: Boolean, default: false },
  isTrashed: { type: Boolean, default: false },
  trashedAt: { type: Date },
  accessRequests: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      requestedAt: { type: Date, default: Date.now },
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
    }
  ]
}, { timestamps: true });

fileSchema.index({ owner: 1, isTrashed: 1 });
fileSchema.index({ folderId: 1, isTrashed: 1 });
fileSchema.index({ isStarred: 1, owner: 1 });

module.exports = mongoose.model('File', fileSchema);
