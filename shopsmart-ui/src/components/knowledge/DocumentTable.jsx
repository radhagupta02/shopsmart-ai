import React, { useState, useEffect, useRef } from 'react';
import { listDocuments } from '../../api/knowledge.js';
import { Badge, Skeleton, EmptyState, ErrorState } from '../ui/index.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function DocumentTable({ refreshTrigger }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  
  const previousStatusesRef = useRef({});

  useEffect(() => {
    let mounted = true;
    let pollInterval = null;

    const fetchDocs = async () => {
      try {
        const data = await listDocuments();
        if (!mounted) return;
        
        // Check for status changes to trigger toasts
        const newStatuses = {};
        let hasProcessing = false;

        data.forEach(doc => {
          newStatuses[doc.id] = doc.status;
          
          const prevStatus = previousStatusesRef.current[doc.id];
          if (prevStatus === 'PROCESSING' && doc.status === 'READY') {
            toast.success(`Document "${doc.title}" is now READY.`);
          } else if (prevStatus === 'PROCESSING' && doc.status === 'FAILED') {
            toast.error(`Document "${doc.title}" FAILED processing.`);
          }

          if (doc.status === 'PROCESSING') {
            hasProcessing = true;
          }
        });

        previousStatusesRef.current = newStatuses;
        setDocuments(data);
        setError(null);

        // Manage polling
        if (hasProcessing && !pollInterval) {
          pollInterval = setInterval(fetchDocs, 3000); // Poll every 3 seconds
        } else if (!hasProcessing && pollInterval) {
          clearInterval(pollInterval);
          pollInterval = null;
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Failed to fetch documents');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchDocs();

    return () => {
      mounted = false;
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [toast, refreshTrigger]);

  if (loading && documents.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="p-4 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (error && documents.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <EmptyState
          title="Upload your first policy"
          message="No documents have been uploaded to the knowledge base yet."
        />
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium text-center">Version</th>
            <th className="px-4 py-3 font-medium text-center">Date</th>
            <th className="px-4 py-3 font-medium">Category / Region</th>
            <th className="px-4 py-3 font-medium text-center">Type</th>
            <th className="px-4 py-3 font-medium text-center">Chunks</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {documents.map((doc) => (
            <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-4 py-3 font-medium text-slate-900 max-w-[200px] truncate" title={doc.title}>
                {doc.title}
              </td>
              <td className="px-4 py-3 text-slate-500 text-center">{doc.version}</td>
              <td className="px-4 py-3 text-slate-500 text-center">{doc.effectiveDate}</td>
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1">
                  <span className="text-slate-900">{doc.category}</span>
                  <span className="text-xs text-slate-500">{doc.region}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                <Badge variant="neutral">{doc.fileType}</Badge>
              </td>
              <td className="px-4 py-3 text-slate-500 text-center">{doc.chunkCount || 0}</td>
              <td className="px-4 py-3">
                {doc.status === 'READY' && <Badge variant="success">READY</Badge>}
                {doc.status === 'FAILED' && <Badge variant="danger">FAILED</Badge>}
                {doc.status === 'PROCESSING' && (
                  <Badge variant="warning" className="flex items-center gap-1.5 w-max">
                    <svg className="animate-spin w-3 h-3 text-amber-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    PROCESSING
                  </Badge>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
