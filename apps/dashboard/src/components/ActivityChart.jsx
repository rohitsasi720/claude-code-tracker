import React, { useState } from 'react';

export default function ActivityChart({ activity = [] }) {
  const [hovered, setHovered] = useState(null);
  if (!activity.length) return null;

  const max = Math.max(...activity.map(d => d.prompts), 1);
  const last30 = activity.slice(-30);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 64 }}>
        {last30.map((d, i) => {
          const h = Math.max(2, Math.round((d.prompts / max) * 64));
          const isToday = i === last30.length - 1;
          return (
            <div
              key={d.date}
              title={`${d.date}: ${d.prompts} prompts`}
              onMouseEnter={() => setHovered(d)}
              onMouseLeave={() => setHovered(null)}
              style={{
                flex: 1,
                height: h,
                borderRadius: '2px 2px 0 0',
                background: d.prompts === 0
                  ? 'var(--bg4)'
                  : isToday
                    ? 'var(--accent)'
                    : `rgba(var(--accent-rgb), ${(0.35 + 0.65 * (d.prompts / max)).toFixed(2)})`,
                transition: 'opacity 0.15s',
                cursor: 'default',
                opacity: hovered && hovered.date !== d.date ? 0.5 : 1,
              }}
            />
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
        <span>{last30[0]?.date?.slice(5)}</span>
        {hovered && (
          <span style={{ color: 'var(--accent)' }}>
            {hovered.date} · {hovered.prompts} prompts
          </span>
        )}
        <span>today</span>
      </div>
    </div>
  );
}
