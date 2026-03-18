import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Menu, X, ArrowRight } from 'lucide-react';
import BrandLogo from './BrandLogo';

const PublicNavbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Security', path: '/security' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-xl border-b border-lightBorder dark:border-darkBorder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 z-50">
            <BrandLogo className="w-9 h-9" />
            <span className="text-2xl font-extrabold tracking-tight text-accent">Cloudlet</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-accent transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
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

            {/* Mobile Menu Toggle */}
            <button 
              onClick={toggleMenu}
              className="md:hidden p-2.5 rounded-xl bg-lightSurface dark:bg-darkSurface border border-lightBorder dark:border-darkBorder text-gray-500 hover:text-accent transition-all z-50"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Ultra Robust & Outside Nav */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[9999] bg-white dark:bg-[#0a0a0a] flex flex-col md:hidden animate-in fade-in duration-200 h-full w-full">
          {/* Header Section */}
          <div className="flex items-center justify-between px-6 h-20 border-b border-lightBorder dark:border-darkBorder shrink-0 bg-white dark:bg-[#0a0a0a]">
            <div className="flex items-center gap-3">
              <BrandLogo className="w-9 h-9" />
              <span className="text-2xl font-black tracking-tighter text-accent">Cloudlet</span>
            </div>
            <button 
              onClick={closeMenu}
              className="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-accent transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Links Section */}
          <div className="flex-1 overflow-y-auto pt-10 pb-20 px-6 bg-white dark:bg-[#0a0a0a]">
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-6 mb-4">Navigation</p>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={closeMenu}
                  className="w-full flex items-center justify-between px-6 py-5 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 text-xl font-bold text-gray-900 dark:text-white hover:bg-accent hover:text-white transition-all group"
                >
                  {link.name}
                  <ArrowRight size={20} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}

              <div className="h-px bg-lightBorder dark:bg-darkBorder my-8 mx-6"></div>

              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-6 mb-4">Account</p>
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="w-full py-5 text-center font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-white/10 rounded-[1.5rem] text-lg hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="w-full py-5 text-center font-black bg-accent text-white rounded-[1.5rem] shadow-xl shadow-accent/25 text-lg"
                >
                  Sign Up Free
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-8 text-center border-t border-lightBorder dark:border-darkBorder bg-gray-50/50 dark:bg-white/[0.02] shrink-0">
            <p className="text-xs text-gray-500 font-medium">© {new Date().getFullYear()} Cloudlet Secure Cloud Storage</p>
          </div>
        </div>
      )}
    </>
  );
};

export default PublicNavbar;
