import React, { useState, useRef } from 'react';
import { Button } from '../ui/index.js';

const ALLOWED_TYPES = [
  'application/pdf',
  'text/markdown',
  'application/json'
];

const ALLOWED_EXTENSIONS = ['.pdf', '.md', '.json'];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export default function UploadZone({ onFileSelect }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const validateFile = (file) => {
    setError(null);
    if (!file) return false;

    // Check extension and type (type might be empty for .md on some OS)
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setError('Unsupported file type'); // Matches 415
      return false;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError('File too large'); // Matches 413
      return false;
    }

    return true;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
      // Reset input so the same file can be selected again if needed
      e.target.value = '';
    }
  };

  return (
    <div className="w-full">
      <div 
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors flex flex-col items-center justify-center min-h-[200px]
          ${dragActive ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]/30' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}
          ${error ? 'border-red-400 bg-red-50/50' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <svg className={`w-10 h-10 mb-4 ${error ? 'text-red-500' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-slate-700 font-medium mb-1">
          Drag and drop your document here
        </p>
        <p className="text-slate-500 text-sm mb-4">
          or click below to select a file
        </p>
        <p className="text-slate-400 text-xs mb-6 font-medium">
          Supported formats: .pdf, .md, .json (Max 10MB)
        </p>
        
        <input 
          ref={inputRef}
          type="file" 
          className="hidden" 
          accept=".pdf,.md,.json,application/pdf,text/markdown,application/json"
          onChange={handleChange}
        />
        <Button 
          variant="outline" 
          onClick={() => inputRef.current?.click()}
        >
          Select File
        </Button>
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}
