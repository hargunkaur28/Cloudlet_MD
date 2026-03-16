import React from 'react';
import { NavLink } from 'react-router-dom';
import { Folder, Users, Share2, Shield, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ className = '' }) => {
  const { user } = useAuth();

  const navItems = [
    { name: 'My Files', path: '/', icon: <Folder size={18} /> },
    { name: 'Shared with me', path: '/shared', icon: <Users size={18} /> },
    { name: 'Requests', path: '/requests', icon: <Share2 size={18} /> },
  ];

  if (user?.role === 'admin') {
    navItems.push({ name: 'Admin Dashboard', path: '/admin', icon: <Shield size={18} /> });
  }

  return (
    <aside className={`w-64 flex-col bg-lightBg dark:bg-darkBg py-6 px-4 ${className}`}>
      <div className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-lightSurface dark:bg-darkSurface text-accent' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-lightSurface/50 dark:hover:bg-darkSurface hover:text-gray-900 dark:hover:text-gray-200'
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <NavLink
            to="/settings"
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-lightSurface dark:bg-darkSurface text-accent' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-lightSurface/50 dark:hover:bg-darkSurface hover:text-gray-900 dark:hover:text-gray-200'
              }`
            }
          >
            <Settings size={18} />
            Settings
          </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
