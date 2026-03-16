import React, { useState } from 'react';
import { formatBytes } from '../utils/formatters';
import { Eye, Share2, Trash2, FileText, Image as ImageIcon, File as FileIcon, MoreVertical } from 'lucide-react';
import ShareModal from './ShareModal';

const FileCard = ({ file, viewMode, onDelete }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const getIcon = () => {
    if (file.fileType === 'pdf') return <FileText size={40} className="text-red-500" />;
    if (file.fileType === 'image') return <ImageIcon size={40} className="text-blue-500" />;
    return <FileIcon size={40} className="text-gray-500" />;
  };

  const handleView = () => window.open(file.url, '_blank');

  if (viewMode === 'list') {
    return (
      <>
        <div className="flex items-center justify-between p-3 bg-white dark:bg-[#1a1a1a] border border-lightBorder dark:border-darkBorder rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors group">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-10 h-10 rounded bg-gray-50 dark:bg-[#111] flex items-center justify-center shrink-0">
              {file.fileType === 'image' ? (
                <img src={file.url} alt={file.filename} className="w-full h-full object-cover rounded" />
              ) : (
                getIcon()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{file.filename}</h4>
              <p className="text-xs text-gray-500">{new Date(file.createdAt).toLocaleDateString()} • {formatBytes(file.size)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={handleView} className="p-1.5 text-gray-500 hover:text-accent rounded transition-colors"><Eye size={16} /></button>
            <button onClick={() => setIsShareModalOpen(true)} className="p-1.5 text-gray-500 hover:text-blue-500 rounded transition-colors"><Share2 size={16} /></button>
            <button onClick={onDelete} className="p-1.5 text-gray-500 hover:text-red-500 rounded transition-colors"><Trash2 size={16} /></button>
          </div>
        </div>
        {isShareModalOpen && <ShareModal file={file} onClose={() => setIsShareModalOpen(false)} />}
      </>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-[#1a1a1a] border border-lightBorder dark:border-darkBorder rounded-xl overflow-hidden hover:border-gray-300 dark:hover:border-gray-600 transition-colors group flex flex-col">
        <div className="aspect-square relative flex items-center justify-center bg-gray-50 dark:bg-[#111] border-b border-lightBorder dark:border-darkBorder">
          {file.fileType === 'image' ? (
            <img src={file.url} alt={file.filename} className="w-full h-full object-cover" />
          ) : (
            getIcon()
          )}
          
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="relative">
              <button onClick={() => setShowOptions(!showOptions)} className="p-1.5 bg-white dark:bg-darkBg rounded-md shadow-sm border border-lightBorder dark:border-darkBorder text-gray-600 dark:text-gray-300 hover:text-accent">
                <MoreVertical size={16} />
              </button>
              
              {showOptions && (
                <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-[#1a1a1a] border border-lightBorder dark:border-darkBorder rounded-md shadow-lg py-1 z-10">
                  <button onClick={() => { handleView(); setShowOptions(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#222] flex items-center gap-2">
                    <Eye size={14} /> View
                  </button>
                  <button onClick={() => { setIsShareModalOpen(true); setShowOptions(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#222] flex items-center gap-2">
                    <Share2 size={14} /> Share
                  </button>
                  <div className="h-px bg-lightBorder dark:bg-darkBorder my-1"></div>
                  <button onClick={() => { onDelete(); setShowOptions(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-3">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate" title={file.filename}>{file.filename}</h4>
          <p className="text-xs text-gray-500 mt-1">{new Date(file.createdAt).toLocaleDateString()} • {formatBytes(file.size)}</p>
        </div>
      </div>
      
      {isShareModalOpen && <ShareModal file={file} onClose={() => setIsShareModalOpen(false)} />}
    </>
  );
};

export default FileCard;
