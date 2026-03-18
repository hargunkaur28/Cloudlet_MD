import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Set default sidebar state based on user role
  useEffect(() => {
    if (user?.role === 'admin') {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [user?.role]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f7fb] dark:bg-darkBg text-darkBg dark:text-lightBg relative overflow-x-hidden">
      <Navbar onToggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
      <div className="flex flex-1 min-h-[calc(100vh-80px)]">
        {/* Mobile Backdrop */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300"
            onClick={closeSidebar}
          ></div>
        )}
        
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar}
          className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} fixed md:relative inset-y-0 left-0 z-50 md:z-auto transition-all duration-300 ease-in-out md:flex`} 
        />
        
        <main className="flex-1 bg-transparent">
          <div className="w-full max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
