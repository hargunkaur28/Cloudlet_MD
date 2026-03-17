import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = ({ folder, onNavigate }) => {
  // folder might have its parent chain populated, but for now we'll handle single level or use a state
  // ideally, passed path array: [{ name: 'Home', id: null }, { name: 'Folder A', id: '...' }]
  
  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6 overflow-x-auto no-scrollbar py-1">
      <button 
        onClick={() => onNavigate(null)}
        className="flex items-center gap-1 hover:text-accent transition-colors shrink-0"
      >
        <Home size={16} />
        <span>My Drive</span>
      </button>
      
      {folder && (
        <>
          <ChevronRight size={14} className="shrink-0" />
          <button className="font-medium text-gray-900 dark:text-gray-100 shrink-0">
            {folder.name}
          </button>
        </>
      )}
    </nav>
  );
};

export default Breadcrumbs;
