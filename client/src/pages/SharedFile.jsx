import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { Lock, Loader2, FileText, Image as ImageIcon, File as FileIcon, Download, Eye, ArrowLeft } from 'lucide-react';
import Loader from '../components/Loader';
import { formatBytes } from '../utils/formatters';

const SharedFile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const { data } = await api.get(`/files/${id}`);
        if (data.success) {
          setFile(data.file);
        }
      } catch (error) {
        if (error.response?.status === 403) {
          setAccessDenied(true);
          setFile(error.response.data.fileDetails);
        } else if (error.response?.status === 401) {
          navigate('/login');
        } else {
          toast.error('File not found or error loading');
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [id, navigate]);

  const handleRequestAccess = async () => {
    setRequesting(true);
    try {
      await api.post(`/files/${id}/request-access`);
      toast.success('Access request sent!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request access');
    } finally {
      setRequesting(false);
    }
  };

  const getIcon = () => {
    if (!file) return <FileIcon size={48} />;
    if (file.fileType === 'pdf') return <FileText size={48} className="text-red-500" />;
    if (file.fileType === 'image') return <ImageIcon size={48} className="text-blue-500" />;
    return <FileIcon size={48} className="text-gray-500" />;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-lightBg dark:bg-darkBg"><Loader /></div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-lightBg dark:bg-darkBg p-4">
      <div className="max-w-xl w-full bg-lightSurface dark:bg-darkSurface border border-lightBorder dark:border-darkBorder rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header/Back button */}
        <div className="p-4 border-b border-lightBorder dark:border-darkBorder flex items-center">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 dark:hover:bg-[#222] rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <span className="ml-2 font-medium text-sm">Back to Drive</span>
        </div>

        <div className="p-8 flex flex-col items-center">
          {accessDenied ? (
            <>
              <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mb-6">
                <Lock size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-2">You need access</h2>
              <p className="text-sm text-gray-500 mb-8 max-w-sm text-center">
                This file is private. Request access from the owner to view or download it.
              </p>
              
              <div className="flex items-center gap-4 bg-white dark:bg-[#111] p-4 rounded-xl border border-lightBorder dark:border-darkBorder w-full mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-accent to-purple-500 flex items-center justify-center text-white font-bold text-xl shrink-0">
                  {file?.owner?.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-sm font-semibold truncate">{file?.filename}</p>
                   <p className="text-xs text-gray-500 truncate">Owner: {file?.owner?.name} ({file?.owner?.email})</p>
                </div>
              </div>

              <button 
                onClick={handleRequestAccess}
                disabled={requesting}
                className="w-full py-3 rounded-xl bg-accent hover:bg-indigo-600 text-white font-semibold transition-all shadow-lg shadow-accent/20 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {requesting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Request Access'}
              </button>
            </>
          ) : (
            <>
              <div className="w-32 h-32 bg-gray-50 dark:bg-[#111] border border-lightBorder dark:border-darkBorder rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                {file?.fileType === 'image' ? (
                  <img src={file.url} alt={file.filename} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                   getIcon()
                )}
              </div>
              
              <h2 className="text-2xl font-bold mb-1 text-center truncate w-full px-4" title={file?.filename}>
                {file?.filename}
              </h2>
              <p className="text-sm text-gray-500 mb-8">
                {formatBytes(file?.size)} • {new Date(file?.createdAt).toLocaleDateString()}
              </p>

              <div className="w-full flex flex-col gap-3">
                <a 
                  href={file?.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-accent hover:bg-indigo-600 text-white font-semibold transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
                >
                  <Eye size={20} /> View File
                </a>
                <a 
                  href={file?.url.replace('/upload/', '/upload/fl_attachment/')} 
                  download={file?.filename}
                  className="w-full py-3 rounded-xl border border-lightBorder dark:border-darkBorder bg-white dark:bg-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-[#222] font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Download size={20} /> Download
                </a>
              </div>

              <div className="mt-8 pt-6 border-t border-lightBorder dark:border-darkBorder w-full text-center">
                 <p className="text-xs text-gray-400">
                   Shared by <span className="text-gray-600 dark:text-gray-300 font-medium">{file?.owner?.name}</span>
                 </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedFile;
