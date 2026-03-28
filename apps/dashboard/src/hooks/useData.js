import { useState, useEffect, useCallback } from 'react';

const BASE = '';

async function apiFetch(path) {
  const res = await fetch(BASE + path);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export function useStats() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const d = await apiFetch('/api/stats');
      setData(d);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  return { data, loading, error, reload: load };
}

export function useHistory(params = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ''))
  ).toString();

  useEffect(() => {
    setLoading(true);
    apiFetch(`/api/history${qs ? '?' + qs : ''}`)
      .then(setData)
      .catch(() => setData({ total: 0, items: [] }))
      .finally(() => setLoading(false));
  }, [qs, tick]);

  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === 'visible') setTick(t => t + 1);
    }
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);

  return { data, loading };
}

export function useSessions() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/sessions')
      .then(setData)
      .catch(() => setData({ total: 0, items: [] }))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

export function useConversation(sessionId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) { setData(null); return; }
    setLoading(true);
    setError(null);
    apiFetch(`/api/conversation/${sessionId}`)
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [sessionId]);

  return { data, loading, error };
}

export function useProjects() {
  const [data, setData] = useState(null);
  useEffect(() => {
    apiFetch('/api/projects')
      .then(setData)
      .catch(() => setData({ items: [] }));
  }, []);
  return { data };
}

export function useAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const d = await apiFetch('/api/analytics');
      setData(d);
    } catch (e) {
      setError(e.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  return { data, loading, error, reload: load };
}
