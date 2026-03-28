import React, { useEffect, useState } from 'react';

export default function StatusBar({ meta }) {
  const [apiOk, setApiOk] = useState(null);

  useEffect(() => {
    fetch('/health')
      .then(r => r.ok ? setApiOk(true) : setApiOk(false))
      .catch(() => setApiOk(false));
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      fontSize: 11,
      color: 'var(--muted)',
      fontFamily: 'var(--mono)',
      borderBottom: '1px solid var(--border)',
      padding: '8px 24px',
      background: 'var(--bg)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: apiOk === null ? 'var(--dim)' : apiOk ? 'var(--green)' : 'var(--red)',
          animation: apiOk ? 'pulse-dot 2s infinite' : 'none',
        }} />
        <span style={{ color: apiOk ? 'var(--green)' : apiOk === false ? 'var(--red)' : 'var(--muted)' }}>
          {apiOk === null ? 'connecting…' : apiOk ? 'API connected' : 'API offline'}
        </span>
      </div>
      {meta?.claudeDir && (
        <>
          <span style={{ color: 'var(--dim)' }}>·</span>
          <span style={{ opacity: 0.6 }}>{meta.claudeDir}</span>
        </>
      )}
      {meta?.hasData === false && (
        <>
          <span style={{ color: 'var(--dim)' }}>·</span>
          <span style={{ color: 'var(--amber)' }}>⚠ no history found — run claude code first</span>
        </>
      )}
    </div>
  );
}
