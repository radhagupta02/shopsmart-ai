import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <h1
        style={{
          fontSize: '4rem',
          fontWeight: 800,
          color: 'var(--color-slate-300)',
          margin: '0 0 0.5rem',
        }}
      >
        404
      </h1>
      <p
        style={{
          fontSize: '1rem',
          color: 'var(--color-slate-500)',
          margin: '0 0 1.5rem',
        }}
      >
        Page not found
      </p>
      <Link
        to="/"
        className="btn btn-primary"
        style={{ textDecoration: 'none' }}
      >
        Go Home
      </Link>
    </div>
  );
}
