import { useState, useCallback } from 'react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

export const useFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/files');
      if (data.success) setFiles(data.files);
    } catch (error) {
      toast.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (data.success) {
        setFiles(prev => [data.file, ...prev]);
        toast.success('File uploaded');
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
      return false;
    }
  };

  const deleteFile = async (id) => {
    try {
      await api.delete(`/files/${id}`);
      setFiles(prev => prev.filter(f => f._id !== id));
      toast.success('File deleted');
    } catch (error) {
      toast.error('Failed to delete file');
    }
  };

  return {
    files,
    loading,
    fetchFiles,
    uploadFile,
    deleteFile
  };
};
