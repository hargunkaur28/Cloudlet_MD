import React, { useState } from 'react';
import { X, Upload, Loader2, FileText } from 'lucide-react';

const EditFileModal = ({ file, onClose, onUpdate }) => {
  const lastDotIndex = file.filename.lastIndexOf('.');
  const baseName = lastDotIndex !== -1 ? file.filename.substring(0, lastDotIndex) : file.filename;
  const extension = lastDotIndex !== -1 ? file.filename.substring(lastDotIndex) : '';

  const [filename, setFilename] = useState(baseName);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedFile) {
      const newExt = selectedFile.name.substring(selectedFile.name.lastIndexOf('.'));
      if (newExt.toLowerCase() !== extension.toLowerCase()) {
        const toast = (await import('react-hot-toast')).toast;
        toast.error(`Format mismatch! You must upload a ${extension} file.`);
        return;
      }
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('filename', filename + extension);
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    const success = await onUpdate(file._id, formData);
    if (success) {
      onClose();
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const dotIndex = file.name.lastIndexOf('.');
      const newBaseName = dotIndex !== -1 ? file.name.substring(0, dotIndex) : file.name;
      setFilename(newBaseName);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1a1a1a] border border-lightBorder dark:border-darkBorder rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-lightBorder dark:border-darkBorder">
          <h3 className="text-xl font-bold tracking-tight">Edit File</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">File Name</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="flex-1 px-4 py-2 bg-white dark:bg-[#111] border border-lightBorder dark:border-darkBorder rounded-lg focus:outline-none focus:border-accent transition-colors"
                placeholder="New name..."
                required
              />
              <span className="px-3 py-2 bg-gray-50 dark:bg-[#111] border border-lightBorder dark:border-darkBorder rounded-lg text-sm text-gray-500 font-mono">
                {extension}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 italic">Extension is protected and cannot be changed.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Replace Content (Optional)</label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="edit-file-upload"
              />
              <label
                htmlFor="edit-file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-lightBorder dark:border-darkBorder rounded-xl hover:border-accent hover:bg-accent/5 transition-all cursor-pointer group"
              >
                {selectedFile ? (
                  <div className="flex flex-col items-center">
                    <FileText className="text-accent mb-2" size={32} />
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="text-gray-400 group-hover:text-accent mb-2 transition-colors" size={32} />
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Click to replace file</p>
                    <p className="text-xs text-gray-500 mt-1 uppercase font-bold text-accent">Must be {extension} format</p>
                    <p className="text-[10px] text-gray-400 mt-1">Leave empty to keep current content</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#222] hover:bg-gray-200 dark:hover:bg-[#333] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-indigo-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Save Changes'}
            </button>
          </div>
          <p className="text-[10px] text-center text-gray-400 mt-2 italic">Reflect changes by refreshing if they don't update immediately.</p>
        </form>
      </div>
    </div>
  );
};

export default EditFileModal;
