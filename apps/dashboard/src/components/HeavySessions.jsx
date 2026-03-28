import React from 'react';
import { colorFor, fmtCost, fmtTokens, fmtDuration } from '../lib/utils.js';

function shortModel(model) {
  if (!model) return '?';
  if (model.includes('opus')) return 'opus-' + (model.match(/\d+\.\d+/) || model.match(/\d+/))?.[0] || 'opus';
  if (model.includes('sonnet')) return 'sonnet-' + (model.match(/\d+\.\d+/) || model.match(/\d+/))?.[0] || 'sonnet';
  if (model.includes('haiku')) return 'haiku-' + (model.match(/\d+\.\d+/) || model.match(/\d+/))?.[0] || 'haiku';
  return model.slice(0, 12);
}

function projectName(p) {
  return (p || '').split('/').filter(Boolean).pop() || p || 'unknown';
}

function ModelBadge({ model }) {
  let bg = 'rgba(var(--accent-rgb), 0.12)';
  let color = 'var(--accent)';
  if (model && model.includes('opus')) { bg = 'rgba(232,168,64,0.15)'; color = 'var(--amber)'; }
  if (model && model.includes('haiku')) { bg = 'rgba(92,184,138,0.15)'; color = 'var(--green)'; }

  return (
    <span style={{
      fontSize: 9,
      fontFamily: 'var(--mono)',
      color,
      background: bg,
      borderRadius: 4,
      padding: '2px 5px',
      flexShrink: 0,
    }}>
      {shortModel(model)}
    </span>
  );
}

export default function HeavySessions({ sessions = [], onSelect }) {
  if (!sessions.length) {
    return <div style={{ color: 'var(--muted)', fontSize: 13 }}>No session data.</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {sessions.map((s) => {
        const color = colorFor(s.projectPath || '');
        const name = projectName(s.projectPath);

        return (
          <div
            key={s.sessionId}
            onClick={() => onSelect && onSelect(s.sessionId)}
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
              padding: '9px 11px',
              borderRadius: 8,
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              cursor: onSelect ? 'pointer' : 'default',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            {/* Project dot */}
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: color,
              flexShrink: 0,
              marginTop: 4,
            }} />

            {/* Main content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <span style={{ fontSize: 11, color, fontFamily: 'var(--mono)', flexShrink: 0 }}>{name}</span>
                <ModelBadge model={s.model} />
              </div>
              <div style={{
                fontSize: 12,
                color: 'var(--text)',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                marginBottom: 4,
                lineHeight: 1.4,
              }}>
                {s.prompt || <span style={{ color: 'var(--muted)' }}>(no prompt)</span>}
              </div>
              <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)', flexWrap: 'wrap' }}>
                <span>{fmtTokens(s.input + s.output)} tok</span>
                {s.toolCalls > 0 && <span>{s.toolCalls} tools</span>}
                {s.duration > 0 && <span>{fmtDuration(s.duration)}</span>}
              </div>
            </div>

            {/* Cost */}
            <div style={{ flexShrink: 0, textAlign: 'right' }}>
              <div style={{ fontSize: 13, color: 'var(--text)', fontFamily: 'var(--mono)', fontWeight: 500 }}>
                {fmtCost(s.cost)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
