const cron = require('node-cron');
const File = require('../models/File');
const Folder = require('../models/Folder');
const { cloudinary } = require('./cloudinary');

const setupCronJobs = () => {
  // Run daily at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily trash cleanup...');
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Find files trashed > 30 days ago
      const oldFiles = await File.find({
        isTrashed: true,
        trashedAt: { $lt: thirtyDaysAgo }
      });

      for (const file of oldFiles) {
        await cloudinary.uploader.destroy(file.publicId);
        await File.findByIdAndDelete(file._id);
        console.log(`Permanently deleted file: ${file.filename}`);
      }

      // Find folders trashed > 30 days ago
      const oldFolders = await Folder.find({
        isTrashed: true,
        trashedAt: { $lt: thirtyDaysAgo }
      });

      for (const folder of oldFolders) {
        await Folder.findByIdAndDelete(folder._id);
        console.log(`Permanently deleted folder: ${folder.name}`);
      }

      console.log('Trash cleanup completed.');
    } catch (error) {
      console.error('Error in trash cleanup cron:', error);
    }
  });
};

module.exports = setupCronJobs;
