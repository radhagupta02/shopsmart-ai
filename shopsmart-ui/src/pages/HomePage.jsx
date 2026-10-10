import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAssistant } from '../context/AssistantContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getCategories, listProducts } from '../api/products.js';
import { getPreferences } from '../api/preferences.js';
import ProductCard from '../components/products/ProductCard.jsx';
import { SkeletonGrid, Skeleton } from '../components/ui/Skeleton.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import Button from '../components/ui/Button.jsx';
import Layout from '../components/layout/Layout.jsx';

export default function HomePage() {
  const { open: openAssistant } = useAssistant();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [heroSearch, setHeroSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [trending, setTrending] = useState([]);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);

  const [errorTrending, setErrorTrending] = useState(null);
  const [errorRecommended, setErrorRecommended] = useState(null);

  // Fetch Categories
  const fetchCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  // Fetch Trending (Products sorted by rating per plan Decision)
  const fetchTrending = useCallback(async () => {
    setLoadingTrending(true);
    setErrorTrending(null);
    try {
      const res = await listProducts({ sort: 'rating', size: 4 });
      setTrending(res?.items || []);
    } catch (err) {
      setErrorTrending(err?.message || 'Failed to load trending products');
    } finally {
      setLoadingTrending(false);
    }
  }, []);

  // Fetch Recommended for you (built from /users/me/preferences + listProducts)
  const fetchRecommended = useCallback(async () => {
    setLoadingRecommended(true);
    setErrorRecommended(null);
    try {
      if (!isAuthenticated) {
        // Fallback recommendations for guest
        const fallback = await listProducts({ size: 4 });
        setRecommended(fallback?.items || []);
        return;
      }

      const prefs = await getPreferences();
      const query = { size: 4 };

      if (prefs?.categories?.length > 0) {
        query.category = prefs.categories[0];
      }
      if (prefs?.brands?.length > 0) {
        query.brand = prefs.brands[0];
      }
      if (prefs?.budgetMax) {
        query.maxPrice = prefs.budgetMax;
      }

      const res = await listProducts(query);
      setRecommended(res?.items || []);
    } catch (err) {
      setErrorRecommended(err?.message || 'Failed to load personalized recommendations');
    } finally {
      setLoadingRecommended(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCategories();
    fetchTrending();
    fetchRecommended();
  }, [fetchCategories, fetchTrending, fetchRecommended]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/products?q=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  return (
    <Layout>
      {/* ── 1. Hero Section ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F6CBD]/10 via-[var(--color-primary-light)]/40 to-transparent py-14 sm:py-20 border-b border-[var(--color-slate-200)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-purple-200 text-xs font-semibold text-[var(--color-ai)] mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[var(--color-ai)] animate-pulse" />
            <span>AI-Driven E-Commerce Experience</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[var(--color-slate-900)] tracking-tight mb-4 max-w-3xl mx-auto leading-tight">
            Discover Verified Products with{' '}
            <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-ai)] bg-clip-text text-transparent">
              Auditable AI
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--color-slate-600)] max-w-2xl mx-auto mb-8">
            Policy-grounded assistance, real-time specifications, and explainable recommendations tailored to your exact budget.
          </p>

          {/* Hero Search Box & Ask AI CTA */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-slate-400)] pointer-events-none">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="search"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="Search laptops, smartphones, headphones..."
                  className="w-full rounded-xl border border-[var(--color-slate-300)] bg-white pl-12 pr-4 py-3.5 text-sm sm:text-base text-[var(--color-slate-900)] placeholder:text-[var(--color-slate-400)] shadow-sm focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] transition-all"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" variant="primary" size="lg" className="px-6 flex-1 sm:flex-initial">
                  Search
                </Button>
                <Button
                  type="button"
                  variant="ai"
                  size="lg"
                  onClick={openAssistant}
                  className="px-6 flex-1 sm:flex-initial shadow-md"
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  }
                >
                  Ask AI
                </Button>
              </div>
            </form>

            {/* Quick suggested chips */}
            <div className="flex items-center justify-center flex-wrap gap-2 mt-4 text-xs text-[var(--color-slate-600)]">
              <span className="font-medium text-[var(--color-slate-500)]">Popular:</span>
              <button
                type="button"
                onClick={() => navigate('/products?q=Dell+Inspiron+15')}
                className="px-2.5 py-1 rounded-full bg-white border border-[var(--color-slate-200)] hover:border-[var(--color-primary)] text-[var(--color-slate-700)] transition-colors"
              >
                Dell Inspiron 15
              </button>
              <button
                type="button"
                onClick={() => navigate('/products?q=laptop+under+1000')}
                className="px-2.5 py-1 rounded-full bg-white border border-[var(--color-slate-200)] hover:border-[var(--color-primary)] text-[var(--color-slate-700)] transition-colors"
              >
                Laptops under $1000
              </button>
              <button
                type="button"
                onClick={() => navigate('/products?category=4')}
                className="px-2.5 py-1 rounded-full bg-white border border-[var(--color-slate-200)] hover:border-[var(--color-primary)] text-[var(--color-slate-700)] transition-colors"
              >
                Audio & Headphones
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Category Tiles ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-slate-900)]">
              Browse Categories
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-slate-500)]">
              Select a department to view curated selections
            </p>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors flex items-center gap-1"
          >
            <span>All Catalog</span>
            <span>→</span>
          </Link>
        </div>

        {loadingCategories ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Flatten children categories for direct quick navigation */}
            {categories.flatMap((cat) => (cat.children?.length ? cat.children : [cat])).map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="group flex flex-col items-center justify-center text-center p-5 rounded-xl border border-[var(--color-slate-200)] bg-white hover:border-[var(--color-primary)] hover:shadow-md transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="text-xl">
                    {cat.name.includes('Laptop') ? '💻' :
                     cat.name.includes('Smartphones') ? '📱' :
                     cat.name.includes('Audio') ? '🎧' :
                     cat.name.includes('Footwear') ? '👟' :
                     cat.name.includes('Technology') ? '📖' : '🛍️'}
                  </span>
                </div>
                <span className="text-sm font-bold text-[var(--color-slate-800)] group-hover:text-[var(--color-primary)] transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── 3. Recommended For You Row ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-[var(--color-slate-200)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-slate-900)]">
                Recommended For You
              </h2>
              {isAuthenticated && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-[var(--color-primary)] border border-blue-200 font-semibold">
                  Personalized
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[var(--color-slate-500)]">
              Curated based on your saved interests and budget preferences
            </p>
          </div>

          <Link
            to="/profile"
            className="text-xs sm:text-sm font-medium text-[var(--color-slate-600)] hover:text-[var(--color-primary)] transition-colors"
          >
            Adjust preferences
          </Link>
        </div>

        {loadingRecommended ? (
          <SkeletonGrid count={4} columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" />
        ) : errorRecommended ? (
          <ErrorState message={errorRecommended} onRetry={fetchRecommended} />
        ) : recommended.length === 0 ? (
          <EmptyState
            title="No recommendations match your preferences"
            description="Update your category and brand preferences to discover tailored suggestions."
            action={
              <Button size="sm" variant="primary" onClick={() => navigate('/profile')}>
                Set your preferences
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recommended.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* ── 4. Trending Products Row ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-[var(--color-slate-200)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-slate-900)]">
                Trending & Top Rated
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                ★ 4.4+
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--color-slate-500)]">
              Highest rated customer favorites across all departments
            </p>
          </div>

          <Link
            to="/products?sort=rating"
            className="text-xs sm:text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
          >
            View all trending →
          </Link>
        </div>

        {loadingTrending ? (
          <SkeletonGrid count={4} columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" />
        ) : errorTrending ? (
          <ErrorState message={errorTrending} onRetry={fetchTrending} />
        ) : trending.length === 0 ? (
          <EmptyState title="No trending products currently available" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {trending.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
