import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, HardDrive, LayoutGrid, List, ArrowLeft, Loader2 } from 'lucide-react';
import api from '../utils/api';
import FileCard from '../components/FileCard';
import FolderCard from '../components/FolderCard';
import { toast } from 'react-hot-toast';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [viewMode, setViewMode] = useState('grid');

  const fetchResults = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/search?query=${encodeURIComponent(query)}`);
      if (data.success) {
        setFiles(data.files);
        setFolders(data.folders);
      }
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleUpdate = () => {
    fetchResults();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-gray-500 hover:text-accent"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">
              Search Results
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Showing results for "<span className="text-accent font-bold">{query}</span>"
            </p>
          </div>
        </div>

        <div className="flex items-center bg-white dark:bg-darkSurface border border-lightBorder dark:border-darkBorder rounded-xl p-1 shadow-sm">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-gray-50 dark:bg-[#222] text-accent' : 'text-gray-400'}`}
            title="Grid view"
          >
            <LayoutGrid size={18} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-gray-50 dark:bg-[#222] text-accent' : 'text-gray-400'}`}
            title="List view"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 pb-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-80 gap-3">
            <Loader2 className="w-10 h-10 text-accent animate-spin" />
            <p className="text-sm text-gray-500 font-medium italic">Searching in Cloudlet...</p>
          </div>
        ) : files.length === 0 && folders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-gray-50 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Search size={40} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">No results found</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
              We couldn't find anything matching your search. Try different keywords or double-check the spelling.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="mt-8 px-6 py-2.5 bg-accent text-white rounded-xl text-sm font-bold shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-all hover:-translate-y-0.5"
            >
              Back to Drive
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {folders.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <HardDrive size={16} className="text-accent" />
                  </div>
                  <h3 className="text-lg font-black tracking-tight text-gray-900 dark:text-gray-100 uppercase">Matching Folders</h3>
                </div>
                <div className={viewMode === 'grid' ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6" : "flex flex-col gap-3"}>
                  {folders.map(folder => (
                    <FolderCard 
                      key={folder._id} 
                      folder={folder} 
                      viewMode={viewMode}
                      onClick={() => navigate(`/folder/${folder._id}`)}
                      onUpdate={handleUpdate}
                      showPath={true} // New prop needed to show where it is? Better just normal card
                    />
                  ))}
                </div>
              </section>
            )}

            {files.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Search size={16} className="text-accent" />
                  </div>
                  <h3 className="text-lg font-black tracking-tight text-gray-900 dark:text-gray-100 uppercase">Matching Files</h3>
                </div>
                <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" : "flex flex-col gap-3"}>
                  {files.map(file => (
                    <FileCard 
                      key={file._id} 
                      file={file} 
                      viewMode={viewMode}
                      onUpdate={handleUpdate}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
