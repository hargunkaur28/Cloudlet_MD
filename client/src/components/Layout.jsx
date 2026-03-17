import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f6f7fb] dark:bg-darkBg text-darkBg dark:text-lightBg">
      <Navbar />
      <div className="flex flex-1 min-h-[calc(100vh-80px)]">
        <Sidebar className="hidden md:flex" />
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
