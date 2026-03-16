import React, { useEffect, useState } from 'react';
import { useFiles } from '../hooks/useFiles';
import { LayoutGrid, List, Plus, Search, Folder } from 'lucide-react';
import FileCard from '../components/FileCard';
import UploadModal from '../components/UploadModal';
import Loader from '../components/Loader';

const Dashboard = () => {
  const { files, loading, fetchFiles, uploadFile, deleteFile } = useFiles();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const filteredFiles = files
    .filter(f => f.filename.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'date-asc') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'name') return a.filename.localeCompare(b.filename);
      if (sortBy === 'size') return b.size - a.size;
      return 0;
    });

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Files</h1>
          <p className="text-sm text-gray-500">Manage and share your files securely</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm bg-white dark:bg-[#1a1a1a] border border-lightBorder dark:border-darkBorder rounded-md focus:outline-none focus:border-accent w-full md:w-64 transition-colors"
            />
          </div>

          <div className="flex items-center bg-white dark:bg-[#1a1a1a] border border-lightBorder dark:border-darkBorder rounded-md overflow-hidden">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-lightSurface dark:bg-darkSurface text-accent' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
              title="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-lightSurface dark:bg-darkSurface text-accent' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
              title="List View"
            >
              <List size={18} />
            </button>
          </div>

          <button 
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 bg-accent hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Upload</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end mb-6">
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-transparent text-sm border-none focus:outline-none text-gray-500 cursor-pointer"
        >
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="name">Name</option>
          <option value="size">Size</option>
        </select>
      </div>

      <div className="flex-1 overflow-auto h-full">
        {loading ? (
          <div className="flex items-center justify-center h-64"><Loader /></div>
        ) : filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-lightBorder dark:bg-darkBorder rounded-full flex items-center justify-center mb-4">
              <Folder className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No files found</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-sm">
              {searchQuery ? 'Try adjusting your search query' : 'Upload your first file by clicking the upload button above.'}
            </p>
          </div>
        ) : (
          <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'flex flex-col gap-2'}`}>
            {filteredFiles.map((file) => (
              <FileCard 
                key={file._id} 
                file={file} 
                viewMode={viewMode}
                onDelete={() => deleteFile(file._id)}
              />
            ))}
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
    </div>
  );
};

export default Dashboard;
