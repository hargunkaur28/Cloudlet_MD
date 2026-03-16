import React, { useState, useRef } from 'react';
import { X, UploadCloud, Loader2 } from 'lucide-react';

const UploadModal = ({ onClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadClick = async () => {
    if (!file) return;
    setIsUploading(true);
    await onUpload(file);
    setIsUploading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1a1a1a] border border-lightBorder dark:border-darkBorder rounded-xl shadow-xl w-full max-w-md overflow-hidden relative"
           onClick={(e) => e.stopPropagation()}>
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-lightBorder dark:border-darkBorder">
          <h3 className="text-lg font-semibold">Upload File</h3>
          <button onClick={onClose} disabled={isUploading} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {!file ? (
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center transition-colors ${
                dragActive ? 'border-accent bg-accent/5' : 'border-lightBorder dark:border-darkBorder hover:border-accent hover:bg-gray-50 dark:hover:bg-[#222]'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="w-12 h-12 bg-gray-100 dark:bg-[#222] rounded-full flex items-center justify-center mb-4 text-accent">
                <UploadCloud size={24} />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Click or drag file to this area</p>
              <p className="text-xs text-gray-500">Supports PDF, PNG, JPG, JPEG, GIF up to 10MB</p>
              
              <button 
                onClick={() => inputRef.current?.click()}
                className="mt-6 px-4 py-2 bg-white dark:bg-[#1a1a1a] border border-lightBorder dark:border-darkBorder rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#222] transition-colors"
              >
                Select File
              </button>
              <input 
                ref={inputRef}
                type="file" 
                className="hidden" 
                onChange={handleChange}
                accept="image/*,application/pdf"
              />
            </div>
          ) : (
            <div className="border border-lightBorder dark:border-darkBorder rounded-xl p-4 flex items-center justify-between bg-gray-50 dark:bg-[#222]">
              <div className="flex flex-col min-w-0 flex-1 mr-4">
                <span className="text-sm font-medium truncate">{file.name}</span>
                <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              {!isUploading && (
                <button onClick={() => setFile(null)} className="p-1 text-gray-400 hover:text-red-500 rounded">
                  <X size={16} />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 dark:bg-[#111] border-t border-lightBorder dark:border-darkBorder flex justify-end gap-3">
          <button 
            onClick={onClose}
            disabled={isUploading}
            className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#333] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleUploadClick}
            disabled={!file || isUploading}
            className="flex items-center justify-center min-w-[100px] px-4 py-2 bg-accent hover:bg-indigo-600 rounded-md text-sm font-medium text-white transition-colors disabled:opacity-70"
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default UploadModal;
