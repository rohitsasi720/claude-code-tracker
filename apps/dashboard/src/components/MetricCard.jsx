import React from 'react';

export default function MetricCard({ label, value, sub, accent }) {
  return (
    <div style={{
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '16px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--mono)' }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 300, color: accent || 'var(--text)', lineHeight: 1.2 }}>
        {value ?? '—'}
      </div>
      {sub && <div style={{ fontSize: 11, color: 'var(--muted)' }}>{sub}</div>}
    </div>
  );
}
