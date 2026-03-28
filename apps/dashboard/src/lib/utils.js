export function fmt(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  const diff = Math.floor((Date.now() - d) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  const days = Math.floor(diff / 86400);
  if (days < 7) return days + 'd ago';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: days > 365 ? 'numeric' : undefined });
}

export function fmtDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function projectName(p) {
  return (p || '').split('/').filter(Boolean).pop() || p || 'unknown';
}

export const PALETTE = [
  '#e8956d', '#d4845a', '#c47040', '#e8b480',
  '#b86848', '#f0c888', '#a85840', '#d4a070',
];

export function colorFor(str) {
  let h = 0;
  for (let i = 0; i < (str || '').length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffffffff;
  return PALETTE[Math.abs(h) % PALETTE.length];
}

export function plural(n, word) {
  return `${n.toLocaleString()} ${word}${n === 1 ? '' : 's'}`;
}

export function fmtTokens(n) {
  if (!n && n !== 0) return '0';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

export function fmtCost(usd) {
  if (!usd && usd !== 0) return '$0';
  if (usd === 0) return '$0';
  if (usd < 0.001) return '$' + usd.toFixed(4);
  if (usd < 0.01) return '$' + usd.toFixed(4);
  if (usd < 0.1) return '$' + usd.toFixed(3);
  if (usd < 1) return '$' + usd.toFixed(3);
  if (usd < 10) return '$' + usd.toFixed(2);
  return '$' + usd.toFixed(2);
}

export function fmtDuration(ms) {
  if (!ms || ms < 1000) return '<1s';
  const totalSec = Math.floor(ms / 1000);
  const hours = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  if (hours > 0) return `${hours}h ${mins}m`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}
