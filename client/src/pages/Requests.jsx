import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import Loader from '../components/Loader';
import { Check, X } from 'lucide-react';

const Requests = () => {
  const [filesWithRequests, setFilesWithRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/files');
      if (data.success) {
        // Filter out files that don't have pending requests, or map to a flat list
        const pending = [];
        data.files.forEach(file => {
          if (file.accessRequests && file.accessRequests.length > 0) {
            file.accessRequests.forEach(req => {
              if (req.status === 'pending') {
                // Populate user info manually if not populated by backend, assuming backend populated it? 
                // Ah, backend getFiles didn't populate accessRequests.user!
                // Let's just create an endpoint or modify backend. 
                // Actually, backend getFiles didn't populate it. I will need to update backend getFiles to populate accessRequests.user
                pending.push({
                  fileId: file._id,
                  filename: file.filename,
                  request: req
                });
              }
            });
          }
        });
        setFilesWithRequests(pending);
      }
    } catch (error) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (fileId, userId, status) => {
    try {
      const { data } = await api.patch(`/files/${fileId}/grant-access`, {
        userId,
        status,
        permission: 'view'
      });
      if (data.success) {
        toast.success(`Request ${status}`);
        setFilesWithRequests(prev => prev.filter(r => !(r.fileId === fileId && r.request.user._id === userId)));
      }
    } catch (error) {
      toast.error(`Failed to ${status} request`);
    }
  };

  if (loading) return <div className="h-full flex items-center justify-center"><Loader /></div>;

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Access Requests</h1>
        <p className="text-sm text-gray-500 mt-1">Manage who can view your files</p>
      </div>

      {filesWithRequests.length === 0 ? (
        <div className="bg-white dark:bg-[#1a1a1a] border border-lightBorder dark:border-darkBorder rounded-xl p-8 text-center flex-1 w-full max-h-64 flex flex-col justify-center items-center">
          <div className="w-16 h-16 bg-gray-50 dark:bg-[#111] rounded-full flex items-center justify-center mb-4 text-gray-400">
             <Check size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">You're all caught up!</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm">
            No pending access requests for any of your files.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1a1a1a] border border-lightBorder dark:border-darkBorder rounded-xl overflow-hidden w-full">
          <ul className="divide-y divide-lightBorder dark:divide-darkBorder">
            {filesWithRequests.map((item, idx) => (
              <li key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#222] transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    User <span className="text-accent">{item.request.user.name || item.request.user}</span> wants to view <span className="font-semibold">{item.filename}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Requested on {new Date(item.request.requestedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleAction(item.fileId, item.request.user._id || item.request.user, 'rejected')}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    title="Reject"
                  >
                    <X size={18} />
                  </button>
                  <button 
                    onClick={() => handleAction(item.fileId, item.request.user._id || item.request.user, 'approved')}
                    className="px-4 py-2 bg-accent hover:bg-indigo-600 text-white rounded-md text-sm font-medium transition-colors"
                  >
                    Approve
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Requests;
