import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <Loader2 className="animate-spin text-accent w-8 h-8" />
    </div>
  );
};

export default Loader;
