import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { Users } from 'lucide-react';
import FileCard from '../components/FileCard';
import Loader from '../components/Loader';

const SharedWithMe = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSharedFiles = async () => {
      try {
        const { data } = await api.get('/files/shared-with-me');
        if (data.success) {
          setFiles(data.files);
        }
      } catch (error) {
        toast.error('Failed to load shared files');
      } finally {
        setLoading(false);
      }
    };
    fetchSharedFiles();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Shared with me</h1>
        <p className="text-sm text-gray-500">Files other people have shared with you</p>
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64"><Loader /></div>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-lightBorder dark:bg-darkBorder rounded-full flex items-center justify-center mb-4">
              <Users className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Nothing shared yet</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-sm">
              Files shared with you will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {files.map((file) => (
              <FileCard 
                key={file._id} 
                file={file} 
                viewMode="grid"
                onDelete={() => {
                  toast.error("You cannot delete files shared with you");
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedWithMe;
