export function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const px = { sm: 20, md: 30, lg: 44 }[size]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '4rem 0' }}>
      <div style={{ width: px, height: px, border: '3px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      {text && <p style={{ color: '#94a3b8', fontSize: 14 }}>{text}</p>}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '4rem 0', textAlign: 'center' }}>
      <div style={{ width: 56, height: 56, borderRadius: 14, background: '#fef2f2', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>⚠️</div>
      <div>
        <p style={{ fontWeight: 600, color: '#1e293b', marginBottom: 4 }}>Error</p>
        <p style={{ color: '#64748b', fontSize: 14, maxWidth: 320 }}>{message}</p>
      </div>
      {onRetry && <button onClick={onRetry} className="btn-ghost" style={{ fontSize: 13 }}>Try again</button>}
    </div>
  )
}

export function EmptyState({ title = 'Nothing here', description, icon = '📭', action }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '4rem 0', textAlign: 'center' }}>
      <div style={{ fontSize: 44 }}>{icon}</div>
      <div>
        <p style={{ fontWeight: 600, color: '#1e293b', marginBottom: 4 }}>{title}</p>
        {description && <p style={{ color: '#64748b', fontSize: 14, maxWidth: 320 }}>{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="skeleton" style={{ aspectRatio: '1/1' }} />
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="skeleton" style={{ height: 10, width: 50, borderRadius: 5 }} />
        <div className="skeleton" style={{ height: 14, width: '100%', borderRadius: 5 }} />
        <div className="skeleton" style={{ height: 14, width: '60%', borderRadius: 5 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
          <div className="skeleton" style={{ height: 18, width: 65, borderRadius: 5 }} />
          <div className="skeleton" style={{ width: 34, height: 34, borderRadius: 9 }} />
        </div>
      </div>
    </div>
  )
}
