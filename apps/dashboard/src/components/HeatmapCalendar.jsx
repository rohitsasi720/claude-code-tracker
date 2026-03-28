import React, { useState } from 'react';

const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

export default function HeatmapCalendar({ activity = [] }) {
  const [hovered, setHovered] = useState(null);
  if (!activity.length) return null;

  const max = Math.max(...activity.map(d => d.prompts), 1);
  const last90 = activity.slice(-90);

  // Pad to start on Monday
  const firstDate = new Date(last90[0]?.date);
  const dow = (firstDate.getDay() + 6) % 7; // 0=Mon
  const padded = [...Array(dow).fill(null), ...last90];

  const weeks = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }

  // Build month labels
  const monthLabels = [];
  weeks.forEach((week, wi) => {
    const firstReal = week.find(d => d);
    if (firstReal) {
      const d = new Date(firstReal.date);
      if (d.getDate() <= 7) {
        monthLabels.push({ wi, label: d.toLocaleDateString('en-GB', { month: 'short' }) });
      }
    }
  });

  function cellColor(d) {
    if (!d || d.prompts === 0) return 'var(--bg4)';
    const ratio = d.prompts / max;
    if (ratio < 0.25) return 'rgba(var(--accent-rgb), 0.25)';
    if (ratio < 0.5) return 'rgba(var(--accent-rgb), 0.5)';
    if (ratio < 0.75) return 'rgba(var(--accent-rgb), 0.75)';
    return 'var(--accent)';
  }

  const CELL = 11;
  const GAP = 2;

  return (
    <div>
      <div style={{ position: 'relative' }}>
        {/* Month labels */}
        <div style={{ display: 'flex', marginBottom: 4, paddingLeft: 24 }}>
          {weeks.map((_, wi) => {
            const ml = monthLabels.find(m => m.wi === wi);
            return (
              <div key={wi} style={{ width: CELL + GAP, fontSize: 9, color: 'var(--muted)', fontFamily: 'var(--mono)', flexShrink: 0 }}>
                {ml ? ml.label : ''}
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 0 }}>
          {/* Day labels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: GAP, marginRight: 4 }}>
            {DAYS.map((d, i) => (
              <div key={i} style={{ width: 18, height: CELL, fontSize: 9, color: 'var(--muted)', fontFamily: 'var(--mono)', display: 'flex', alignItems: 'center' }}>
                {d}
              </div>
            ))}
          </div>
          {/* Grid */}
          <div style={{ display: 'flex', gap: GAP }}>
            {weeks.map((week, wi) => (
              <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
                {Array.from({ length: 7 }).map((_, di) => {
                  const d = week[di] || null;
                  return (
                    <div
                      key={di}
                      onMouseEnter={() => d && setHovered(d)}
                      onMouseLeave={() => setHovered(null)}
                      title={d ? `${d.date}: ${d.prompts} prompts` : ''}
                      style={{
                        width: CELL,
                        height: CELL,
                        borderRadius: 2,
                        background: cellColor(d),
                        cursor: d ? 'default' : 'default',
                        transition: 'opacity 0.1s',
                        opacity: hovered && d && hovered.date !== d.date ? 0.5 : 1,
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      {hovered && (
        <div style={{ marginTop: 8, fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--mono)' }}>
          {hovered.date} · {hovered.prompts} prompts
        </div>
      )}
    </div>
  );
}
