import React from 'react';
import { colorFor, projectName } from '../lib/utils.js';

export default function ProjectBars({ projects = [], onSelect, selected }) {
  if (!projects.length) return <div style={{ color: 'var(--muted)', fontSize: 13 }}>No project data.</div>;
  const max = Math.max(...projects.map(p => p.promptCount), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {projects.slice(0, 8).map(p => {
        const name = projectName(p.path);
        const color = colorFor(p.path);
        const isSelected = selected === p.path;
        return (
          <div
            key={p.path}
            onClick={() => onSelect && onSelect(isSelected ? null : p.path)}
            style={{ cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
              <span style={{
                color: isSelected ? color : 'var(--text)',
                fontFamily: 'var(--mono)',
                transition: 'color 0.15s',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: 160,
              }}>{name}</span>
              <span style={{ color: 'var(--muted)', fontFamily: 'var(--mono)' }}>{p.promptCount}</span>
            </div>
            <div style={{ height: 4, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.round(p.promptCount / max * 100)}%`,
                background: color,
                borderRadius: 2,
                opacity: isSelected ? 1 : 0.6,
                transition: 'width 0.5s ease, opacity 0.15s',
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
