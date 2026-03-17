import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sun, Moon, LogOut, Bell, Menu, Check, Inbox } from 'lucide-react';
import BrandLogo from './BrandLogo';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    markAsRead(notification._id);
    setShowNotifications(false);
    
    if (notification.type === 'access_request') {
      navigate('/requests');
    } else if (notification.type === 'access_approved') {
      navigate('/shared');
    }
  };

  return (
    <nav className="h-16 border-b border-lightBorder dark:border-darkBorder bg-lightBg dark:bg-darkBg flex items-center justify-between px-4 md:px-8 relative z-50">
      <div className="flex items-center gap-4">
        {user && <button className="md:hidden text-gray-500 hover:text-accent transition-colors cursor-pointer"><Menu size={20} /></button>}
        <Link to="/" className="text-xl font-bold tracking-tight text-accent flex items-center gap-2">
          <BrandLogo />
          Cloudlet
        </Link>
      </div>

      {user && (
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search files..."
            className="w-full bg-lightSurface dark:bg-darkSurface border border-lightBorder dark:border-darkBorder rounded-md py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      )}

      <div className="flex items-center gap-2 md:gap-4">
        <button onClick={toggleTheme} className="p-2 rounded-md hover:bg-lightSurface dark:hover:bg-darkSurface transition-colors cursor-pointer">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        
        {user ? (
          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  // Hide badge when opening
                  if (!showNotifications) markAllAsRead();
                }}
                className="p-2 rounded-md hover:bg-lightSurface dark:hover:bg-darkSurface transition-colors relative cursor-pointer"
              >
                <Bell size={18} />
                {(unreadCount > 0 && !showNotifications) && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full pointer-events-none">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-darkSurface border border-lightBorder dark:border-darkBorder rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                  <div className="p-4 border-b border-lightBorder dark:border-darkBorder flex items-center justify-between bg-gray-50/50 dark:bg-[#111]/50">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-[10px] text-accent hover:underline font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center bg-white dark:bg-darkSurface">
                        <div className="w-12 h-12 bg-gray-50 dark:bg-[#111] rounded-full flex items-center justify-center mx-auto mb-3">
                          <Inbox size={20} className="text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500">No notifications yet</p>
                      </div>
                    ) : (
                      <ul className="divide-y divide-lightBorder dark:divide-darkBorder">
                        {notifications.map((n) => (
                          <li 
                            key={n._id} 
                            onClick={() => handleNotificationClick(n)}
                            className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#222] transition-colors relative ${!n.isRead ? 'bg-accent/5' : ''}`}
                          >
                            {!n.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent"></div>}
                            <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                                {n.type === 'access_request' ? <Bell size={14} /> : <Check size={14} />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs ${!n.isRead ? 'font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
                                  {n.message}
                                </p>
                                <p className="text-[10px] text-gray-400 mt-1">
                                  {new Date(n.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 md:gap-2">
              <div className="hidden sm:flex w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-purple-500 items-center justify-center text-white font-medium text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button onClick={logout} className="p-2 text-gray-500 hover:text-red-500 transition-colors cursor-pointer" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        ) : (
          <Link to="/login" className="px-4 py-2 bg-accent hover:bg-indigo-600 text-white rounded-md text-sm font-medium transition-colors">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
