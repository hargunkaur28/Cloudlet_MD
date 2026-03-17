import React from 'react';
import { X, Download, Maximize2 } from 'lucide-react';

const ImagePreviewModal = ({ file, onClose }) => {
  if (!file) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300"
      onMouseDown={onClose}
    >
      <div className="absolute top-4 right-4 flex items-center gap-4 z-50">
        <a 
          href={file.url} 
          download={file.filename}
          onMouseDown={(e) => e.stopPropagation()}
          className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          title="Download"
        >
          <Download size={20} />
        </a>
        <button 
          onClick={onClose}
          className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          title="Close"
        >
          <X size={20} />
        </button>
      </div>

      <div 
        className="relative max-w-full max-h-full flex items-center justify-center p-2"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <img 
          src={file.url} 
          alt={file.filename} 
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
        />
        
        <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 text-center text-white/80 w-full px-4">
          <p className="text-sm font-medium truncate">{file.filename}</p>
          <p className="text-[10px] mt-1 opacity-60">Click anywhere outside to close</p>
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal;
