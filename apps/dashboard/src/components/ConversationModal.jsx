import React, { useEffect, useRef } from 'react';
import { useConversation } from '../hooks/useData.js';

function ContentBlock({ block }) {
  if (!block || typeof block === 'string') {
    return <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{block}</span>;
  }

  if (block.type === 'text') {
    return (
      <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{block.text}</span>
    );
  }

  if (block.type === 'thinking') {
    return (
      <details style={{ marginTop: 4 }}>
        <summary style={{ fontSize: 11, color: 'var(--muted)', cursor: 'pointer', userSelect: 'none' }}>
          thinking…
        </summary>
        <div style={{ fontSize: 11, color: 'var(--muted)', whiteSpace: 'pre-wrap', marginTop: 6, fontFamily: 'var(--mono)', borderLeft: '2px solid var(--border)', paddingLeft: 8 }}>
          {block.thinking || '(empty)'}
        </div>
      </details>
    );
  }

  if (block.type === 'tool_use') {
    return (
      <div style={{
        marginTop: 8,
        border: '1px solid var(--border)',
        borderRadius: 6,
        overflow: 'hidden',
        fontSize: 12,
      }}>
        <div style={{
          background: 'var(--bg3)',
          padding: '5px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderBottom: '1px solid var(--border)',
        }}>
          <span style={{ color: '#e8a857', fontFamily: 'var(--mono)', fontWeight: 600 }}>⚙ {block.name}</span>
          <span style={{ color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: 10, opacity: 0.6 }}>{block.id}</span>
        </div>
        <div style={{ padding: '8px 10px', background: 'var(--bg2)' }}>
          <pre style={{
            margin: 0,
            fontFamily: 'var(--mono)',
            fontSize: 11,
            color: 'var(--text)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            overflowX: 'auto',
          }}>
            {JSON.stringify(block.input, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  if (block.type === 'tool_result') {
    const content = block.content;
    let text = '';
    if (typeof content === 'string') text = content;
    else if (Array.isArray(content)) {
      text = content.map(c => (typeof c === 'string' ? c : c?.text || JSON.stringify(c))).join('\n');
    } else if (content) {
      text = JSON.stringify(content, null, 2);
    }
    return (
      <div style={{
        marginTop: 8,
        border: '1px solid var(--border)',
        borderRadius: 6,
        overflow: 'hidden',
        fontSize: 12,
      }}>
        <div style={{
          background: 'var(--bg3)',
          padding: '5px 10px',
          borderBottom: '1px solid var(--border)',
          color: block.is_error ? '#e85757' : '#57b5e8',
          fontFamily: 'var(--mono)',
          fontWeight: 600,
          fontSize: 11,
        }}>
          {block.is_error ? '✗ tool_result (error)' : '✓ tool_result'}
          <span style={{ color: 'var(--muted)', marginLeft: 8, fontSize: 10, opacity: 0.6 }}>{block.tool_use_id}</span>
        </div>
        <div style={{ padding: '8px 10px', background: 'var(--bg2)' }}>
          <pre style={{
            margin: 0,
            fontFamily: 'var(--mono)',
            fontSize: 11,
            color: block.is_error ? '#e85757' : 'var(--text)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            maxHeight: 200,
            overflowY: 'auto',
          }}>
            {text || '(empty)'}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <pre style={{ fontSize: 11, fontFamily: 'var(--mono)', whiteSpace: 'pre-wrap', wordBreak: 'break-all', color: 'var(--muted)' }}>
      {JSON.stringify(block, null, 2)}
    </pre>
  );
}

function Message({ msg }) {
  if (!msg.message) return null;
  const { role, content } = msg.message;
  if (!role || !content) return null;

  const isUser = role === 'user';
  const blocks = Array.isArray(content) ? content : [{ type: 'text', text: content }];

  // Skip pure tool_result user messages that are just responses — show them inline
  // but we still want to show them if they contain actual text
  const hasOnlyToolResults = blocks.every(b => b.type === 'tool_result');

  return (
    <div style={{
      display: 'flex',
      gap: 10,
      marginBottom: 16,
    }}>
      <div style={{
        width: 28,
        height: 28,
        borderRadius: 6,
        background: isUser ? 'var(--bg3)' : '#2d3748',
        border: '1px solid var(--border)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        color: isUser ? 'var(--muted)' : '#57b5e8',
        fontFamily: 'var(--mono)',
        marginTop: 2,
      }}>
        {isUser ? 'U' : 'A'}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 11,
          color: 'var(--muted)',
          fontFamily: 'var(--mono)',
          marginBottom: 4,
          opacity: 0.7,
        }}>
          {isUser ? 'user' : 'assistant'}
          {msg.timestamp && (
            <span style={{ marginLeft: 8, opacity: 0.5 }}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          )}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
          {blocks.map((block, i) => (
            <ContentBlock key={i} block={block} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ConversationModal({ sessionId, onClose }) {
  const { data, loading, error } = useConversation(sessionId);
  const backdropRef = useRef(null);

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const messages = (data?.messages || []).filter(m =>
    m.type === 'user' || m.type === 'assistant'
  );

  return (
    <div
      ref={backdropRef}
      onClick={e => { if (e.target === backdropRef.current) onClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
    >
      <div style={{
        background: 'var(--bg)',
        border: '1px solid var(--border2)',
        borderRadius: 12,
        width: '100%',
        maxWidth: 760,
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Conversation</div>
            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', marginTop: 2 }}>
              {sessionId}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 6,
              color: 'var(--muted)',
              fontSize: 16,
              width: 30,
              height: 30,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}
          >×</button>
        </div>

        {/* Body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '18px',
        }}>
          {loading && (
            <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13, padding: '2rem' }}>
              Loading…
            </div>
          )}
          {error && (
            <div style={{ color: '#e85757', fontSize: 13, padding: '2rem', textAlign: 'center' }}>
              {error}
            </div>
          )}
          {!loading && !error && messages.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13, padding: '2rem' }}>
              No messages found.
            </div>
          )}
          {messages.map((msg, i) => (
            <Message key={msg.uuid || i} msg={msg} />
          ))}
        </div>

        {/* Footer */}
        {!loading && messages.length > 0 && (
          <div style={{
            borderTop: '1px solid var(--border)',
            padding: '10px 18px',
            fontSize: 11,
            color: 'var(--muted)',
            fontFamily: 'var(--mono)',
            flexShrink: 0,
          }}>
            {messages.length} messages
          </div>
        )}
      </div>
    </div>
  );
}
