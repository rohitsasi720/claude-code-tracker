import React, { useState, useEffect } from 'react';
import { useStats, useAnalytics } from './hooks/useData.js';
import MetricCard from './components/MetricCard.jsx';
import ActivityChart from './components/ActivityChart.jsx';
import HeatmapCalendar from './components/HeatmapCalendar.jsx';
import ProjectBars from './components/ProjectBars.jsx';
import SessionList from './components/SessionList.jsx';
import StatusBar from './components/StatusBar.jsx';
import TokenChart from './components/TokenChart.jsx';
import HourHeatmap from './components/HourHeatmap.jsx';
import ToolBreakdown from './components/ToolBreakdown.jsx';
import ModelBreakdown from './components/ModelBreakdown.jsx';
import FileHotspots from './components/FileHotspots.jsx';
import HeavySessions from './components/HeavySessions.jsx';
import ConversationModal from './components/ConversationModal.jsx';
import { fmtTokens, fmtCost } from './lib/utils.js';

const PANEL = {
  background: 'var(--bg2)',
  border: '1px solid var(--border)',
  borderRadius: 10,
  padding: '20px 22px',
};

const LABEL = {
  fontSize: 11,
  color: 'var(--muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontFamily: 'var(--mono)',
  marginBottom: 16,
};

