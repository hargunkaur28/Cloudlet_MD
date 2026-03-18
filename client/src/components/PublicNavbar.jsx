import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import BrandLogo from './BrandLogo';

const PublicNavbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-xl border-b border-lightBorder dark:border-darkBorder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <BrandLogo />
          <span className="text-2xl font-extrabold tracking-tight text-accent">Cloudlet</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-accent transition-colors">Home</Link>
          <Link to="/security" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-accent transition-colors">Security</Link>
          <Link to="/contact" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-accent transition-colors">Contact</Link>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-lightSurface dark:bg-darkSurface border border-lightBorder dark:border-darkBorder text-gray-500 hover:text-accent transition-all cursor-pointer"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="hidden sm:flex items-center gap-4">
            <Link 
              to="/login" 
              className="px-5 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-accent transition-colors"
            >
              Log in
            </Link>
            <Link 
              to="/signup" 
              className="px-6 py-2.5 bg-accent hover:bg-indigo-600 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-accent/20 hover:shadow-accent/30 hover:-translate-y-0.5"
            >
              Sign up free
            </Link>
          </div>

          {/* Mobile Sign Up (only show one button for space) */}
          <div className="sm:hidden">
            <Link 
              to="/signup" 
              className="px-4 py-2 bg-accent text-white text-xs font-bold rounded-lg"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
