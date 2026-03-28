import React from 'react';
import { colorFor } from '../lib/utils.js';

export default function ToolBreakdown({ breakdown = [], totalCalls = 0 }) {
  if (!breakdown.length) {
    return <div style={{ color: 'var(--muted)', fontSize: 13 }}>No tool usage data.</div>;
  }

  const top = breakdown.slice(0, 12);
  const maxCount = top[0]?.count || 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {top.map(({ name, count }) => {
        const color = colorFor(name);
        const pct = Math.round((count / maxCount) * 100);
        const ofTotal = totalCalls > 0 ? ((count / totalCalls) * 100).toFixed(1) : '0';
        return (
          <div key={name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, fontSize: 12 }}>
              <span style={{
                fontFamily: 'var(--mono)',
                color: 'var(--text)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '55%',
              }}>{name}</span>
              <span style={{ fontFamily: 'var(--mono)', color: 'var(--muted)', flexShrink: 0 }}>
                {count.toLocaleString()} <span style={{ color: 'var(--dim)' }}>({ofTotal}%)</span>
              </span>
            </div>
            <div style={{ height: 4, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${pct}%`,
                background: color,
                borderRadius: 2,
                opacity: 0.75,
                transition: 'width 0.4s ease',
              }} />
            </div>
          </div>
        );
      })}
      <div style={{ marginTop: 4, fontSize: 11, color: 'var(--dim)', fontFamily: 'var(--mono)' }}>
        {totalCalls.toLocaleString()} total tool calls
      </div>
    </div>
  );
}