export default function App() {
  const { data, loading, error, reload } = useStats();
  const { data: analytics, loading: analyticsLoading, reload: reloadAnalytics } = useAnalytics();
  const [projectFilter, setProjectFilter] = useState(null);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === 'visible') {
        reload();
        reloadAnalytics();
      }
    }
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [reload, reloadAnalytics]);

  const meta = data?.meta || {};
  const activity = data?.activity || [];
  const projects = data?.projects || [];

  const byDay = analytics?.tokens?.byDay || [];
  const hourDist = analytics?.hours?.distribution || [];
  const toolBreakdown = analytics?.tools?.breakdown || [];
  const totalToolCalls = analytics?.tools?.totalCalls || 0;
  const modelBreakdown = analytics?.models?.breakdown || [];
  const fileHotspots = analytics?.files?.hotspots || [];
  const heavySessions = analytics?.sessions?.heavy || [];
  const totalTokens = analytics
    ? (analytics.tokens.total.input + analytics.tokens.total.output)
    : 0;
  const estimatedCost = analytics?.cost?.total || 0;
  const cacheHitRate = analytics?.cache?.hitRate || 0;
  const streak = analytics?.streak?.current || meta.streak || 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Top nav */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: 52,
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="7" rx="1.5" fill="var(--accent)" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" fill="var(--accent)" opacity="0.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" fill="var(--accent)" opacity="0.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" fill="var(--accent)" opacity="0.8" />
          </svg>
          <span style={{ fontWeight: 500, fontSize: 14, letterSpacing: '-0.01em' }}>claude code tracker</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: error ? 'var(--red)' : loading ? 'var(--amber)' : 'var(--green)',
            animation: !loading && !error ? 'pulse-dot 2s infinite' : 'none',
          }} />
          <span>{error ? 'API error' : loading ? 'loading…' : 'live'}</span>
        </div>
      </div>

      {/* Status bar */}
      <StatusBar meta={meta} />

      {/* Main content */}
      <div style={{ flex: 1, padding: '24px', maxWidth: 1100, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {error && (
          <div style={{
            background: 'rgba(248,113,113,0.08)',
            border: '1px solid rgba(248,113,113,0.25)',
            borderRadius: 10,
            padding: '16px 20px',
            fontSize: 13,
            color: 'var(--red)',
            fontFamily: 'var(--mono)',
          }}>
            <div style={{ fontWeight: 500, marginBottom: 8 }}>Cannot connect to API</div>
            <div style={{ opacity: 0.7 }}>Make sure the API server is running: <code>npm run dev</code> from the repo root.</div>
            <div style={{ opacity: 0.5, marginTop: 4 }}>Error: {error}</div>
          </div>
        )}

        {/* Row 1: existing metric cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 12 }}>
          <MetricCard
            label="Total prompts"
            value={loading ? '…' : (meta.totalPrompts || 0).toLocaleString()}
            sub="all time"
            accent="var(--accent)"
          />
          <MetricCard
            label="Sessions"
            value={loading ? '…' : (meta.totalSessions || 0).toLocaleString()}
            sub="conversation threads"
          />
          <MetricCard
            label="Projects"
            value={loading ? '…' : (meta.totalProjects || 0).toLocaleString()}
            sub="unique codebases"
          />
          <MetricCard
            label="Active days"
            value={loading ? '…' : (meta.activeDays || 0).toLocaleString()}
            sub="days with activity"
            accent="var(--green)"
          />
        </div>

        {/* Row 2: analytics metric cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 12 }}>
          <MetricCard
            label="Total tokens"
            value={analyticsLoading ? '…' : fmtTokens(totalTokens)}
            sub="input + output"
            accent="var(--accent)"
          />
          <MetricCard
            label="Est. cost"
            value={analyticsLoading ? '…' : fmtCost(estimatedCost)}
            sub="all sessions"
            accent="var(--amber)"
          />
          <MetricCard
            label="Cache hit rate"
            value={analyticsLoading ? '…' : (cacheHitRate * 100).toFixed(1) + '%'}
            sub="reads / (reads + writes)"
          />
          <MetricCard
            label="Streak"
            value={analyticsLoading ? '…' : streak.toString()}
            sub="consecutive days"
            accent="var(--green)"
          />
        </div>

        {/* Row 3: TokenChart + HourHeatmap */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
          <div style={PANEL}>
            <div style={LABEL}>30-day cost</div>
            <TokenChart byDay={byDay} />
          </div>
          <div style={PANEL}>
            <div style={LABEL}>Hour of day</div>
            <HourHeatmap distribution={hourDist} />
          </div>
        </div>

        {/* Row 4: Activity + heatmap stacked | ProjectBars */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={PANEL}>
              <div style={LABEL}>30-day activity</div>
              <ActivityChart activity={activity} />
            </div>
            <div style={PANEL}>
              <div style={LABEL}>90-day heatmap</div>
              <HeatmapCalendar activity={activity} />
            </div>
          </div>

          <div style={PANEL}>
            <div style={{ ...LABEL, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Projects</span>
              {projectFilter && (
                <button
                  onClick={() => setProjectFilter(null)}
                  style={{ fontSize: 10, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  clear ✕
                </button>
              )}
            </div>
            <ProjectBars
              projects={projects}
              selected={projectFilter}
              onSelect={setProjectFilter}
            />
          </div>
        </div>

        {/* Row 5: ToolBreakdown + ModelBreakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={PANEL}>
            <div style={LABEL}>Tool usage</div>
            <ToolBreakdown breakdown={toolBreakdown} totalCalls={totalToolCalls} />
          </div>
          <div style={PANEL}>
            <div style={LABEL}>Models</div>
            <ModelBreakdown breakdown={modelBreakdown} />
          </div>
        </div>

        {/* Row 6: FileHotspots + HeavySessions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={PANEL}>
            <div style={LABEL}>File hotspots</div>
            <FileHotspots hotspots={fileHotspots} />
          </div>
          <div style={PANEL}>
            <div style={LABEL}>Heaviest sessions</div>
            <HeavySessions
              sessions={heavySessions}
              onSelect={setSelectedSessionId}
            />
          </div>
        </div>

        {/* Row 7: Session history */}
        <div style={PANEL}>
          <div style={LABEL}>Prompt history</div>
          <SessionList projectFilter={projectFilter} />
        </div>

      </div>

      {/* Conversation modal (from heavy sessions or session list) */}
      {selectedSessionId && (
        <ConversationModal
          sessionId={selectedSessionId}
          onClose={() => setSelectedSessionId(null)}
        />
      )}

      {/* Footer */}
      <div style={{
        borderTop: '1px solid var(--border)',
        padding: '12px 24px',
        fontSize: 11,
        color: 'var(--dim)',
        fontFamily: 'var(--mono)',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <span>claude-code-tracker · reads ~/.claude/</span>
        <span>api :3001 · dashboard :5173</span>
      </div>
    </div>
  );
}
