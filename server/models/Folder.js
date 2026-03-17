const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null },
  isStarred: { type: Boolean, default: false },
  isTrashed: { type: Boolean, default: false },
  trashedAt: { type: Date },
  color: { type: String, default: '#4f46e5' }, // Default indigo-600
  sharedWith: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      permission: { type: String, enum: ['view', 'edit'] }
    }
  ]
}, { timestamps: true });

folderSchema.index({ owner: 1, isTrashed: 1 });
folderSchema.index({ parent: 1, isTrashed: 1 });
folderSchema.index({ isStarred: 1, owner: 1 });

module.exports = mongoose.model('Folder', folderSchema);
