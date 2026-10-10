import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useAssistant } from '../../context/AssistantContext.jsx';
import Badge from '../ui/Badge.jsx';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const { open: openAssistant } = useAssistant();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[var(--color-slate-200)] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo & Nav Links */}
        <div className="flex items-center gap-6 shrink-0">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-decoration-none group select-none"
            aria-label="ShopSmart AI Home"
          >
            <span className="text-xl font-extrabold tracking-tight text-[var(--color-primary)] group-hover:text-[var(--color-primary-dark)] transition-colors">
              ShopSmart
            </span>
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-[var(--color-ai-light)] text-[var(--color-ai)] border border-purple-200">
              AI
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-[var(--color-slate-600)]">
            <Link to="/products" className="hover:text-[var(--color-primary)] transition-colors">
              Explore Catalog
            </Link>
            {user?.role === 'ADMIN' && (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <Link
                  to="/admin/knowledge"
                  className="text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Knowledge Base
                </Link>
                <Link
                  to="/admin/ai-log"
                  className="text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  AI Logs
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* Center: Search input */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden sm:flex flex-1 max-w-md relative items-center"
        >
          <div className="absolute left-3.5 text-[var(--color-slate-400)] pointer-events-none">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, brands, specs..."
            className="w-full rounded-full border border-[var(--color-slate-300)] bg-[var(--color-slate-50)] pl-10 pr-4 py-1.5 text-sm text-[var(--color-slate-900)] placeholder:text-[var(--color-slate-400)] focus:bg-white focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] transition-all"
          />
        </form>

        {/* Right: Actions (Assistant, Wishlist, Cart, User) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Ask AI button */}
          <button
            type="button"
            onClick={openAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-ai-light)] text-[var(--color-ai)] hover:bg-purple-100 border border-purple-200 text-xs font-semibold transition-colors shadow-xs"
            aria-label="Open AI Assistant"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--color-ai)] animate-pulse" />
            <span>Ask AI</span>
          </button>

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className="p-2 text-[var(--color-slate-600)] hover:text-[var(--color-primary)] hover:bg-slate-100 rounded-lg transition-colors relative"
            aria-label="Wishlist"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </Link>

          {/* Cart Link with Badge */}
          <Link
            to="/cart"
            className="p-2 text-[var(--color-slate-600)] hover:text-[var(--color-primary)] hover:bg-slate-100 rounded-lg transition-colors relative"
            aria-label="Shopping Cart"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[var(--color-danger)] text-white text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center border-2 border-white">
                {itemCount}
              </span>
            )}
          </Link>

          {/* User Menu / Login */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg border border-[var(--color-slate-200)] hover:bg-[var(--color-slate-50)] transition-colors focus-visible:outline-2"
                aria-expanded={userDropdownOpen}
                aria-label="User menu"
              >
                <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center uppercase">
                  {user?.name?.[0] || 'U'}
                </div>
                <span className="text-xs font-semibold text-[var(--color-slate-800)] hidden sm:inline max-w-[100px] truncate">
                  {user?.name?.split(' ')[0]}
                </span>
                <Badge type="tier" size="sm">
                  {user?.tier || 'BASIC'}
                </Badge>
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setUserDropdownOpen(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg border border-[var(--color-slate-200)] py-2 z-30 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-[var(--color-slate-100)]">
                      <p className="text-sm font-bold text-[var(--color-slate-900)] truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-[var(--color-slate-500)] truncate">
                        {user?.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-xs text-[var(--color-slate-700)] hover:bg-[var(--color-slate-100)] transition-colors"
                      >
                        Profile & Preferences
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-xs text-[var(--color-slate-700)] hover:bg-[var(--color-slate-100)] transition-colors"
                      >
                        My Orders
                      </Link>
                      {user?.role === 'ADMIN' && (
                        <div className="border-t border-slate-100 my-1 pt-1">
                          <Link
                            to="/admin/knowledge"
                            onClick={() => setUserDropdownOpen(false)}
                            className="block px-4 py-1.5 text-xs text-purple-700 font-semibold hover:bg-purple-50 transition-colors"
                          >
                            Knowledge Base (Admin)
                          </Link>
                          <Link
                            to="/admin/ai-log"
                            onClick={() => setUserDropdownOpen(false)}
                            className="block px-4 py-1.5 text-xs text-purple-700 font-semibold hover:bg-purple-50 transition-colors"
                          >
                            AI Audit Logs (Admin)
                          </Link>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-[var(--color-slate-100)] pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-medium transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-[var(--color-primary)] text-white text-xs font-semibold hover:bg-[var(--color-primary-dark)] transition-colors shadow-xs"
            >
              Sign In
            </Link>
          )}

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--color-slate-200)] bg-white px-4 pt-3 pb-5 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-lg border border-[var(--color-slate-300)] bg-[var(--color-slate-50)] px-3 py-2 text-sm"
            />
          </form>

          <nav className="flex flex-col gap-1 text-sm font-medium text-[var(--color-slate-700)]">
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              Explore Products
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center justify-between"
            >
              <span>Wishlist</span>
            </Link>
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center justify-between"
            >
              <span>Cart</span>
              {itemCount > 0 && <Badge size="sm">{itemCount}</Badge>}
            </Link>
            {user?.role === 'ADMIN' && (
              <>
                <Link
                  to="/admin/knowledge"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-purple-700 bg-purple-50 font-semibold"
                >
                  Admin Knowledge Base
                </Link>
                <Link
                  to="/admin/ai-log"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-purple-700 bg-purple-50 font-semibold"
                >
                  Admin AI Logs
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
