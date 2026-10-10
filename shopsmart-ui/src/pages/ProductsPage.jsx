import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { listProducts, getCategories } from '../api/products.js';
import { useDebounce } from '../hooks/useDebounce.js';
import ProductCard from '../components/products/ProductCard.jsx';
import { SkeletonGrid } from '../components/ui/Skeleton.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import Pagination from '../components/ui/Pagination.jsx';
import Button from '../components/ui/Button.jsx';
import Layout from '../components/layout/Layout.jsx';

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'newest', label: 'Newest Arrivals' },
];

const BRANDS_LIST = ['Dell', 'Lenovo', 'HP', 'Acer', 'ASUS', 'Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', "O'Reilly"];
const RATING_OPTIONS = [4.5, 4.0, 3.5];

/**
 * Filter sidebar component declared outside render for clean performance.
 */
function FilterSidebarContent({
  categoriesTree,
  categoryParam,
  inStockParam,
  minPriceParam,
  maxPriceParam,
  selectedBrands,
  minRatingParam,
  activeFiltersCount,
  updateQueryParam,
  toggleBrand,
  clearAllFilters,
}) {
  return (
    <div className="space-y-6">
      {/* Category Tree */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-slate-900)] mb-3">
          Categories
        </h4>
        <div className="space-y-1.5 text-sm">
          <button
            type="button"
            onClick={() => updateQueryParam('category', undefined, true)}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              !categoryParam
                ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] font-bold'
                : 'text-[var(--color-slate-600)] hover:bg-slate-100'
            }`}
          >
            All Categories
          </button>

          {(categoriesTree || []).map((parent) => (
            <div key={parent.id} className="space-y-1 pt-1">
              <button
                type="button"
                onClick={() => updateQueryParam('category', parent.id, true)}
                className={`w-full text-left px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  categoryParam === String(parent.id)
                    ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                    : 'text-[var(--color-slate-800)] hover:bg-slate-100'
                }`}
              >
                {parent.name}
              </button>

              {parent.children?.length > 0 && (
                <div className="pl-3 space-y-0.5 border-l border-slate-200 ml-2">
                  {parent.children.map((child) => (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => updateQueryParam('category', child.id, true)}
                      className={`w-full text-left px-2 py-1 rounded text-[11px] transition-colors ${
                        categoryParam === String(child.id)
                          ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] font-bold'
                          : 'text-[var(--color-slate-500)] hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {child.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* In-Stock Toggle */}
      <div className="pt-4 border-t border-[var(--color-slate-200)]">
        <label className="flex items-center justify-between cursor-pointer select-none">
          <span className="text-xs font-bold text-[var(--color-slate-900)]">
            In Stock Only
          </span>
          <input
            type="checkbox"
            checked={inStockParam}
            onChange={(e) => updateQueryParam('inStock', e.target.checked ? 'true' : undefined, true)}
            className="w-4 h-4 rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
          />
        </label>
      </div>

      {/* Price Range */}
      <div className="pt-4 border-t border-[var(--color-slate-200)]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-slate-900)] mb-3">
          Price Range ($)
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Min ($)</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={minPriceParam}
              onChange={(e) => updateQueryParam('minPrice', e.target.value || undefined, true)}
              className="w-full rounded-lg border border-slate-300 px-2.5 py-1 text-xs"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Max ($)</label>
            <input
              type="number"
              min="0"
              placeholder="3000"
              value={maxPriceParam}
              onChange={(e) => updateQueryParam('maxPrice', e.target.value || undefined, true)}
              className="w-full rounded-lg border border-slate-300 px-2.5 py-1 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Brands */}
      <div className="pt-4 border-t border-[var(--color-slate-200)]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-slate-900)] mb-3">
          Brands
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {BRANDS_LIST.map((b) => (
            <label
              key={b}
              className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 hover:text-slate-900"
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(b)}
                onChange={() => toggleBrand(b)}
                className="w-3.5 h-3.5 rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <span>{b}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Customer Rating */}
      <div className="pt-4 border-t border-[var(--color-slate-200)]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-slate-900)] mb-3">
          Minimum Rating
        </h4>
        <div className="space-y-1.5">
          {RATING_OPTIONS.map((rate) => (
            <label
              key={rate}
              className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 hover:text-slate-900"
            >
              <input
                type="radio"
                name="rating_filter"
                checked={minRatingParam === String(rate)}
                onChange={() => updateQueryParam('minRating', rate, true)}
                className="text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <span className="text-amber-500">★</span>
              <span>{rate} stars & above</span>
            </label>
          ))}
          {minRatingParam && (
            <button
              type="button"
              onClick={() => updateQueryParam('minRating', undefined, true)}
              className="text-[11px] text-[var(--color-primary)] hover:underline pt-1 block"
            >
              Clear rating filter
            </button>
          )}
        </div>
      </div>

      {/* Clear all action */}
      {activeFiltersCount > 0 && (
        <div className="pt-4 border-t border-slate-200">
          <Button
            size="sm"
            variant="outline"
            fullWidth
            onClick={clearAllFilters}
            className="text-xs"
          >
            Reset All Filters
          </Button>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL query params
  const qParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  const brandParam = searchParams.get('brand') || '';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const minRatingParam = searchParams.get('minRating') || '';
  const inStockParam = searchParams.get('inStock') === 'true';
  const sortParam = searchParams.get('sort') || 'relevance';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  // Local state for search bar (debounced)
  const [searchInput, setSearchInput] = useState(qParam);
  const debouncedSearch = useDebounce(searchInput, 400);

  // Data & loading states
  const [categoriesTree, setCategoriesTree] = useState([]);
  const [productsData, setProductsData] = useState({
    items: [],
    page: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Helper to update URL search params
  const updateQueryParam = useCallback(
    (key, value, resetPage = false) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value === undefined || value === null || value === '' || value === false) {
            next.delete(key);
          } else {
            next.set(key, String(value));
          }
          if (resetPage && key !== 'page') {
            next.delete('page');
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  // Sync debounced search to URL
  useEffect(() => {
    if (debouncedSearch !== qParam) {
      updateQueryParam('q', debouncedSearch || undefined, true);
    }
  }, [debouncedSearch, qParam, updateQueryParam]);

  // Load categories once
  useEffect(() => {
    getCategories()
      .then((data) => setCategoriesTree(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSearchInput('');
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = {
        page: pageParam,
        size: 12,
        sort: sortParam,
      };

      if (qParam) query.q = qParam;
      if (categoryParam) query.category = categoryParam;
      if (brandParam) query.brand = brandParam;
      if (minPriceParam) query.minPrice = minPriceParam;
      if (maxPriceParam) query.maxPrice = maxPriceParam;
      if (minRatingParam) query.minRating = minRatingParam;
      if (inStockParam) query.inStock = 'true';

      const data = await listProducts(query);
      setProductsData(data || { items: [], page: 1, totalPages: 1, totalItems: 0 });
    } catch (err) {
      setError(err?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [
    pageParam,
    sortParam,
    qParam,
    categoryParam,
    brandParam,
    minPriceParam,
    maxPriceParam,
    minRatingParam,
    inStockParam,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (qParam) count++;
    if (categoryParam) count++;
    if (brandParam) count++;
    if (minPriceParam || maxPriceParam) count++;
    if (minRatingParam) count++;
    if (inStockParam) count++;
    return count;
  }, [qParam, categoryParam, brandParam, minPriceParam, maxPriceParam, minRatingParam, inStockParam]);

  // Selected brands array
  const selectedBrands = useMemo(() => {
    return brandParam ? brandParam.split(',').filter(Boolean) : [];
  }, [brandParam]);

  const toggleBrand = useCallback(
    (brand) => {
      let next;
      if (selectedBrands.includes(brand)) {
        next = selectedBrands.filter((b) => b !== brand);
      } else {
        next = [...selectedBrands, brand];
      }
      updateQueryParam('brand', next.length > 0 ? next.join(',') : undefined, true);
    },
    [selectedBrands, updateQueryParam]
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb / Heading */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-slate-900)] tracking-tight">
            Product Catalog
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-slate-500)] mt-1">
            Browse high-grade hardware, tech essentials, and curated gear with complete spec verification.
          </p>
        </div>

        {/* ── Top Bar: Search, count, active filters, sort, mobile toggle ─ */}
        <div className="bg-white rounded-xl border border-[var(--color-slate-200)] p-4 shadow-xs mb-8 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search catalog by title, brand, or specs..."
                className="w-full rounded-lg border border-slate-300 bg-slate-50/50 pl-10 pr-3 py-1.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] transition-all"
              />
            </div>

            {/* Right: Results count, Sort, Mobile filter drawer toggle */}
            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
              {/* Mobile Filter Button */}
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
              >
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[var(--color-primary)] text-white text-[10px] flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <span className="text-xs text-[var(--color-slate-500)] hidden sm:inline">
                {productsData.totalItems} {productsData.totalItems === 1 ? 'item' : 'items'}
              </span>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <label htmlFor="sort-dropdown" className="text-xs text-slate-500 font-medium hidden md:inline">
                  Sort:
                </label>
                <select
                  id="sort-dropdown"
                  value={sortParam}
                  onChange={(e) => updateQueryParam('sort', e.target.value, false)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] shadow-xs cursor-pointer font-medium"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center flex-wrap gap-2 pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-400 text-[11px] font-medium">Active:</span>

              {qParam && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-[var(--color-primary)] border border-blue-200">
                  <span>Query: "{qParam}"</span>
                  <button type="button" onClick={() => updateQueryParam('q', undefined, true)}>✕</button>
                </span>
              )}

              {categoryParam && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-[var(--color-primary)] border border-blue-200">
                  <span>Category ID: {categoryParam}</span>
                  <button type="button" onClick={() => updateQueryParam('category', undefined, true)}>✕</button>
                </span>
              )}

              {selectedBrands.map((b) => (
                <span key={b} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-[var(--color-primary)] border border-blue-200">
                  <span>{b}</span>
                  <button type="button" onClick={() => toggleBrand(b)}>✕</button>
                </span>
              ))}

              {(minPriceParam || maxPriceParam) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-[var(--color-primary)] border border-blue-200">
                  <span>${minPriceParam || '0'} - ${maxPriceParam || 'max'}</span>
                  <button type="button" onClick={() => {
                    updateQueryParam('minPrice', undefined);
                    updateQueryParam('maxPrice', undefined, true);
                  }}>✕</button>
                </span>
              )}

              {minRatingParam && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  <span>★ {minRatingParam}+</span>
                  <button type="button" onClick={() => updateQueryParam('minRating', undefined, true)}>✕</button>
                </span>
              )}

              {inStockParam && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span>In Stock</span>
                  <button type="button" onClick={() => updateQueryParam('inStock', undefined, true)}>✕</button>
                </span>
              )}

              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-red-600 hover:underline font-medium ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* ── Main Content: Sidebar + Products Grid ───────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Left Sidebar (1 col) */}
          <aside className="hidden lg:block lg:col-span-1 bg-white rounded-xl border border-[var(--color-slate-200)] p-5 shadow-xs h-fit sticky top-24">
            <FilterSidebarContent
              categoriesTree={categoriesTree}
              categoryParam={categoryParam}
              inStockParam={inStockParam}
              minPriceParam={minPriceParam}
              maxPriceParam={maxPriceParam}
              selectedBrands={selectedBrands}
              minRatingParam={minRatingParam}
              activeFiltersCount={activeFiltersCount}
              updateQueryParam={updateQueryParam}
              toggleBrand={toggleBrand}
              clearAllFilters={clearAllFilters}
            />
          </aside>

          {/* Product Grid Area (3 cols desktop, 2 cols tablet, 1 col mobile) */}
          <main className="lg:col-span-3 flex flex-col justify-between">
            {loading ? (
              <SkeletonGrid
                count={8}
                columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              />
            ) : error ? (
              <ErrorState message={error} onRetry={fetchProducts} />
            ) : productsData.items.length === 0 ? (
              <EmptyState
                title="No products matched your criteria"
                description="Try loosening your search terms or clearing specific category/price filters."
                action={
                  <Button variant="primary" size="sm" onClick={clearAllFilters}>
                    Clear all filters
                  </Button>
                }
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {(productsData?.items || []).map((prod) => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-8">
                  <Pagination
                    currentPage={productsData.page}
                    totalPages={productsData.totalPages}
                    onPageChange={(p) => updateQueryParam('page', p)}
                  />
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      {/* ── Mobile Filters Bottom Drawer Modal ───────────────────────── */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer content */}
          <div className="relative z-10 w-full max-h-[85vh] bg-white rounded-t-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                Filter Products
              </h3>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1">
              <FilterSidebarContent
                categoriesTree={categoriesTree}
                categoryParam={categoryParam}
                inStockParam={inStockParam}
                minPriceParam={minPriceParam}
                maxPriceParam={maxPriceParam}
                selectedBrands={selectedBrands}
                minRatingParam={minRatingParam}
                activeFiltersCount={activeFiltersCount}
                updateQueryParam={updateQueryParam}
                toggleBrand={toggleBrand}
                clearAllFilters={clearAllFilters}
              />
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-3">
              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={() => {
                  clearAllFilters();
                  setMobileDrawerOpen(false);
                }}
              >
                Reset
              </Button>
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => setMobileDrawerOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
