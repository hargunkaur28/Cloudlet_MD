import { useState, useCallback, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

export const useDrive = (initialFolderId = null) => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [folderId, setFolderId] = useState(initialFolderId);

  const fetchContents = useCallback(async () => {
    setLoading(true);
    try {
      const url = folderId ? `/folders/${folderId}` : '/folders';
      const { data } = await api.get(url);
      
      if (data.success) {
        if (folderId) {
          setFiles(data.files);
          setFolders(data.subfolders);
          setCurrentFolder(data.folder);
        } else {
          setFiles(data.files);
          setFolders(data.folders);
          setCurrentFolder(null);
        }
      }
    } catch (error) {
      toast.error('Failed to load drive contents');
    } finally {
      setLoading(false);
    }
  }, [folderId]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  const createFolder = async (name, color) => {
    try {
      const { data } = await api.post('/folders', { name, color, parent: folderId });
      if (data.success) {
        setFolders(prev => [data.folder, ...prev]);
        toast.success('Folder created');
        window.dispatchEvent(new CustomEvent('drive-update'));
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create folder');
      return false;
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    if (folderId) formData.append('folderId', folderId);

    try {
      const { data } = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (data.success) {
        setFiles(prev => [data.file, ...prev]);
        toast.success('File uploaded');
        window.dispatchEvent(new CustomEvent('drive-update'));
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
      return false;
    }
  };

  const deleteItem = async (id, type) => {
    try {
      if (type === 'folder') {
        await api.delete(`/folders/${id}`);
        setFolders(prev => prev.filter(f => f._id !== id));
      } else {
        await api.delete(`/files/${id}`);
        setFiles(prev => prev.filter(f => f._id !== id));
      }
      toast.success('Moved to trash');
    } catch (error) {
      toast.error('Movement to trash failed');
    }
  };

  const toggleStar = async (id, type) => {
    try {
      const url = type === 'folder' ? `/folders/${id}/star` : `/files/${id}/star`;
      const { data } = await api.patch(url);
      if (data.success) {
        if (type === 'folder') {
          setFolders(prev => prev.map(f => f._id === id ? data.folder : f));
        } else {
          setFiles(prev => prev.map(f => f._id === id ? data.file : f));
        }
        toast.success(data.folder?.isStarred || data.file?.isStarred ? 'Starred' : 'Unstarred');
      }
    } catch (error) {
      toast.error('Failed to update star');
    }
  };

  const updateFile = async (id, formData) => {
    try {
      const { data } = await api.patch(`/files/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (data.success) {
        setFiles(prev => prev.map(f => f._id === id ? data.file : f));
        toast.success('File updated');
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
      return false;
    }
  };

  const moveItem = async (id, type, targetFolderId) => {
    try {
      const url = type === 'folder' ? `/folders/${id}/move` : `/files/${id}/move`;
      const { data } = await api.patch(url, { targetFolderId });
      if (data.success) {
        if (type === 'folder') {
          setFolders(prev => prev.filter(f => f._id !== id));
        } else {
          setFiles(prev => prev.filter(f => f._id !== id));
        }
        toast.success('Item moved');
        window.dispatchEvent(new CustomEvent('drive-update'));
        return true;
      }
    } catch (error) {
      toast.error('Failed to move item');
      return false;
    }
  };

  return {
    files,
    folders,
    currentFolder,
    loading,
    folderId,
    setFolderId,
    createFolder,
    uploadFile,
    deleteItem,
    toggleStar,
    updateFile,
    moveItem,
    refresh: fetchContents
  };
};
