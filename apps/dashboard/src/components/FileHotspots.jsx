import React from 'react';

function getFileParts(filePath) {
  const parts = filePath.split('/').filter(Boolean);
  const filename = parts[parts.length - 1] || filePath;
  const parent = parts.length >= 3
    ? parts.slice(-3, -1).join('/')
    : parts.length >= 2
      ? parts.slice(-2, -1).join('/')
      : '';
  return { filename, parent };
}

export default function FileHotspots({ hotspots = [] }) {
  if (!hotspots.length) {
    return <div style={{ color: 'var(--muted)', fontSize: 13 }}>No file access data.</div>;
  }

  const top = hotspots.slice(0, 15);
  const maxCount = top[0]?.count || 1;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      maxHeight: 320,
      overflowY: 'auto',
      paddingRight: 4,
    }}>
      {top.map(({ path: filePath, count }) => {
        const { filename, parent } = getFileParts(filePath);
        const pct = Math.round((count / maxCount) * 100);

        return (
          <div key={filePath} title={filePath}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{
                  fontSize: 12,
                  color: 'var(--text)',
                  fontFamily: 'var(--mono)',
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>{filename}</span>
                {parent && (
                  <span style={{
                    fontSize: 10,
                    color: 'var(--muted)',
                    fontFamily: 'var(--mono)',
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>{parent}</span>
                )}
              </div>
              <span style={{
                fontSize: 11,
                color: 'var(--muted)',
                fontFamily: 'var(--mono)',
                flexShrink: 0,
              }}>{count}</span>
            </div>
            <div style={{ height: 3, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${pct}%`,
                background: 'rgba(var(--accent-rgb), 0.5)',
                borderRadius: 2,
                transition: 'width 0.4s ease',
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
