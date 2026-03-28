import React, { useState } from 'react';

const HOUR_LABELS = {
  0: '12a',
  3: '3a',
  6: '6a',
  9: '9a',
  12: '12p',
  15: '3p',
  18: '6p',
  21: '9p',
};

function fmtHour(h) {
  if (h === 0) return '12am';
  if (h === 12) return '12pm';
  if (h < 12) return `${h}am`;
  return `${h - 12}pm`;
}

export default function HourHeatmap({ distribution = [] }) {
  const [hovered, setHovered] = useState(null);

  // Build array indexed by hour
  const counts = Array(24).fill(0);
  for (const { hour, count } of distribution) {
    counts[hour] = count;
  }
  const maxCount = Math.max(...counts, 1);

  return (
    <div>
      {/* Cells — flex:1 so they fill available width */}
      <div style={{ display: 'flex', gap: 2 }}>
        {counts.map((count, hour) => {
          const intensity = count / maxCount;
          const alpha = count === 0 ? 0 : 0.15 + intensity * 0.75;
          const bg = count === 0
            ? 'var(--bg4)'
            : `rgba(var(--accent-rgb), ${alpha.toFixed(2)})`;

          return (
            <div
              key={hour}
              onMouseEnter={() => setHovered(hour)}
              onMouseLeave={() => setHovered(null)}
              title={`${fmtHour(hour)}: ${count} events`}
              style={{
                flex: 1,
                height: 32,
                borderRadius: 3,
                background: bg,
                cursor: 'default',
                transition: 'opacity 0.15s',
                opacity: hovered !== null && hovered !== hour ? 0.6 : 1,
                border: hovered === hour ? '1px solid var(--accent)' : '1px solid transparent',
              }}
            />
          );
        })}
      </div>

      {/* Hour labels — at 0, 6, 12, 18 only to avoid crowding */}
      <div style={{ display: 'flex', marginTop: 4 }}>
        {counts.map((_, hour) => {
          const label = hour % 6 === 0 ? HOUR_LABELS[hour] : '';
          return (
            <div
              key={hour}
              style={{
                flex: 1,
                fontSize: 9,
                color: 'var(--dim)',
                fontFamily: 'var(--mono)',
                textAlign: 'left',
              }}
            >
              {label}
            </div>
          );
        })}
      </div>

      {/* Hover info */}
      <div style={{ minHeight: 20, fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--mono)', marginTop: 4 }}>
        {hovered !== null
          ? `${fmtHour(hovered)} · ${counts[hovered].toLocaleString()} events`
          : null}
      </div>
    </div>
  );
}
