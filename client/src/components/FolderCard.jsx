import React, { useState, useRef, useEffect } from 'react';
import { Folder, MoreVertical, Edit, Star, Share2, Trash2, CornerUpRight, Clock, ChevronRight } from 'lucide-react';
import RenameModal from './RenameModal';
import ShareModal from './ShareModal';
import MoveToFolderModal from './MoveToFolderModal';

const FolderCard = ({ folder, onClick, onDelete, onStar, onRename, onColorChange, onUpdate, onMove, viewMode = 'grid' }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const optionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
        setShowColorPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const colors = [
    { name: 'Indigo', value: '#4f46e5' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Gray', value: '#6b7280' },
  ];

  if (viewMode === 'list') {
    return (
      <>
        <div 
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('itemId', folder._id);
            e.dataTransfer.setData('itemType', 'folder');
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            const itemId = e.dataTransfer.getData('itemId');
            const itemType = e.dataTransfer.getData('itemType');
            if (itemId && itemId !== folder._id) {
              onMove(itemId, itemType, folder._id);
            }
          }}
          className={`flex items-center justify-between p-3 bg-white dark:bg-[#1a1a1a] border ${isDragOver ? 'border-accent ring-2 ring-accent/20' : 'border-lightBorder dark:border-darkBorder'} rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all group overflow-visible`}
          onClick={onClick}
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-10 h-10 rounded bg-gray-50 dark:bg-[#111] flex items-center justify-center shrink-0 relative">
              <Folder 
                size={24} 
                color={folder.color || '#4f46e5'} 
                fill={folder.color || '#4f46e5'} 
                className="opacity-90"
              />
              {folder.isStarred && (
                <div className="absolute -top-1 -right-1 bg-yellow-400 text-white rounded-full p-0.5 shadow-sm border border-white dark:border-darkBorder">
                  <Star size={8} fill="currentColor" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {folder.name}
              </h4>
              <p className="text-xs text-gray-500">
                {new Date(folder.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={onStar}
              className={`p-1.5 rounded transition-colors ${folder.isStarred ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'}`}
              title={folder.isStarred ? 'Unstar' : 'Star'}
            >
              <Star size={16} fill={folder.isStarred ? 'currentColor' : 'none'} />
            </button>
            <div className="relative" ref={optionsRef}>
              <button 
                onClick={() => setShowOptions(!showOptions)}
                className="p-1.5 text-gray-500 hover:text-accent rounded transition-colors"
              >
                <MoreVertical size={16} />
              </button>
              {showOptions && (
                <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-[#1a1a1a] border border-lightBorder dark:border-darkBorder rounded-md shadow-lg py-1 z-[60]">
                  <button onClick={() => { setIsRenameModalOpen(true); setShowOptions(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#222] flex items-center gap-2">
                    <Edit size={14} /> Rename
                  </button>
                  <button onClick={() => { setIsMoveModalOpen(true); setShowOptions(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#222] flex items-center gap-2">
                    <CornerUpRight size={14} /> Move
                  </button>
                  <button 
                    onClick={() => { setShowColorPicker(!showColorPicker); }} 
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#222] flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full" style={{ backgroundColor: folder.color || '#4f46e5' }}></div>
                       Color
                    </div>
                    <ChevronRight size={12} className={showColorPicker ? 'rotate-90' : ''} />
                  </button>
                  {showColorPicker && (
                    <div className="px-2 py-2 grid grid-cols-4 gap-2 bg-gray-50 dark:bg-[#111] border-y border-lightBorder dark:border-darkBorder">
                      {colors.map(c => (
                        <button
                          key={c.value}
                          onClick={() => { onColorChange(c.value); setShowColorPicker(false); setShowOptions(false); }}
                          className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${folder.color === c.value ? 'border-white ring-2 ring-accent' : 'border-transparent'}`}
                          style={{ backgroundColor: c.value }}
                        />
                      ))}
                    </div>
                  )}
                  <div className="h-px bg-lightBorder dark:bg-darkBorder my-1"></div>
                  <button onClick={() => { onDelete(); setShowOptions(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {isMoveModalOpen && (
          <MoveToFolderModal 
            item={folder} 
            type="folder" 
            onClose={() => setIsMoveModalOpen(false)} 
            onMove={onMove} 
          />
        )}

        {isRenameModalOpen && (
          <RenameModal
            item={folder}
            type="folder"
            onClose={() => setIsRenameModalOpen(false)}
            onRename={(newName) => {
              onRename(newName);
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
        e.dataTransfer.setData('itemId', folder._id);
        e.dataTransfer.setData('itemType', 'folder');
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        const itemId = e.dataTransfer.getData('itemId');
        const itemType = e.dataTransfer.getData('itemType');
        if (itemId && itemId !== folder._id) {
          onMove(itemId, itemType, folder._id);
        }
      }}
      className={`bg-white dark:bg-[#1a1a1a] border ${isDragOver ? 'border-accent ring-2 ring-accent/20' : 'border-lightBorder dark:border-darkBorder'} rounded-[2rem] p-6 hover:shadow-xl hover:shadow-black/[0.02] transition-all group cursor-pointer relative flex flex-col gap-4`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-[#111] border border-lightBorder dark:border-darkBorder flex items-center justify-center shrink-0 relative transition-transform group-hover:scale-105">
          <Folder 
            size={24} 
            color={folder.color || '#4f46e5'} 
            fill="none" 
            strokeWidth={2}
            className="opacity-90"
          />
          {folder.isStarred && (
            <div className="absolute -top-1 -right-1 bg-yellow-400 text-white rounded-full p-0.5 shadow-sm border border-white dark:border-darkBorder">
              <Star size={8} fill="currentColor" />
            </div>
          )}
        </div>

        <div className="relative" ref={optionsRef} onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className="p-1 px-0 text-gray-300 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
          >
            <MoreVertical size={16} />
          </button>
          
          {showOptions && (
            <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-[#1a1a1a] border border-lightBorder dark:border-darkBorder rounded-xl shadow-xl py-1 z-[60] animate-in fade-in zoom-in duration-150">
              <button 
                onClick={() => { 
                  setIsRenameModalOpen(true);
                  setShowOptions(false); 
                }} 
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#222] flex items-center gap-2"
              >
                <Edit size={14} /> Rename
              </button>
              <button 
                onClick={() => { onStar(); setShowOptions(false); }} 
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${folder.isStarred ? 'text-yellow-600' : 'text-gray-700 dark:text-gray-300'} hover:bg-gray-50 dark:hover:bg-[#222]`}
              >
                <Star size={14} fill={folder.isStarred ? 'currentColor' : 'none'} /> {folder.isStarred ? 'Unstar' : 'Star'}
              </button>
              <div onClick={() => { setShowShareModal(true); setShowOptions(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#222] flex items-center gap-2">
                <Share2 size={14} /> Share
              </div>
              <div onClick={() => { setIsMoveModalOpen(true); setShowOptions(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#222] flex items-center gap-2">
                <CornerUpRight size={14} /> Move
              </div>
              <button 
                onClick={() => { setShowColorPicker(!showColorPicker); }} 
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#222] flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: folder.color || '#4f46e5' }}></div>
                  Color
                </div>
                <ChevronRight size={12} className={showColorPicker ? 'rotate-90' : ''} />
              </button>

              {showColorPicker && (
                <div className="px-2 py-2 grid grid-cols-4 gap-2 bg-gray-50/50 dark:bg-[#111]/50 border-y border-lightBorder dark:border-darkBorder">
                  {colors.map(c => (
                    <button
                      key={c.value}
                      onClick={() => { onColorChange(c.value); setShowColorPicker(false); setShowOptions(false); }}
                      className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${folder.color === c.value ? 'border-white ring-2 ring-accent' : 'border-transparent'}`}
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                    />
                  ))}
                </div>
              )}

              <div className="h-px bg-lightBorder dark:bg-darkBorder my-1"></div>
              <button onClick={() => { onDelete(); setShowOptions(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-auto">
        <h4 className="text-base font-bold text-gray-900 dark:text-gray-100 truncate mb-1" title={folder.name}>
          {folder.name}
        </h4>
        <p className="text-xs text-gray-400 font-medium tracking-tight flex flex-col gap-1">
          <span>{new Date(folder.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} • {folder.fileCount || 0} files</span>
          {folder.owner && typeof folder.owner === 'object' && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-wider">
              <span className="w-1 h-1 rounded-full bg-accent"></span>
              Shared by {folder.owner.name}
            </span>
          )}
        </p>
      </div>
    </div>

      {showShareModal && (
        <ShareModal 
          item={folder} 
          type="folder"
          onClose={() => setShowShareModal(false)} 
        />
      )}

      {isMoveModalOpen && (
        <MoveToFolderModal 
          item={folder} 
          type="folder" 
          onClose={() => setIsMoveModalOpen(false)} 
          onMove={onMove} 
        />
      )}

      {isRenameModalOpen && (
        <RenameModal
          item={folder}
          type="folder"
          onClose={() => setIsRenameModalOpen(false)}
          onRename={(newName) => {
            onRename(newName);
            setIsRenameModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export default FolderCard;
