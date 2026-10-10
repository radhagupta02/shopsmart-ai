import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getCategories } from '../api/products.js';
import { getPreferences, updatePreferences } from '../api/preferences.js';
import { useToast } from '../context/ToastContext.jsx';
import { Button, Input, Badge, ErrorState, Skeleton } from '../components/ui/index.js';

export default function ProfilePage() {
  const { user } = useAuth();
  const toast = useToast();
  
  const [categories, setCategories] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [errorInitial, setErrorInitial] = useState(null);
  
  const [formData, setFormData] = useState({
    categories: [],
    brands: [],
    budgetMin: '',
    budgetMax: ''
  });
  const [brandInput, setBrandInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState('');

  const fetchInitialData = useCallback(async () => {
    try {
      setLoadingInitial(true);
      setErrorInitial(null);
      const [cats, prefs] = await Promise.all([
        getCategories(),
        getPreferences().catch(() => ({})) // If no prefs, return empty
      ]);
      
      const flatCats = cats.flatMap(c => c.children?.length ? c.children : [c]);
      setCategories(flatCats);
      
      setFormData({
        categories: prefs.categories || [],
        brands: prefs.brands || [],
        budgetMin: prefs.budgetMin || '',
        budgetMax: prefs.budgetMax || ''
      });
    } catch (err) {
      setErrorInitial('Failed to load profile data');
    } finally {
      setLoadingInitial(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleCategoryToggle = (catId) => {
    setFormData(prev => {
      const isSelected = prev.categories.includes(catId);
      if (isSelected) {
        return { ...prev, categories: prev.categories.filter(id => id !== catId) };
      } else {
        return { ...prev, categories: [...prev.categories, catId] };
      }
    });
  };

  const handleAddBrand = (e) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      e.preventDefault();
      const val = brandInput.trim();
      if (val && !formData.brands.includes(val)) {
        setFormData(prev => ({ ...prev, brands: [...prev.brands, val] }));
      }
      setBrandInput('');
    }
  };

  const handleRemoveBrand = (brandToRemove) => {
    setFormData(prev => ({
      ...prev,
      brands: prev.brands.filter(b => b !== brandToRemove)
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setValidationError('');
    
    const min = Number(formData.budgetMin);
    const max = Number(formData.budgetMax);
    
    if (formData.budgetMin !== '' && formData.budgetMax !== '' && min > max) {
      setValidationError('Minimum budget cannot be greater than maximum budget.');
      return;
    }

    try {
      setSaving(true);
      // Clean up empty strings to undefined or null, but the contract says they are optional
      const payload = {
        ...formData,
        budgetMin: formData.budgetMin !== '' ? min : undefined,
        budgetMax: formData.budgetMax !== '' ? max : undefined
      };
      await updatePreferences(payload);
      toast.success('Preferences saved successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (errorInitial) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <ErrorState message={errorInitial} onRetry={fetchInitialData} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-400">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">{user?.name || 'User'}</h1>
            <p className="text-sm text-slate-500">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        <div>
          <Badge variant={user?.tier === 'Premium' ? 'primary' : user?.tier === 'Prime' ? 'success' : 'neutral'}>
            {user?.tier || 'Basic'} Tier
          </Badge>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Shopping Preferences</h2>
        <p className="text-sm text-slate-500 mb-8">
          Customize your preferences to get better recommendations on the home page and from the AI assistant.
        </p>

        <form onSubmit={handleSave} className="space-y-8">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Preferred Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => {
                const isSelected = formData.categories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryToggle(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      isSelected 
                        ? 'bg-blue-50 border-blue-200 text-blue-700' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Preferred Brands</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.brands.map(brand => (
                <span key={brand} className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-sm text-slate-700">
                  {brand}
                  <button type="button" onClick={() => handleRemoveBrand(brand)} className="text-slate-400 hover:text-red-500 focus:outline-none">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </span>
              ))}
            </div>
            <Input 
              placeholder="Type a brand and press Enter"
              value={brandInput}
              onChange={e => setBrandInput(e.target.value)}
              onKeyDown={handleAddBrand}
              onBlur={handleAddBrand}
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Budget Range ($)</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input 
                  type="number" 
                  placeholder="Min" 
                  min="0"
                  value={formData.budgetMin}
                  onChange={e => {
                    setFormData(prev => ({ ...prev, budgetMin: e.target.value }));
                    setValidationError('');
                  }}
                />
              </div>
              <span className="text-slate-400">-</span>
              <div className="flex-1">
                <Input 
                  type="number" 
                  placeholder="Max" 
                  min="0"
                  value={formData.budgetMax}
                  onChange={e => {
                    setFormData(prev => ({ ...prev, budgetMax: e.target.value }));
                    setValidationError('');
                  }}
                />
              </div>
            </div>
            {validationError && (
              <p className="mt-2 text-sm text-red-600">{validationError}</p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
