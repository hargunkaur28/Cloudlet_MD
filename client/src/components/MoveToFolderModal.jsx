import React, { useEffect, useState } from 'react';
import { X, Folder, ChevronRight, Loader2 } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

const MoveToFolderModal = ({ item, type = 'file', onClose, onMove }) => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const { data } = await api.get('/folders'); // Get root folders
        if (data.success) {
          // Filter out the folder itself if we're moving a folder
          setFolders(data.folders.filter(f => f._id !== item._id));
        }
      } catch (error) {
        toast.error('Failed to load destination folders');
      } finally {
        setLoading(false);
      }
    };
    fetchFolders();
  }, [item._id]);

  const handleMove = async (targetId) => {
    setMoving(true);
    try {
      const endpoint = type === 'file' ? `/files/${item._id}/move` : `/folders/${item._id}/move`;
      const { data } = await api.patch(endpoint, { targetFolderId: targetId });
      if (data.success) {
        toast.success('Moved successfully');
        onMove();
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to move item');
    } finally {
      setMoving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1a1a1a] border border-lightBorder dark:border-darkBorder rounded-xl shadow-xl w-full max-w-md overflow-hidden" 
           onClick={(e) => e.stopPropagation()}>
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-lightBorder dark:border-darkBorder">
          <h3 className="text-lg font-semibold">Move "{type === 'file' ? item.filename : item.name}"</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center p-8"><Loader2 className="animate-spin text-accent" /></div>
          ) : (
            <div className="space-y-1">
              <button 
                onClick={() => handleMove(null)}
                disabled={moving}
                className="w-full flex items-center justify-between p-3 rounded-md hover:bg-gray-100 dark:hover:bg-[#222] transition-colors text-sm font-medium"
              >
                <div className="flex items-center gap-3">
                  <Folder className="text-accent" size={20} />
                  <span>My Drive (Root)</span>
                </div>
                {moving ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={16} />}
              </button>

              {folders.map(folder => (
                <button 
                  key={folder._id}
                  onClick={() => handleMove(folder._id)}
                  disabled={moving}
                  className="w-full flex items-center justify-between p-3 rounded-md hover:bg-gray-100 dark:hover:bg-[#222] transition-colors text-sm"
                >
                  <div className="flex items-center gap-3">
                    <Folder className="text-indigo-400" size={20} />
                    <span>{folder.name}</span>
                  </div>
                  {moving ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={16} />}
                </button>
              ))}

              {folders.length === 0 && (
                <p className="text-center py-4 text-xs text-gray-500">No other folders available</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoveToFolderModal;
