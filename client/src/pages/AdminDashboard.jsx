import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { Trash2, Users, FileText, LayoutDashboard, Loader2 } from 'lucide-react';
import { formatBytes } from '../utils/formatters';
import Loader from '../components/Loader';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('files');
  const [users, setUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [{ data: usersData }, { data: filesData }] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/files')
      ]);
      if (usersData.success) setUsers(usersData.users);
      if (filesData.success) setFiles(filesData.files);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file universally?")) return;
    try {
      const { data } = await api.delete(`/admin/files/${id}`);
      if (data.success) {
        toast.success('File deleted');
        setFiles(prev => prev.filter(f => f._id !== id));
      }
    } catch (error) {
      toast.error('Failed to delete file');
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (name === 'Admin' || id === users.find(u => u.role === 'admin')?._id) {
       return toast.error("Cannot delete admin");
    }
    if (!window.confirm(`Are you sure you want to delete user "${name}" and all their files?`)) return;
    
    try {
      const { data } = await api.delete(`/admin/users/${id}`);
      if (data.success) {
        toast.success('User deleted');
        setUsers(prev => prev.filter(u => u._id !== id));
        // Also remove their files from the state if any
        setFiles(prev => prev.filter(f => f.owner._id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const totalStorage = files.reduce((acc, file) => acc + file.size, 0);

  if (loading) return <div className="h-full flex items-center justify-center"><Loader /></div>;

  return (
    <div className="flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">System-wide file and user management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-[#1a1a1a] border border-lightBorder dark:border-darkBorder rounded-xl p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-full flex items-center justify-center mb-3">
            <Users size={24} />
          </div>
          <h3 className="text-3xl font-bold tracking-tight">{users.length}</h3>
          <p className="text-sm text-gray-500 mt-1 font-medium">Total Users</p>
        </div>
        <div className="bg-white dark:bg-[#1a1a1a] border border-lightBorder dark:border-darkBorder rounded-xl p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-accent rounded-full flex items-center justify-center mb-3">
            <FileText size={24} />
          </div>
          <h3 className="text-3xl font-bold tracking-tight">{files.length}</h3>
          <p className="text-sm text-gray-500 mt-1 font-medium">Total Files</p>
        </div>
        <div className="bg-white dark:bg-[#1a1a1a] border border-lightBorder dark:border-darkBorder rounded-xl p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center mb-3">
            <LayoutDashboard size={24} />
          </div>
          <h3 className="text-3xl font-bold tracking-tight">{formatBytes(totalStorage)}</h3>
          <p className="text-sm text-gray-500 mt-1 font-medium">Storage Used</p>
        </div>
      </div>

      <div className="flex border-b border-lightBorder dark:border-darkBorder mb-6">
        <button 
          onClick={() => setActiveTab('files')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'files' ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
        >
          All Files
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'users' ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
        >
          All Users
        </button>
      </div>

      <div className="flex-1">
        <div className="bg-white dark:bg-[#1a1a1a] border border-lightBorder dark:border-darkBorder rounded-xl overflow-hidden min-w-[600px] no-scrollbar">
          {activeTab === 'files' ? (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-[#111] border-b border-lightBorder dark:border-darkBorder text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-3">File Name</th>
                  <th className="px-6 py-3">Owner</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Size</th>
                  <th className="px-6 py-3">Upload Date</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lightBorder dark:divide-darkBorder">
                {files.map(file => (
                  <tr key={file._id} className="hover:bg-gray-50 dark:hover:bg-[#222] transition-colors">
                    <td className="px-6 py-3 font-medium text-gray-900 dark:text-gray-100 truncate max-w-[200px]" title={file.filename}>{file.filename}</td>
                    <td className="px-6 py-3 text-gray-600 dark:text-gray-400">
                      <div>{file.owner?.name}</div>
                      <div className="text-xs">{file.owner?.email}</div>
                    </td>
                    <td className="px-6 py-3 text-gray-600 dark:text-gray-400">{file.fileType}</td>
                    <td className="px-6 py-3 text-gray-600 dark:text-gray-400">{formatBytes(file.size)}</td>
                    <td className="px-6 py-3 text-gray-600 dark:text-gray-400">{new Date(file.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-3 text-right">
                      <button 
                        onClick={() => handleDeleteFile(file._id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                        title="Delete globally"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-sm">
               <thead className="bg-gray-50 dark:bg-[#111] border-b border-lightBorder dark:border-darkBorder text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Files Owned</th>
                  <th className="px-6 py-3">Join Date</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lightBorder dark:divide-darkBorder">
                {users.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-[#222] transition-colors">
                    <td className="px-6 py-3 font-medium text-gray-900 dark:text-gray-100">{user.name}</td>
                    <td className="px-6 py-3 text-gray-600 dark:text-gray-400">{user.email}</td>
                    <td className="px-6 py-3 text-gray-600 dark:text-gray-400">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-600 dark:text-gray-400">{user.fileCount}</td>
                    <td className="px-6 py-3 text-gray-600 dark:text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-3 text-right">
                      {user.role !== 'admin' && (
                        <button 
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          className="text-red-500 hover:text-red-700 p-1 rounded transition-colors cursor-pointer"
                          title="Delete user and all their files"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
