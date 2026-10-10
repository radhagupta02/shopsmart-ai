import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useAssistant } from '../../context/AssistantContext.jsx';

/**
 * Header placeholder. A1 builds the full version with search, cart badge,
 * wishlist, user menu, tier badge, and mobile hamburger.
 */
export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const { toggle } = useAssistant();
  const navigate = useNavigate();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'white',
        borderBottom: '1px solid var(--color-slate-200)',
        padding: '0 1.5rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span
          style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: 'var(--color-primary)',
          }}
        >
          ShopSmart
        </span>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '0.125rem 0.375rem',
            borderRadius: '0.25rem',
            backgroundColor: 'var(--color-ai-light)',
            color: 'var(--color-ai)',
          }}
        >
          AI
        </span>
      </Link>

      {/* Right actions */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/products" style={{ color: 'var(--color-slate-600)', textDecoration: 'none', fontSize: '0.875rem' }}>
          Products
        </Link>

        {isAuthenticated ? (
          <>
            <Link to="/wishlist" style={{ color: 'var(--color-slate-600)', textDecoration: 'none', fontSize: '0.875rem' }}>
              Wishlist
            </Link>
            <Link
              to="/cart"
              style={{
                color: 'var(--color-slate-600)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                position: 'relative',
              }}
            >
              Cart
              {itemCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-12px',
                    backgroundColor: 'var(--color-danger)',
                    color: 'white',
                    borderRadius: '9999px',
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    padding: '1px 5px',
                    minWidth: '16px',
                    textAlign: 'center',
                  }}
                >
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={toggle}
              className="btn btn-secondary"
              style={{
                padding: '0.375rem 0.75rem',
                fontSize: '0.8rem',
                borderColor: 'var(--color-ai)',
                color: 'var(--color-ai)',
              }}
              aria-label="Toggle AI Assistant"
            >
              ✨ Ask AI
            </button>
            <span
              style={{
                fontSize: '0.8rem',
                color: 'var(--color-slate-600)',
              }}
            >
              {user?.name}
            </span>
            <button
              onClick={logout}
              className="btn btn-secondary"
              style={{ padding: '0.375rem 0.75rem', fontSize: '0.8rem' }}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="btn btn-primary"
            style={{ padding: '0.375rem 0.75rem', fontSize: '0.8rem' }}
          >
            Login
          </button>
        )}
      </nav>
    </header>
  );
}
