import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="h-screen flex flex-col bg-lightBg dark:bg-darkBg text-darkBg dark:text-lightBg overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar className="hidden md:flex" />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-lightSurface dark:bg-darkSurface border-l border-lightBorder dark:border-darkBorder">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
