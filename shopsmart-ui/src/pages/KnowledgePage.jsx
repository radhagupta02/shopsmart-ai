import React, { useState, useCallback } from 'react';
import UploadZone from '../components/knowledge/UploadZone.jsx';
import MetadataForm from '../components/knowledge/MetadataForm.jsx';
import DocumentTable from '../components/knowledge/DocumentTable.jsx';

export default function KnowledgePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFileSelect = useCallback((file) => {
    setSelectedFile(file);
  }, []);

  const handleCancelUpload = useCallback(() => {
    setSelectedFile(null);
  }, []);

  const handleUploadSuccess = useCallback(() => {
    setSelectedFile(null);
    // Trigger table refresh
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Knowledge Base Admin</h1>
        <p className="text-slate-600">Manage approved documents for the AI assistant policy RAG.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          {!selectedFile ? (
            <div className="sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Upload Document</h2>
              <UploadZone onFileSelect={handleFileSelect} />
            </div>
          ) : (
            <div className="sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Document Details</h2>
              <MetadataForm 
                file={selectedFile} 
                onCancel={handleCancelUpload} 
                onSuccess={handleUploadSuccess} 
              />
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Approved Documents</h2>
          <DocumentTable refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
}

