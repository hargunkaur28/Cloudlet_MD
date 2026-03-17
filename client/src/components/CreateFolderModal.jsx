import React, { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';

const CreateFolderModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#4f46e5');

  const colors = [
    { name: 'Indigo', value: '#4f46e5' },
    { name: 'Sky', value: '#0ea5e9' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Rose', value: '#f43f5e' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Slate', value: '#64748b' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim(), selectedColor);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1a1a1a] border border-lightBorder dark:border-darkBorder rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-lightBorder dark:border-darkBorder">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <FolderPlus size={20} />
            </div>
            <h3 className="text-xl font-bold tracking-tight">New Folder</h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Folder Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#111] border border-lightBorder dark:border-darkBorder rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              placeholder="e.g. Project Documents"
              autoFocus
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-between">
              <span>Choose a color</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">Appearance</span>
            </label>
            <div className="grid grid-cols-4 gap-3">
              {colors.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setSelectedColor(c.value)}
                  className={`relative aspect-square rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center border-2 ${
                    selectedColor === c.value 
                      ? 'border-gray-900 dark:border-gray-100 shadow-md ring-2 ring-gray-900/10' 
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                >
                   {selectedColor === c.value && (
                     <div className="w-2 h-2 rounded-full bg-white shadow-sm" />
                   )}
                </button>
              ))}
            </div>
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
              className="flex-1 px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-accent to-indigo-600 hover:from-indigo-600 hover:to-accent rounded-xl transition-all shadow-md shadow-accent/20"
            >
              Create Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFolderModal;
