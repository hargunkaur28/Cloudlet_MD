import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Clock, HardDrive, LayoutGrid, List } from 'lucide-react';
import FileCard from '../components/FileCard';
import Loader from '../components/Loader';
import { useDrive } from '../hooks/useDrive';

const Recent = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const { deleteItem, toggleStar, updateFile } = useDrive();

  const fetchRecent = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/files/recent');
      if (data.success) {
        setFiles(data.files);
      }
    } catch (error) {
      console.error('Failed to load recent files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecent();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader /></div>;

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
          <Clock className="text-indigo-500" size={32} /> Recent
        </h1>
        <p className="text-sm text-gray-500 mt-1">Quick access to your most recently uploaded or modified files</p>
      </div>

      <div className="flex-1">
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4">
              <Clock size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">No recent activity</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">Your recently uploaded files will appear here for quick access.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <LayoutGrid size={14} className="text-accent" /> Latest Files
              </h3>
              <div className="flex items-center bg-lightBorder/30 dark:bg-darkBorder/30 rounded-lg p-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-[#222] text-accent shadow-sm' : 'text-gray-400'}`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-[#222] text-accent shadow-sm' : 'text-gray-400'}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>

            <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' : 'flex flex-col gap-3'}`}>
              {files.map(file => (
                <FileCard 
                  key={file._id} 
                  file={file} 
                  viewMode={viewMode}
                  onDelete={() => deleteItem(file._id, 'file')}
                  onStar={() => {
                     toggleStar(file._id, 'file');
                     // Local update to avoid full refresh
                     setFiles(prev => prev.map(f => f._id === file._id ? {...f, isStarred: !f.isStarred} : f));
                  }}
                  onUpdate={updateFile} 
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recent;
