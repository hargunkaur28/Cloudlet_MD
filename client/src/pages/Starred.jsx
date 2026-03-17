import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { Star, Loader2, Folder } from 'lucide-react';
import FileCard from '../components/FileCard';
import FolderCard from '../components/FolderCard';
import Loader from '../components/Loader';

const Starred = () => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStarred = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/files/starred');
      if (data.success) {
        setFiles(data.files);
        setFolders(data.folders);
      }
    } catch (error) {
      console.error('Failed to load starred items');
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async (id, type, name) => {
    try {
      const url = type === 'folder' ? `/folders/${id}/rename` : `/files/${id}`;
      const payload = type === 'folder' ? { name } : { filename: name };
      await api.patch(url, payload);
      fetchStarred();
      toast.success('Renamed successfully');
      window.dispatchEvent(new CustomEvent('drive-update'));
    } catch (error) {
      toast.error('Rename failed');
    }
  };

  const handleColorChange = async (id, color) => {
    try {
      await api.patch(`/folders/${id}/color`, { color });
      fetchStarred();
      toast.success('Color updated');
      window.dispatchEvent(new CustomEvent('drive-update'));
    } catch (error) {
      toast.error('Color update failed');
    }
  };

  const handleMove = async (id, type, targetFolderId) => {
    try {
      const url = type === 'folder' ? `/folders/${id}/move` : `/files/${id}/move`;
      await api.patch(url, { targetFolderId });
      fetchStarred();
      toast.success('Item moved');
      window.dispatchEvent(new CustomEvent('drive-update'));
    } catch (error) {
      toast.error('Move failed');
    }
  };

  useEffect(() => {
    fetchStarred();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader /></div>;

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Star className="text-yellow-500" fill="currentColor" /> Starred
        </h1>
        <p className="text-sm text-gray-500">Quick access to your important items</p>
      </div>

      <div className="flex-1 overflow-auto">
        {files.length === 0 && folders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-lightBorder dark:bg-darkBorder rounded-full flex items-center justify-center mb-4">
              <Star className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No starred items</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-sm">Items you star will appear here for quick access.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {folders.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Folders</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                  {folders.map(folder => (
                    <FolderCard 
                      key={folder._id} 
                      folder={folder} 
                      onStar={fetchStarred}
                      onRename={(newName) => handleRename(folder._id, 'folder', newName)}
                      onColorChange={(newColor) => handleColorChange(folder._id, newColor)}
                      onDelete={() => {}} // Handle delete
                      onMove={handleMove}
                      onUpdate={fetchStarred}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {files.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Files</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {files.map(file => (
                    <FileCard 
                      key={file._id} 
                      file={file} 
                      onUpdate={fetchStarred}
                      onDelete={() => {}} // Handle delete later
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Starred;
