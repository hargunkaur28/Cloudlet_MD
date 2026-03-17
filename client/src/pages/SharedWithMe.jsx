import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { Users, Folder } from 'lucide-react';
import FileCard from '../components/FileCard';
import FolderCard from '../components/FolderCard';
import Loader from '../components/Loader';

const SharedWithMe = () => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchShared = async () => {
    setLoading(true);
    try {
      const [filesRes, foldersRes] = await Promise.all([
        api.get('/files/shared-with-me'),
        api.get('/folders/shared-with-me')
      ]);
      
      if (filesRes.data.success) setFiles(filesRes.data.files);
      if (foldersRes.data.success) setFolders(foldersRes.data.folders);
    } catch (error) {
      toast.error('Failed to load shared items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShared();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Shared with me</h1>
        <p className="text-sm text-gray-500">Items other people have shared with you</p>
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64"><Loader /></div>
        ) : files.length === 0 && folders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-lightBorder dark:bg-darkBorder rounded-full flex items-center justify-center mb-4">
              <Users className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Nothing shared yet</h3>
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
                      onStar={() => {}}
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
                      viewMode="grid"
                      onDelete={() => toast.error("Cannot delete shared files")}
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

export default SharedWithMe;
