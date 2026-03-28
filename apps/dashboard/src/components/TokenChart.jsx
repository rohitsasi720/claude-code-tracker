import React, { useState } from 'react';
import { fmtCost, fmtTokens } from '../lib/utils.js';

export default function TokenChart({ byDay = [] }) {
  const [hovered, setHovered] = useState(null);

  // Show last 30 days
  const days = byDay.slice(-30);
  const maxCost = Math.max(...days.map(d => d.cost), 0.000001);
  const today = new Date().toISOString().slice(0, 10);

  if (!days.length) {
    return <div style={{ color: 'var(--muted)', fontSize: 13 }}>No data yet.</div>;
  }

  const BAR_MIN_H = 2;
  const BAR_MAX_H = 80;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: BAR_MAX_H + 8 }}>
        {days.map((d, i) => {
          const isToday = d.date === today;
          const hasData = d.cost > 0;
          const intensity = hasData ? (d.cost / maxCost) : 0;
          const barH = hasData ? Math.max(BAR_MIN_H, Math.round(intensity * BAR_MAX_H)) : BAR_MIN_H;

          let barColor;
          if (!hasData) {
            barColor = 'var(--bg4)';
          } else if (isToday) {
            barColor = 'var(--accent)';
          } else {
            const alpha = 0.4 + intensity * 0.5;
            barColor = `rgba(var(--accent-rgb), ${alpha.toFixed(2)})`;
          }

          return (
            <div
              key={d.date}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', cursor: 'pointer' }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                style={{
                  height: barH,
                  background: barColor,
                  borderRadius: '2px 2px 0 0',
                  transition: 'opacity 0.15s',
                  opacity: hovered !== null && hovered !== i ? 0.6 : 1,
                  outline: isToday ? '1px solid var(--accent)' : 'none',
                  outlineOffset: 1,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
          {days[0]?.date ? new Date(days[0].date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : ''}
        </span>
        <span style={{ fontSize: 10, color: 'var(--accent)', fontFamily: 'var(--mono)' }}>today</span>
      </div>

      {/* Hover info */}
      <div style={{
        marginTop: 8,
        minHeight: 36,
        fontSize: 12,
        color: 'var(--muted)',
        fontFamily: 'var(--mono)',
      }}>
        {hovered !== null && days[hovered] ? (
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text)' }}>
              {new Date(days[hovered].date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
            </span>
            <span style={{ color: 'var(--accent)' }}>{fmtCost(days[hovered].cost)}</span>
            <span>in: {fmtTokens(days[hovered].input)}</span>
            <span>out: {fmtTokens(days[hovered].output)}</span>
            {days[hovered].cacheRead > 0 && <span>cache↓ {fmtTokens(days[hovered].cacheRead)}</span>}
          </div>
        ) : (
          <span>hover bar for details</span>
        )}
      </div>
    </div>
  );
}
