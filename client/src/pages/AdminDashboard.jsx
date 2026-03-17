import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { Trash2, Users, FileText, LayoutDashboard, Loader2, Edit, Search, Filter, ShieldCheck, Activity, Database } from 'lucide-react';
import { formatBytes } from '../utils/formatters';
import Loader from '../components/Loader';
import EditFileModal from '../components/EditFileModal';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('files');
  const [users, setUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFile, setEditingFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleUpdateFile = async (id, formData) => {
    try {
      const { data } = await api.patch(`/files/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (data.success) {
        setFiles(prev => prev.map(f => f._id === id ? data.file : f));
        toast.success('File updated by admin');
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
      return false;
    }
  };

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
        setFiles(prev => prev.filter(f => f.owner?._id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const totalStorage = files.reduce((acc, file) => acc + file.size, 0);

  const filteredFiles = files.filter(f => 
    f.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.owner?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.owner?.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="h-full flex items-center justify-center"><Loader /></div>;

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-accent/10 rounded-lg text-accent">
              <ShieldCheck size={20} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-accent italic">System Control</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Manage enterprise infrastructure and user ecosystem</p>
        </div>
        
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent transition-colors" size={18} />
          <input 
            type="text" 
            placeholder={activeTab === 'files' ? "Search all files..." : "Search all users..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-[#111] border border-lightBorder dark:border-darkBorder rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[0.05] rounded-[2rem] p-8 relative overflow-hidden transition-all hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
          <div className="relative">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <Users size={28} />
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white">{users.length}</h3>
              <span className="text-blue-500 text-xs font-bold bg-blue-500/10 px-2 py-0.5 rounded-full">+12%</span>
            </div>
            <p className="text-sm text-gray-500 mt-2 font-bold uppercase tracking-widest opacity-60">Verified Users</p>
          </div>
        </div>

        <div className="group bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[0.05] rounded-[2rem] p-8 relative overflow-hidden transition-all hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
          <div className="relative">
            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 text-accent rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <FileText size={28} />
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white">{files.length}</h3>
              <span className="text-indigo-500 text-xs font-bold bg-indigo-500/10 px-2 py-0.5 rounded-full">+5%</span>
            </div>
            <p className="text-sm text-gray-500 mt-2 font-bold uppercase tracking-widest opacity-60">Stored Artifacts</p>
          </div>
        </div>

        <div className="group bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[0.05] rounded-[2rem] p-8 relative overflow-hidden transition-all hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
          <div className="relative">
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <Database size={28} />
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white">{formatBytes(totalStorage).split(' ')[0]}</h3>
              <span className="text-2xl font-bold ml-1 text-gray-400">{formatBytes(totalStorage).split(' ')[1]}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2 font-bold uppercase tracking-widest opacity-60">Global Footprint</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[0.03] rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/[0.02]">
        <div className="px-8 pt-6 border-b border-gray-100 dark:border-white/[0.05] flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.01]">
          <div className="flex gap-8">
            <button 
              onClick={() => setActiveTab('files')}
              className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'files' ? 'text-accent' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
            >
              System Files
              {activeTab === 'files' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-t-full"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'users' ? 'text-accent' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
            >
              User Registry
              {activeTab === 'users' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-t-full"></div>}
            </button>
          </div>
          <div className="flex items-center gap-2 pb-4">
            <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <Activity size={18} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="p-4 overflow-x-auto no-scrollbar">
          {activeTab === 'files' ? (
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-black">
                  <th className="px-6 py-5">Asset Descriptor</th>
                  <th className="px-6 py-5">Custodian</th>
                  <th className="px-6 py-5">Blueprint</th>
                  <th className="px-6 py-5">Magnitude</th>
                  <th className="px-6 py-5">Temporal Entry</th>
                  <th className="px-6 py-5 text-right">Directives</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/[0.03]">
                {filteredFiles.map(file => (
                  <tr key={file._id} className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                          <FileText size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate max-w-[200px]" title={file.filename}>{file.filename}</span>
                          <span className="text-[10px] text-gray-400 font-medium">#{file._id.slice(-6)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-[10px] font-bold">
                          {file.owner?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col leading-tight">
                          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{file.owner?.name}</span>
                          <span className="text-[10px] text-gray-400">{file.owner?.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{file.fileType}</span>
                    </td>
                    <td className="px-6 py-5 font-mono text-xs text-gray-600 dark:text-gray-400">{formatBytes(file.size)}</td>
                    <td className="px-6 py-5 text-xs text-gray-500 font-medium">{new Date(file.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => setEditingFile(file)}
                          className="w-9 h-9 flex items-center justify-center text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all"
                          title="Modify Record"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteFile(file._id)}
                          className="w-9 h-9 flex items-center justify-center text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                          title="Terminate Record"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-black">
                  <th className="px-6 py-5">Identity</th>
                  <th className="px-6 py-5">Credentials</th>
                  <th className="px-6 py-5">Authority</th>
                  <th className="px-6 py-5">Asset Count</th>
                  <th className="px-6 py-5">Alliance Date</th>
                  <th className="px-6 py-5 text-right">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/[0.03]">
                {filteredUsers.map(user => (
                  <tr key={user._id} className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-black text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-xs font-medium text-gray-500 dark:text-gray-400">{user.email}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-500 ring-1 ring-purple-500/20' : 'bg-gray-500/10 text-gray-500'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-accent" style={{ width: `${Math.min(user.fileCount * 10, 100)}%` }}></div>
                        </div>
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{user.fileCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-xs text-gray-500 font-medium">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-5 text-right">
                      {user.role !== 'admin' && (
                        <button 
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          className="w-10 h-10 inline-flex items-center justify-center text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all"
                          title="Revoke Access"
                        >
                          <Trash2 size={18} />
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
      
      {editingFile && (
        <EditFileModal 
          file={editingFile} 
          onClose={() => setEditingFile(null)} 
          onUpdate={handleUpdateFile} 
        />
      )}
    </div>
  );
};

export default AdminDashboard;
