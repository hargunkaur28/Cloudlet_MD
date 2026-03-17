import React, { useState } from 'react';
import { X, Edit3 } from 'lucide-react';

const RenameModal = ({ item, type, onClose, onRename }) => {
  const [name, setName] = useState(type === 'file' ? item.filename.split('.').slice(0, -1).join('.') : item.name);
  const extension = type === 'file' ? `.${item.filename.split('.').pop()}` : '';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onRename(type === 'file' ? `${name.trim()}${extension}` : name.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1a1a1a] border border-lightBorder dark:border-darkBorder rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-lightBorder dark:border-darkBorder">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Edit3 size={20} />
            </div>
            <h3 className="text-xl font-bold tracking-tight">Rename {type === 'file' ? 'File' : 'Folder'}</h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Name</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-[#111] border border-lightBorder dark:border-darkBorder rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                placeholder="Enter new name..."
                autoFocus
                required
              />
              {extension && (
                <span className="px-3 py-3 bg-gray-100 dark:bg-gray-800 border border-lightBorder dark:border-darkBorder rounded-xl text-sm font-mono text-gray-500">
                  {extension}
                </span>
              )}
            </div>
            {type === 'file' && (
              <p className="text-[10px] text-gray-400 italic">File extension is protected.</p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 text-sm font-bold text-white bg-accent hover:bg-accent-hover rounded-xl transition-all shadow-md shadow-accent/20"
            >
              Rename
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenameModal;
