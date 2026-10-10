/**
 * EmptyState placeholder shown on routes that will be built in later phases.
 * @param {Object} props
 * @param {string} props.title - page title
 * @param {string} props.phase - phase ID (e.g. 'A1')
 * @param {string} [props.description] - optional description
 */
export default function EmptyState({ title, phase, description }) {
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
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
          fontSize: '1.75rem',
        }}
      >
        🚧
      </div>
      <h1
        style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--color-slate-900)',
          margin: '0 0 0.5rem',
        }}
      >
        {title}
      </h1>
      <p
        style={{
          fontSize: '0.875rem',
          color: 'var(--color-slate-500)',
          margin: 0,
        }}
      >
        {description || `Coming in phase ${phase}`}
      </p>
    </div>
  );
}
