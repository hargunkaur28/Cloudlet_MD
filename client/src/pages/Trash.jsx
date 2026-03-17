import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Trash2, RotateCcw, XCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Loader from '../components/Loader';
import { formatBytes } from '../utils/formatters';

const Trash = () => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrash = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/trash');
      if (data.success) {
        setFiles(data.files);
        setFolders(data.folders);
      }
    } catch (error) {
      toast.error('Failed to load trash');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  const handleRestore = async (id, type) => {
    try {
      const { data } = await api.patch(`/trash/${id}/restore?type=${type}`);
      if (data.success) {
        toast.success('Item restored');
        fetchTrash();
      }
    } catch (error) {
      toast.error('Failed to restore');
    }
  };

  const handlePermanentDelete = async (id, type) => {
    if (!window.confirm("This action is permanent and cannot be undone.")) return;
    try {
      const { data } = await api.delete(`/trash/${id}/permanent?type=${type}`);
      if (data.success) {
        toast.success('Deleted forever');
        fetchTrash();
      }
    } catch (error) {
      toast.error('Failed to delete permanently');
    }
  };

  const handleEmptyTrash = async () => {
    if (!window.confirm("Empty trash? All items will be permanently deleted.")) return;
    try {
      const { data } = await api.delete('/trash/empty');
      if (data.success) {
        toast.success('Trash emptied');
        fetchTrash();
      }
    } catch (error) {
      toast.error('Failed to empty trash');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader /></div>;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-red-500">
            <Trash2 size={24} /> Trash
          </h1>
          <p className="text-sm text-gray-500">Items are permanently deleted after 30 days</p>
        </div>
        {(files.length > 0 || folders.length > 0) && (
          <button 
            onClick={handleEmptyTrash}
            className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            Empty Trash
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        {files.length === 0 && folders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-lightBorder dark:bg-darkBorder rounded-full flex items-center justify-center mb-4">
              <Trash2 className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Trash is empty</h3>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1a1a1a] border border-lightBorder dark:border-darkBorder rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-[#111] border-b border-lightBorder dark:border-darkBorder text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Deleted Date</th>
                  <th className="px-6 py-3">Size</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lightBorder dark:divide-darkBorder">
                {folders.map(folder => (
                  <tr key={folder._id} className="text-gray-400 italic">
                    <td className="px-6 py-4 font-medium flex items-center gap-2">
                       <RotateCcw size={16} className="text-gray-400" /> {folder.name} (Folder)
                    </td>
                    <td className="px-6 py-4">{new Date(folder.trashedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">-</td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                         <button onClick={() => handleRestore(folder._id, 'folder')} className="p-1.5 text-gray-500 hover:text-accent rounded" title="Restore"><RotateCcw size={16} /></button>
                         <button onClick={() => handlePermanentDelete(folder._id, 'folder')} className="p-1.5 text-gray-500 hover:text-red-500 rounded" title="Delete Forever"><XCircle size={16} /></button>
                       </div>
                    </td>
                  </tr>
                ))}
                {files.map(file => (
                  <tr key={file._id} className="text-gray-400 italic">
                    <td className="px-6 py-4 font-medium flex items-center gap-2">
                       <RotateCcw size={16} className="text-gray-400" /> {file.filename}
                    </td>
                    <td className="px-6 py-4">{new Date(file.trashedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{formatBytes(file.size)}</td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                         <button onClick={() => handleRestore(file._id, 'file')} className="p-1.5 text-gray-500 hover:text-accent rounded" title="Restore"><RotateCcw size={16} /></button>
                         <button onClick={() => handlePermanentDelete(file._id, 'file')} className="p-1.5 text-gray-500 hover:text-red-500 rounded" title="Delete Forever"><XCircle size={16} /></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trash;
