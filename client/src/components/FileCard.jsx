import React, { useState, useRef, useEffect } from 'react';
import { formatBytes } from '../utils/formatters';
import { 
  Eye, Share2, Trash2, FileText, Image as ImageIcon, 
  File as FileIcon, MoreVertical, Edit, Star, Folder, Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import RenameModal from './RenameModal';
import ShareModal from './ShareModal';
import EditFileModal from './EditFileModal';
import MoveToFolderModal from './MoveToFolderModal';
import ImagePreviewModal from './ImagePreviewModal';

const FileCard = ({ file, viewMode, onDelete, onUpdate, onStar }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = () => {
    if (file.fileType === 'pdf') return <FileText size={40} className="text-red-500" />;
    if (file.fileType === 'image' || ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(file.fileType?.toLowerCase())) return <ImageIcon size={40} className="text-blue-500" />;
    return <FileIcon size={40} className="text-gray-500" />;
  };

  const handleView = (e) => {
    if (e) e.stopPropagation();
    console.log("Opening file URL:", file.url);
    const isImage = file.fileType === 'image' || ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(file.fileType?.toLowerCase());
    if (isImage) {
      // Defer opening by a tick so the click that triggered "View" can't immediately
      // close the modal via backdrop click handlers.
      window.setTimeout(() => setIsPreviewOpen(true), 0);
    } else {
      // Open the same-origin proxy view endpoint in a new tab.
      // The backend streams the file (from Cloudinary) to avoid cross-origin PDF viewer issues.
      const finalUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + `/files/${file._id}/view`;
      const win = window.open(finalUrl, '_blank', 'noopener,noreferrer');
      if (!win) {
        const link = document.createElement('a');
        link.href = finalUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const relativeTime = `uploaded ${formatDistanceToNow(new Date(file.createdAt))} ago`;

  const isImageFile = file.fileType === 'image' || ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(file.fileType?.toLowerCase());

  if (viewMode === 'list') {
    return (
      <>
        <div className="flex items-center justify-between p-3 bg-white dark:bg-[#1a1a1a] border border-lightBorder dark:border-darkBorder rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors group">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div 
              className={`w-10 h-10 rounded bg-gray-50 dark:bg-[#111] flex items-center justify-center shrink-0 relative`}
              onClick={isImageFile ? handleView : undefined}
            >
              {isImageFile ? (
                <img src={file.url} alt={file.filename} className="w-full h-full object-cover rounded" />
              ) : (
                getIcon()
              )}
              {file.isStarred && (
                <div className="absolute -top-1 -right-1 bg-yellow-400 text-white rounded-full p-0.5 shadow-sm border border-white dark:border-darkBorder">
                  <Star size={8} fill="currentColor" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate flex items-center gap-2">
                {file.filename}
              </h4>
              <p className="text-xs text-gray-500 flex items-center flex-wrap gap-x-2 gap-y-1">
                <span className="flex items-center gap-1"><Clock size={10} /> {relativeTime}</span>
                <span>•</span>
                <span>{formatBytes(file.size)}</span>
                {file.owner && typeof file.owner === 'object' && (
                  <span className="flex items-center gap-1 bg-accent/5 text-accent px-1.5 py-0.5 rounded text-[10px] font-bold">
                    Shared by {file.owner.name}
                  </span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={handleView} className="p-1.5 text-gray-500 hover:text-accent rounded transition-colors" title="View"><Eye size={16} /></button>
            {onUpdate && (
              <button onClick={() => setIsEditModalOpen(true)} className="p-1.5 text-gray-500 hover:text-green-500 rounded transition-colors" title="Edit"><Edit size={16} /></button>
            )}
            <button 
              onClick={onStar} 
              className={`p-1.5 rounded transition-colors ${file.isStarred ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'}`} 
              title={file.isStarred ? 'Unstar' : 'Star'}
            >
              <Star size={16} fill={file.isStarred ? 'currentColor' : 'none'} />
            </button>
            <button onClick={() => setIsShareModalOpen(true)} className="p-1.5 text-gray-500 hover:text-blue-500 rounded transition-colors" title="Share"><Share2 size={16} /></button>
            <button onClick={onDelete} className="p-1.5 text-gray-500 hover:text-red-500 rounded transition-colors" title="Delete"><Trash2 size={16} /></button>
          </div>
        </div>
        {isShareModalOpen && (
          <ShareModal 
            item={file} 
            type="file" 
            onClose={() => setIsShareModalOpen(false)} 
          />
        )}
        {isEditModalOpen && (
          <EditFileModal 
            file={file} 
            onClose={() => setIsEditModalOpen(false)} 
            onUpdate={onUpdate} 
          />
        )}
        {isMoveModalOpen && (
          <MoveToFolderModal 
            item={file} 
            type="file" 
            onClose={() => setIsMoveModalOpen(false)} 
            onMove={onUpdate} 
          />
        )}

        {isRenameModalOpen && (
          <RenameModal
            item={file}
            type="file"
            onClose={() => setIsRenameModalOpen(false)}
            onRename={(newName) => {
              const formData = new FormData();
              formData.append('filename', newName);
              onUpdate(file._id, formData);
              setIsRenameModalOpen(false);
            }}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div 
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('itemId', file._id);
          e.dataTransfer.setData('itemType', 'file');
        }}
        className="bg-white dark:bg-[#1a1a1a] border border-lightBorder dark:border-darkBorder rounded-[2rem] p-4 hover:shadow-xl hover:shadow-black/[0.02] transition-all group flex flex-col relative gap-4"
        onClick={handleView}
      >
        <div 
          className="w-full aspect-square relative flex items-center justify-center bg-gray-50 dark:bg-[#111] rounded-[1.5rem] overflow-hidden border border-lightBorder dark:border-darkBorder transition-transform group-hover:scale-[1.02] duration-300"
          onClick={isImageFile ? (e) => { e.stopPropagation(); handleView(); } : undefined}
        >
          {isImageFile ? (
            <img src={file.url} alt={file.filename} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
               {getIcon()}
            </div>
          )}

          {file.isStarred && (
            <div className="absolute top-3 left-3 bg-yellow-400 text-white rounded-full p-1 shadow-md border border-white dark:border-darkBorder">
              <Star size={10} fill="currentColor" />
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3 px-1">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            file.fileType === 'pdf' ? 'bg-red-50 dark:bg-red-900/10 text-red-500' :
            isImageFile ? 'bg-blue-50 dark:bg-blue-900/10 text-blue-500' :
            'bg-gray-50 dark:bg-gray-800 text-gray-500'
          }`}>
            {file.fileType === 'pdf' ? <FileText size={20} /> :
             isImageFile ? <ImageIcon size={20} /> :
             <FileIcon size={20} />}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate" title={file.filename}>
              {file.filename}
            </h4>
            <p className="text-[11px] text-gray-400 font-medium truncate mt-0.5 flex items-center gap-1.5">
              <span>{formatBytes(file.size)}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(file.createdAt))} ago</span>
            </p>
            {file.owner && typeof file.owner === 'object' && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center text-[8px] font-bold text-accent border border-accent/20">
                  {file.owner.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-[10px] font-bold text-gray-500 truncate">Shared by {file.owner.name}</span>
              </div>
            )}
          </div>

          <div className="relative" ref={optionsRef} onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowOptions(!showOptions);
              }} 
              className="p-1 text-gray-300 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
            >
              <MoreVertical size={16} />
            </button>
            
            {showOptions && (
              <div className="absolute right-0 bottom-full mb-1 w-36 bg-white dark:bg-[#1a1a1a] border border-lightBorder dark:border-darkBorder rounded-xl shadow-xl py-1 z-[60] animate-in fade-in slide-in-from-bottom-2 duration-150">
                <button onClick={() => { handleView(); setShowOptions(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#222] flex items-center gap-2">
                  <Eye size={14} /> View
                </button>
                {onUpdate && (
                  <button onClick={() => { setIsEditModalOpen(true); setShowOptions(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#222] flex items-center gap-2">
                    <Edit size={14} /> Edit
                  </button>
                )}
                <button 
                  onClick={() => { onStar(); setShowOptions(false); }} 
                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${file.isStarred ? 'text-yellow-600' : 'text-gray-700 dark:text-gray-300'} hover:bg-gray-50 dark:hover:bg-[#222]`}
                >
                  <Star size={14} fill={file.isStarred ? 'currentColor' : 'none'} /> {file.isStarred ? 'Unstar' : 'Star'}
                </button>
                <button onClick={() => { setIsMoveModalOpen(true); setShowOptions(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#222] flex items-center gap-2">
                  <Folder size={14} /> Move
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
      
      {isShareModalOpen && (
        <ShareModal 
          item={file} 
          type="file"
          onClose={() => setIsShareModalOpen(false)} 
        />
      )}

      {isMoveModalOpen && (
        <MoveToFolderModal 
          item={file}
          type="file"
          onClose={() => setIsMoveModalOpen(false)}
          onMove={onUpdate}
        />
      )}

      {isEditModalOpen && (
        <EditFileModal 
          file={file} 
          onClose={() => setIsEditModalOpen(false)} 
          onUpdate={onUpdate} 
        />
      )}


      {isPreviewOpen && (
        <ImagePreviewModal 
          file={file} 
          onClose={() => setIsPreviewOpen(false)} 
        />
      )}
    </>
  );
};

export default FileCard;
