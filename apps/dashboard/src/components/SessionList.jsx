import React, { useState, useEffect } from 'react';
import { useHistory } from '../hooks/useData.js';
import { fmt, projectName, colorFor, fmtTokens, fmtCost } from '../lib/utils.js';
import ConversationModal from './ConversationModal.jsx';

const PAGE = 40;

export default function SessionList({ projectFilter }) {
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [page, setPage] = useState(0);
  const [tab, setTab] = useState('all');
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedQ(q); setPage(0); }, 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => { setPage(0); }, [projectFilter, tab]);

  const params = {
    q: debouncedQ || undefined,
    project: projectFilter || undefined,
    limit: PAGE,
    offset: page * PAGE,
  };

  const { data, loading } = useHistory(params);
  const items = data?.items || [];
  const total = data?.total || 0;

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
  ];

  function exportCSV() {
    const rows = [['Prompt', 'Project', 'Timestamp', 'Session ID']];
    items.forEach(e => rows.push([
      `"${(e.prompt || '').replace(/"/g, '""')}"`,
      e.projectPath || '',
      e.timestamp || '',
      e.sessionId || '',
    ]));
    const blob = new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'claude-history.csv';
    a.click();
  }

  return (
    <div>
      {/* Tab row */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              fontSize: 12,
              padding: '5px 12px',
              borderRadius: 6,
              border: '1px solid',
              borderColor: tab === t.key ? 'var(--border2)' : 'var(--border)',
              background: tab === t.key ? 'var(--bg3)' : 'transparent',
              color: tab === t.key ? 'var(--text)' : 'var(--muted)',
              transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          onClick={exportCSV}
          style={{
            fontSize: 12,
            padding: '5px 12px',
            borderRadius: 6,
            border: '1px solid var(--border)',
            color: 'var(--muted)',
            transition: 'all 0.15s',
          }}
        >
          Export CSV
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Search prompts or project paths…"
        style={{
          width: '100%',
          padding: '8px 12px',
          background: 'var(--bg3)',
          border: '1px solid var(--border)',
          borderRadius: 7,
          color: 'var(--text)',
          fontSize: 13,
          marginBottom: 14,
          outline: 'none',
          fontFamily: 'var(--sans)',
          boxSizing: 'border-box',
        }}
      />

      {/* Count */}
      <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)', marginBottom: 10 }}>
        {loading ? 'loading…' : `${total.toLocaleString()} entries`}
        {projectFilter && <span style={{ color: 'var(--accent)', marginLeft: 8 }}>· {projectName(projectFilter)}</span>}
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((entry, i) => {
          const color = colorFor(entry.projectPath || '');
          const hasTokens = (entry.sessionTokens || 0) > 0;
          const hasCost = (entry.sessionCost || 0) > 0;
          const hasTools = (entry.sessionToolCalls || 0) > 0;
          const showMeta = hasTokens || hasCost || hasTools;

          return (
            <div
              key={`${entry.sessionId}-${i}`}
              onClick={() => entry.sessionId && setSelectedSessionId(entry.sessionId)}
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
                padding: '10px 12px',
                borderRadius: 8,
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                transition: 'border-color 0.15s',
                cursor: entry.sessionId ? 'pointer' : 'default',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{
                width: 3,
                alignSelf: 'stretch',
                borderRadius: 2,
                background: color,
                flexShrink: 0,
                opacity: 0.7,
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 13,
                  color: 'var(--text)',
                  lineHeight: 1.5,
                  marginBottom: 4,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {entry.prompt || <span style={{ color: 'var(--muted)' }}>(no prompt text)</span>}
                </div>
                <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)', flexWrap: 'wrap', marginBottom: showMeta ? 4 : 0 }}>
                  <span style={{ color }}>{projectName(entry.projectPath)}</span>
                  <span>{fmt(entry.timestamp)}</span>
                  {entry.sessionId && (
                    <span style={{ opacity: 0.5 }}>{entry.sessionId.slice(0, 8)}…</span>
                  )}
                </div>
                {showMeta && (
                  <div style={{ display: 'flex', gap: 8, fontSize: 10, color: 'var(--dim)', fontFamily: 'var(--mono)', flexWrap: 'wrap' }}>
                    {hasTokens && <span>{fmtTokens(entry.sessionTokens)} tok</span>}
                    {hasCost && hasTokens && <span style={{ opacity: 0.4 }}>·</span>}
                    {hasCost && <span>{fmtCost(entry.sessionCost)}</span>}
                    {hasTools && (hasTokens || hasCost) && <span style={{ opacity: 0.4 }}>·</span>}
                    {hasTools && <span>{entry.sessionToolCalls} tools</span>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {!loading && items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)', fontSize: 13 }}>
            No results found.
          </div>
        )}
      </div>

      {selectedSessionId && (
        <ConversationModal
          sessionId={selectedSessionId}
          onClose={() => setSelectedSessionId(null)}
        />
      )}

      {/* Pagination */}
      {total > PAGE && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
          <button
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              background: 'transparent',
              color: page === 0 ? 'var(--dim)' : 'var(--text)',
              fontSize: 12,
              cursor: page === 0 ? 'default' : 'pointer',
            }}
          >← prev</button>
          <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>
            {page * PAGE + 1}–{Math.min((page + 1) * PAGE, total)} of {total.toLocaleString()}
          </span>
          <button
            disabled={(page + 1) * PAGE >= total}
            onClick={() => setPage(p => p + 1)}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              background: 'transparent',
              color: (page + 1) * PAGE >= total ? 'var(--dim)' : 'var(--text)',
              fontSize: 12,
              cursor: (page + 1) * PAGE >= total ? 'default' : 'pointer',
            }}
          >next →</button>
        </div>
      )}
    </div>
  );
}
