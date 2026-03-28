import React from 'react';
import { fmtCost, fmtTokens } from '../lib/utils.js';

function shortModel(model) {
  if (!model) return 'unknown';
  // Try to extract a readable short name
  const m = model
    .replace('claude-', '')
    .replace(/-\d{8}$/, ''); // remove date suffix
  return m;
}

function modelColor(model) {
  if (!model) return 'var(--accent)';
  if (model.includes('opus')) return 'var(--amber)';
  if (model.includes('haiku')) return 'var(--green)';
  return 'var(--accent)'; // sonnet default
}

function modelBg(model) {
  if (!model) return 'rgba(var(--accent-rgb), 0.15)';
  if (model.includes('opus')) return 'rgba(232,168,64,0.2)';
  if (model.includes('haiku')) return 'rgba(92,184,138,0.2)';
  return 'rgba(var(--accent-rgb), 0.15)';
}

export default function ModelBreakdown({ breakdown = [] }) {
  if (!breakdown.length) {
    return <div style={{ color: 'var(--muted)', fontSize: 13 }}>No model usage data.</div>;
  }

  const totalCost = breakdown.reduce((s, m) => s + m.cost, 0) || 1;
  const maxCost = breakdown[0]?.cost || 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {breakdown.map(({ model, sessionCount, input, output, cost }) => {
        const color = modelColor(model);
        const bg = modelBg(model);
        const pct = Math.round((cost / maxCost) * 100);
        const pctOfTotal = totalCost > 0 ? ((cost / totalCost) * 100).toFixed(1) : '0';

        return (
          <div key={model}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <span style={{
                  fontSize: 10,
                  fontFamily: 'var(--mono)',
                  color,
                  background: bg,
                  borderRadius: 4,
                  padding: '2px 6px',
                  flexShrink: 0,
                }}>
                  {shortModel(model)}
                </span>
                <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
                  {sessionCount} {sessionCount === 1 ? 'session' : 'sessions'}
                </span>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span style={{ fontFamily: 'var(--mono)', color: 'var(--text)', fontSize: 12 }}>{fmtCost(cost)}</span>
                <span style={{ fontFamily: 'var(--mono)', color: 'var(--dim)', fontSize: 11, marginLeft: 6 }}>{pctOfTotal}%</span>
              </div>
            </div>
            <div style={{ height: 5, background: 'var(--bg4)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${pct}%`,
                background: color,
                borderRadius: 3,
                opacity: 0.7,
                transition: 'width 0.4s ease',
              }} />
            </div>
            <div style={{ marginTop: 3, fontSize: 10, color: 'var(--dim)', fontFamily: 'var(--mono)' }}>
              in: {fmtTokens(input)} · out: {fmtTokens(output)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
