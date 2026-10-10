import React, { useState, useEffect } from 'react';
import { uploadDocument } from '../../api/knowledge.js';
import { Button, Input } from '../ui/index.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function MetadataForm({ file, onCancel, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    version: '',
    effectiveDate: '',
    category: '',
    region: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (file) {
      // Default title to file name without extension
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setFormData(prev => ({ ...prev, title: nameWithoutExt }));
    }
  }, [file]);

  const validate = () => {
    const newErrors = {};
    if (!formData.version.trim()) newErrors.version = 'Version is required';
    if (!formData.effectiveDate) newErrors.effectiveDate = 'Effective date is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.region.trim()) newErrors.region = 'Region is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('file', file);
      
      // title is optional on backend, but if provided we append it
      if (formData.title.trim()) {
        data.append('title', formData.title.trim());
      }
      
      data.append('version', formData.version.trim());
      data.append('effectiveDate', formData.effectiveDate);
      data.append('category', formData.category.trim());
      data.append('region', formData.region.trim());
      
      await uploadDocument(data);
      toast.success('Document uploaded successfully. Processing started.');
      onSuccess();
    } catch (err) {
      toast.error(err.message || 'Failed to upload document');
    } finally {
      setSubmitting(false);
    }
  };

  if (!file) return null;

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 leading-tight truncate max-w-[250px] sm:max-w-xs">{file.name}</h3>
          <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
        </div>
        <button type="button" onClick={onCancel} className="ml-auto text-sm text-slate-400 hover:text-slate-600">
          Change file
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="sm:col-span-2">
          <Input 
            label="Title (Optional)" 
            name="title"
            value={formData.title} 
            onChange={handleChange}
            placeholder="e.g. Laptop Return Policy"
          />
        </div>
        
        <div>
          <Input 
            label="Version" 
            name="version"
            value={formData.version} 
            onChange={handleChange}
            error={errors.version}
            placeholder="e.g. v2026.1"
            required
          />
        </div>
        
        <div>
          <Input 
            label="Effective Date" 
            type="date"
            name="effectiveDate"
            value={formData.effectiveDate} 
            onChange={handleChange}
            error={errors.effectiveDate}
            required
          />
        </div>
        
        <div>
          <Input 
            label="Category" 
            name="category"
            value={formData.category} 
            onChange={handleChange}
            error={errors.category}
            placeholder="e.g. Electronics"
            required
          />
        </div>
        
        <div>
          <Input 
            label="Region" 
            name="region"
            value={formData.region} 
            onChange={handleChange}
            error={errors.region}
            placeholder="e.g. GLOBAL"
            required
          />
        </div>
      </div>
      
      <div className="flex gap-3 justify-end">
        <Button variant="outline" type="button" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={submitting}>
          {submitting ? 'Uploading...' : 'Upload Document'}
        </Button>
      </div>
    </form>
  );
}
