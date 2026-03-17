import React, { useState } from 'react';
import { X, Copy, Check, UserPlus, Link, Mail } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

const ShareModal = ({ item, type = 'file', onClose }) => {
  const [activeTab, setActiveTab] = useState('people');
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('view');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareLink = `${window.location.origin}/${type}/${item._id}`;
  const itemName = type === 'file' ? item.filename : item.name;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Link copied');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const handleShareEmail = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const endpoint = type === 'file' ? `/files/${item._id}/share-email` : `/folders/${item._id}/share-email`;
      const { data } = await api.post(endpoint, { email, permission });
      if (data.success) {
        toast.success(data.message);
        setEmail('');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to share');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1a1a1a] border border-lightBorder dark:border-darkBorder rounded-xl shadow-xl w-full max-w-md overflow-hidden" 
           onClick={(e) => e.stopPropagation()}>
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-lightBorder dark:border-darkBorder">
          <h3 className="text-lg font-semibold">Share "{itemName}"</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-lightBorder dark:border-darkBorder">
          <button 
            onClick={() => setActiveTab('people')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'people' ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <Mail size={16} /> People
          </button>
          <button 
            onClick={() => setActiveTab('link')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'link' ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <Link size={16} /> Link
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'people' ? (
            <form onSubmit={handleShareEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter user email..."
                  required
                  className="w-full bg-gray-50 dark:bg-[#222] border border-lightBorder dark:border-darkBorder rounded-md py-2.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Permission</label>
                <select 
                  value={permission}
                  onChange={(e) => setPermission(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#222] border border-lightBorder dark:border-darkBorder rounded-md py-2.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="view">Can view</option>
                  <option value="edit">Can edit</option>
                </select>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-indigo-600 text-white py-2.5 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                {loading ? 'Sharing...' : <><UserPlus size={16} /> Share with person</>}
              </button>
            </form>
          ) : (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Anyone with this link can request access to this {type}.
              </p>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={shareLink}
                  className="flex-1 bg-gray-50 dark:bg-[#222] border border-lightBorder dark:border-darkBorder rounded-md py-2 px-3 text-sm focus:outline-none text-gray-500 truncate"
                />
                <button 
                  onClick={handleCopy}
                  className="p-2 bg-lightSurface dark:bg-darkSurface text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#333] rounded-md transition-colors"
                >
                  {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
