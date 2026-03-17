import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Folder, Users, Shield, Settings, Star, Trash2, 
  Clock, ChevronRight, HardDrive, LayoutGrid, Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { formatBytes } from '../utils/formatters';

const Sidebar = ({ className = '' }) => {
  const { user } = useAuth();
  const [recentFiles, setRecentFiles] = useState([]);
  const [topFolders, setTopFolders] = useState([]);
  const [starredFolders, setStarredFolders] = useState([]);
  const [storage, setStorage] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);
  const [dragOverFolder, setDragOverFolder] = useState(null);

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const [recentRes, foldersRes, starredRes, storageRes] = await Promise.all([
          api.get('/files/recent'),
          api.get('/folders'), // Get root folders
          api.get('/files/starred'), // Get starred
          api.get('/files/storage')
        ]);
        if (recentRes.data.success) setRecentFiles(recentRes.data.files.slice(0, 5));
        if (foldersRes.data.success) setTopFolders(foldersRes.data.folders.slice(0, 5));
        if (starredRes.data.success) setStarredFolders(starredRes.data.folders.slice(0, 5));
        if (storageRes.data.success) setStorage(storageRes.data);
      } catch (error) {
        console.error("Failed to load sidebar data");
      }
    };

    if (user) {
      fetchSidebarData();
      window.addEventListener('drive-update', fetchSidebarData);
    }
    
    return () => window.removeEventListener('drive-update', fetchSidebarData);
  }, [user]);

  const driveNav = [
    { name: 'My Drive', path: '/', icon: <HardDrive size={18} /> },
    { name: 'Recent', path: '/recent', icon: <Clock size={14} />, type: 'recent' },
    { name: 'Starred', path: '/starred', icon: <Star size={14} />, type: 'star' },
  ];

  const shareNav = [
    { name: 'Shared with me', path: '/shared', icon: <Users size={14} /> },
    { name: 'Trash', path: '/trash', icon: <Trash2 size={14} />, type: 'trash' },
  ];

  return (
    <aside className={`w-72 flex flex-col bg-white dark:bg-[#111] border-r border-lightBorder dark:border-darkBorder pt-6 transition-all duration-300 ${className}`}>
      {user?.role === 'admin' && (
        <div className="mb-0 overflow-hidden transition-all duration-300">
          <div className="mb-8 font-medium">
            <h2 className="px-5 text-[11px] font-bold text-gray-400 uppercase tracking-[0.14em] mb-3">Admin Hub</h2>
            <div className="space-y-1 px-4">
              <NavLink
                to="/admin"
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm transition-all duration-200 ${
                    isActive 
                      ? 'bg-accent/10 text-accent font-semibold' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-darkSurface hover:text-gray-900 dark:hover:text-gray-200'
                  }`
                }
              >
                <div className="text-accent"><Shield size={18} /></div>
                Admin Dashboard
              </NavLink>
              <NavLink
                to="/settings"
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm transition-all duration-200 ${
                    isActive 
                      ? 'bg-accent/10 text-accent font-semibold' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-darkSurface hover:text-gray-900 dark:hover:text-gray-200'
                  }`
                }
              >
                <div className="text-accent"><Settings size={18} /></div>
                Settings
              </NavLink>
            </div>
          </div>
        </div>
      )}
      {user?.role !== 'admin' && (
        <div className="mb-4 font-medium">
          <h2 className="px-5 text-[11px] font-bold text-gray-400 uppercase tracking-[0.14em] mb-3">Navigation</h2>
          <div className="space-y-1 px-4">
            {driveNav.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/'}
                onDragOver={(e) => {
                  if (item.type === 'star') {
                    e.preventDefault();
                    setDragOverItem(item.name);
                  }
                }}
                onDragLeave={() => setDragOverItem(null)}
                onDrop={async (e) => {
                  if (item.type === 'star') {
                    e.preventDefault();
                    setDragOverItem(null);
                    const itemId = e.dataTransfer.getData('itemId');
                    const itemType = e.dataTransfer.getData('itemType');
                    if (itemId) {
                      try {
                        const url = itemType === 'folder' ? `/folders/${itemId}/star` : `/files/${itemId}/star`;
                        await api.patch(url);
                        toast.success('Added to Starred');
                        window.dispatchEvent(new CustomEvent('drive-update'));
                      } catch (err) {
                        toast.error('Failed to star item');
                      }
                    }
                  }
                }}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm transition-all duration-200 ${
                    isActive 
                      ? 'bg-accent/10 text-accent font-semibold' 
                      : dragOverItem === item.name
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 scale-105'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-darkSurface hover:text-gray-900 dark:hover:text-gray-200'
                  }`
                }
              >
                <div className={item.name === 'Starred' ? 'text-yellow-500' : 'text-indigo-500'}>
                  {item.icon}
                </div>
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {user?.role !== 'admin' && (
        <div className="mb-0 overflow-hidden transition-all duration-300">
          <div className="mb-8">
            <h2 className="px-5 text-[11px] font-bold text-gray-400 uppercase tracking-[0.14em] mb-3">Shared</h2>
            <div className="space-y-1 px-4">
              {shareNav.map((item) => (
                item.name !== 'Trash' && (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm transition-all duration-200 ${
                        isActive 
                          ? 'bg-accent/10 text-accent font-semibold' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-darkSurface hover:text-gray-900 dark:hover:text-gray-200'
                      }`
                    }
                  >
                    <div className="text-blue-500">{item.icon}</div>
                    {item.name}
                  </NavLink>
                )
              ))}
            </div>
          </div>

          {starredFolders.length > 0 && (
            <div className="mb-8 animate-in slide-in-from-left duration-300">
              <h2 className="px-5 text-[11px] font-bold text-gray-400 uppercase tracking-[0.14em] mb-3 flex items-center gap-2">
                <Star size={12} className="text-yellow-500" fill="currentColor" /> Starred Folders
              </h2>
              <div className="space-y-1 px-4">
                {starredFolders.map((folder) => (
                  <NavLink
                    key={folder._id}
                    to={`/folder/${folder._id}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverFolder(folder._id);
                    }}
                    onDragLeave={() => setDragOverFolder(null)}
                    onDrop={async (e) => {
                      e.preventDefault();
                      setDragOverFolder(null);
                      const itemId = e.dataTransfer.getData('itemId');
                      const itemType = e.dataTransfer.getData('itemType');
                      if (itemId && itemId !== folder._id) {
                        try {
                          const url = itemType === 'folder' ? `/folders/${itemId}/move` : `/files/${itemId}/move`;
                          const { data } = await api.patch(url, { targetFolderId: folder._id });
                          if (data.success) {
                            toast.success('Moved to folder');
                            window.dispatchEvent(new CustomEvent('drive-update'));
                          }
                        } catch (err) {
                          toast.error('Move failed');
                        }
                      }
                    }}
                    className={`flex items-center gap-3 px-4 py-2 rounded-2xl text-sm transition-all group ${
                      dragOverFolder === folder._id 
                        ? 'bg-accent/20 text-accent ring-1 ring-accent/30 translate-x-1' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-lightSurface/50 dark:hover:bg-darkSurface hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    <Folder 
                      size={16} 
                      color={folder.color || '#4f46e5'} 
                      fill={folder.color || '#4f46e5'} 
                      className={`transition-all ${dragOverFolder === folder._id ? 'scale-110 opacity-100' : 'opacity-70 group-hover:opacity-100'}`} 
                    />
                    <span className="truncate">{folder.name}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          )}

          {topFolders.length > 0 && (
            <div className="mb-8">
              <h2 className="px-5 text-[11px] font-bold text-gray-400 uppercase tracking-[0.14em] mb-3">Folders</h2>
              <div className="space-y-1 px-4">
                {topFolders.map((folder) => (
                  <NavLink
                    key={folder._id}
                    to={`/folder/${folder._id}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverFolder(folder._id);
                    }}
                    onDragLeave={() => setDragOverFolder(null)}
                    onDrop={async (e) => {
                      e.preventDefault();
                      setDragOverFolder(null);
                      const itemId = e.dataTransfer.getData('itemId');
                      const itemType = e.dataTransfer.getData('itemType');
                      if (itemId && itemId !== folder._id) {
                        try {
                          const url = itemType === 'folder' ? `/folders/${itemId}/move` : `/files/${itemId}/move`;
                          const { data } = await api.patch(url, { targetFolderId: folder._id });
                          if (data.success) {
                            toast.success('Moved to folder');
                            window.dispatchEvent(new CustomEvent('drive-update'));
                          }
                        } catch (err) {
                          toast.error('Move failed');
                        }
                      }
                    }}
                    className={`flex items-center gap-3 px-4 py-2 rounded-2xl text-sm transition-all group ${
                      dragOverFolder === folder._id 
                        ? 'bg-accent/20 text-accent ring-1 ring-accent/30 translate-x-1' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-lightSurface/50 dark:hover:bg-darkSurface hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    <Folder 
                      size={16} 
                      color={folder.color || '#4f46e5'} 
                      fill={folder.color || '#4f46e5'} 
                      className={`transition-all ${dragOverFolder === folder._id ? 'scale-110 opacity-100' : 'opacity-70 group-hover:opacity-100'}`} 
                    />
                    <span className="truncate">{folder.name}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="px-5 text-[11px] font-bold text-gray-400 uppercase tracking-[0.14em] mb-3">System</h2>
            <div className="space-y-1 px-4">
              {shareNav.map((item) => (
                item.name === 'Trash' && (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverItem(item.name);
                    }}
                    onDragLeave={() => setDragOverItem(null)}
                    onDrop={async (e) => {
                      e.preventDefault();
                      setDragOverItem(null);
                      const itemId = e.dataTransfer.getData('itemId');
                      const itemType = e.dataTransfer.getData('itemType');
                      if (itemId) {
                        try {
                          const url = itemType === 'folder' ? `/folders/${itemId}` : `/files/${itemId}`;
                          await api.delete(url);
                          toast.success('Moved to Trash');
                          window.dispatchEvent(new CustomEvent('drive-update'));
                        } catch (err) {
                          toast.error('Failed to trash item');
                        }
                      }
                    }}
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm transition-all duration-200 ${
                        isActive 
                          ? 'bg-red-50 dark:bg-red-900/10 text-red-500 font-bold' 
                          : dragOverItem === item.name
                          ? 'bg-red-50 dark:bg-red-900/20 text-red-600 scale-105 ring-1 ring-red-200'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600'
                      }`
                    }
                  >
                    <div className={dragOverItem === item.name ? 'text-red-600' : ''}>{item.icon}</div>
                    {item.name}
                  </NavLink>
                )
              ))}
            </div>
          </div>
        </div>
      )}

      {storage && user?.role !== 'admin' && (
        <div className="mt-auto px-5 pb-5 transition-all duration-300">
          <div className="rounded-2xl border border-lightBorder dark:border-darkBorder bg-[#fbfbfd] dark:bg-darkSurface p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">Storage</div>
              <Database size={14} className="text-gray-400" />
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 mb-2 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  parseFloat(storage.percentage) > 90 ? 'bg-red-500' : 
                  parseFloat(storage.percentage) > 70 ? 'bg-yellow-500' : 'bg-accent'
                }`}
                style={{ width: `${storage.percentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              {formatBytes(storage.used)} of {formatBytes(storage.limit)} used
            </p>
          </div>
        </div>
      )}

      {user?.role !== 'admin' && (
        <div className="pt-2 border-t border-lightBorder dark:border-darkBorder px-4 pb-5">
          <NavLink
            to="/settings"
            className="flex items-center gap-3 px-4 py-2 rounded-2xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-darkSurface transition-colors"
          >
            <Settings size={18} />
            Settings
          </NavLink>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
