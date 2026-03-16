import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';

const ShareModal = ({ file, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareLink = `${window.location.origin}/file/${file._id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1a1a1a] border border-lightBorder dark:border-darkBorder rounded-xl shadow-xl w-full max-w-md overflow-hidden" 
           onClick={(e) => e.stopPropagation()}>
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-lightBorder dark:border-darkBorder">
          <h3 className="text-lg font-semibold">Share "{file.filename}"</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Anyone with this link can request access to this file.
          </p>
          
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              readOnly 
              value={shareLink}
              className="flex-1 bg-gray-50 dark:bg-[#222] border border-lightBorder dark:border-darkBorder rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent text-gray-500"
            />
            <button 
              onClick={handleCopy}
              className={`p-2 rounded-md flex items-center justify-center transition-colors ${
                copied 
                  ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-lightSurface dark:bg-darkSurface text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#333]'
              }`}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
