import React, { useState } from 'react';
import { useDrive } from '../hooks/useDrive';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { LayoutGrid, List, Plus, FolderPlus, Upload, HardDrive, Folder } from 'lucide-react';
import FileCard from '../components/FileCard';
import FolderCard from '../components/FolderCard';
import UploadModal from '../components/UploadModal';
import Breadcrumbs from '../components/Breadcrumbs';
import Loader from '../components/Loader';

import CreateFolderModal from '../components/CreateFolderModal';

import { useParams, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { folderId: urlFolderId } = useParams();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { 
    files, 
    folders, 
    currentFolder, 
    loading, 
    folderId, // Added folderId
    setFolderId, 
    createFolder, 
    uploadFile, 
    deleteItem, 
    toggleStar,
    updateFile,
    moveItem,
    refresh
  } = useDrive(urlFolderId || null);

  const handleRenameFolder = async (id, name) => {
    try {
      const { data } = await api.patch(`/folders/${id}/rename`, { name });
      if (data.success) {
        refresh();
        toast.success('Folder renamed');
        window.dispatchEvent(new CustomEvent('drive-update'));
        return true;
      }
    } catch (error) {
      toast.error('Rename failed');
      return false;
    }
  };

  const handleChangeColor = async (id, color) => {
    try {
      const { data } = await api.patch(`/folders/${id}/color`, { color });
      if (data.success) {
        refresh();
        toast.success('Color updated');
        window.dispatchEvent(new CustomEvent('drive-update'));
        return true;
      }
    } catch (error) {
      toast.error('Color update failed');
      return false;
    }
  };

  // Sync URL param with useDrive state
  // This useEffect might become redundant if useDrive handles initialFolderId directly
  // but keeping it as per original code structure and instruction snippet.
  React.useEffect(() => {
    setFolderId(urlFolderId || null);
  }, [urlFolderId, setFolderId]);

  const [viewMode, setViewMode] = useState('grid');
  const [folderViewMode, setFolderViewMode] = useState('grid');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const handleNewFolder = (name, color) => {
    createFolder(name, color);
    setIsCreateModalOpen(false);
  };

  const visibleFolders = folders;
  const visibleFiles = files;
  const allFiles = visibleFiles;

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          <Breadcrumbs folder={currentFolder} onNavigate={(id) => navigate(id ? `/folder/${id}` : '/')} />
        </div>
        {user?.role !== 'admin' && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center gap-2 bg-[#0b48ff] hover:bg-[#093fe0] text-white px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all shadow-md shadow-blue-500/20 active:scale-[0.98]"
            >
              <Upload size={18} />
              <span>Upload File</span>
            </button>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-800 dark:text-gray-100 bg-white dark:bg-darkSurface border border-lightBorder dark:border-darkBorder rounded-2xl hover:bg-gray-50 dark:hover:bg-[#222] transition-all"
            >
              <FolderPlus size={18} className="text-gray-700 dark:text-gray-200" />
              <span>New Folder</span>
            </button>
          </div>
        )}
      </div>

      <div className="pb-10">
        {loading ? (
          <div className="flex items-center justify-center h-64"><Loader /></div>
        ) : visibleFiles.length === 0 && visibleFolders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4">
              <HardDrive size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Your drive is empty</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">Upload files or create folders to start organizing your digital workspace.</p>
            <button 
              onClick={() => setIsUploadOpen(true)}
              className="mt-6 text-accent font-medium hover:underline flex items-center gap-2 mx-auto"
            >
              <Plus size={16} /> Upload your first file
            </button>
          </div>
        ) : (
          <div className="space-y-10 pb-10">
            {visibleFolders.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">Folders</h3>
                    <div className="flex items-center bg-white dark:bg-darkSurface border border-lightBorder dark:border-darkBorder rounded-xl p-1">
                      <button 
                        onClick={() => setFolderViewMode('grid')}
                        className={`p-2 rounded-lg transition-all ${folderViewMode === 'grid' ? 'bg-gray-50 dark:bg-[#222] text-[#0b48ff]' : 'text-gray-400'}`}
                        title="Grid view"
                      >
                        <LayoutGrid size={16} />
                      </button>
                      <button 
                        onClick={() => setFolderViewMode('list')}
                        className={`p-2 rounded-lg transition-all ${folderViewMode === 'list' ? 'bg-gray-50 dark:bg-[#222] text-[#0b48ff]' : 'text-gray-400'}`}
                        title="List view"
                      >
                        <List size={16} />
                      </button>
                    </div>
                  </div>
                <div className={folderViewMode === 'grid' ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6" : "flex flex-col gap-3"}>
                  {visibleFolders.map(folder => (
                    <FolderCard 
                      key={folder._id} 
                      folder={folder} 
                      viewMode={folderViewMode}
                      onClick={() => navigate(`/folder/${folder._id}`)}
                      onDelete={() => deleteItem(folder._id, 'folder')}
                      onStar={() => toggleStar(folder._id, 'folder')}
                      onRename={(newName) => handleRenameFolder(folder._id, newName)}
                      onColorChange={(newColor) => handleChangeColor(folder._id, newColor)}
                      onMove={moveItem}
                      onUpdate={refresh}
                    />
                  ))}
                </div>
              </div>
            )}

            {allFiles.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">Files</h3>
                  <div className="flex items-center bg-white dark:bg-darkSurface border border-lightBorder dark:border-darkBorder rounded-xl p-1">
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-gray-50 dark:bg-[#222] text-[#0b48ff]' : 'text-gray-400'}`}
                      title="Grid view"
                    >
                      <LayoutGrid size={16} />
                    </button>
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-gray-50 dark:bg-[#222] text-[#0b48ff]' : 'text-gray-400'}`}
                      title="List view"
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>
                <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' : 'flex flex-col gap-3'}`}>
                  {allFiles.map(file => (
                    <FileCard 
                      key={file._id} 
                      file={file} 
                      viewMode={viewMode}
                      onDelete={() => deleteItem(file._id, 'file')}
                      onStar={() => toggleStar(file._id, 'file')}
                      onUpdate={updateFile} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {isUploadOpen && (
        <UploadModal 
          onClose={() => setIsUploadOpen(false)} 
          onUpload={async (f) => {
            const success = await uploadFile(f);
            if(success) setIsUploadOpen(false);
          }} 
        />
      )}

      {isCreateModalOpen && (
        <CreateFolderModal 
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleNewFolder}
        />
      )}
    </div>
  );
};

export default Dashboard;
