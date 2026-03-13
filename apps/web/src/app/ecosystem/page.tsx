'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Key, 
  Webhook, 
  Activity,
  Plus,
  RefreshCw,
  Trash2,
  Copy,
  CheckCircle2,
  Clock,
  TerminalSquare
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function EcosystemPage() {
  const [activeTab, setActiveTab] = useState('keys'); // keys, webhooks, logs
  const [keys, setKeys] = useState([]);
  const [webhooks, setWebhooks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'keys') {
        const data = await apiFetch('/ecosystem/keys');
        setKeys(data);
      } else if (activeTab === 'webhooks') {
        const data = await apiFetch('/ecosystem/webhooks');
        setWebhooks(data);
      } else if (activeTab === 'logs') {
        const data = await apiFetch('/ecosystem/audit-logs');
        setLogs(data);
      }
    } catch (err) {
      console.error(`Failed to fetch ${activeTab}`, err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWebhook = async () => {
    // In a real app, this would open a modal to input URL and events
    try {
      await apiFetch('/ecosystem/webhooks', {
        method: 'POST',
        body: JSON.stringify({
          url: 'https://new-integration.acme.com/webhook',
          events: ['ORDER_CREATED', 'INVENTORY_UPDATED'],
          secret: 'default-secret-token'
        })
      });
      fetchData(); // refresh list
    } catch (err) {
      console.error('Failed to create webhook', err);
    }
  };

  const handleGenerateKey = async () => {
     try {
      await apiFetch('/ecosystem/keys', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Production Integration Key',
          scopes: ['orders:read', 'inventory:write']
        })
      });
      fetchData(); // refresh list
    } catch (err) {
      console.error('Failed to generate key', err);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Ecosystem & Integrations</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage API access, webhook endpoints, and view security audit logs.</p>
        </div>
        <div style={{ padding: '0.5rem 1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontSize: '0.875rem', fontWeight: 600 }}>
          <TerminalSquare size={16} />
          Developer Hub
        </div>
      </header>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '2rem', 
        marginBottom: '2rem', 
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '0.5rem'
      }}>
        {[
          { id: 'keys', label: 'API Keys', icon: Key },
          { id: 'webhooks', label: 'Webhooks', icon: Webhook },
          { id: 'logs', label: 'Audit Logs', icon: Activity }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1rem',
              fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
              position: 'relative',
              padding: '0.5rem 0'
            }}
          >
            <tab.icon size={18} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-ecosystem-tab"
                style={{
                  position: 'absolute',
                  bottom: '-0.5rem',
                  left: 0,
                  right: 0,
                  height: '2px',
                  backgroundColor: 'var(--accent-primary)',
                  boxShadow: '0 0 8px var(--accent-glow)'
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'keys' && (
          <motion.div 
            key="keys"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
               <button onClick={handleGenerateKey} className="glow-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={18} /> Generate New Key
              </button>
            </div>
            
            {isLoading ? (
               <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading keys...</div>
            ) : keys.length > 0 ? keys.map((key: any) => (
              <div key={key.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{key.name}</h3>
                    {key.isActive ? (
                       <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--status-success)', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)' }}>ACTIVE</span>
                    ) : (
                       <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--status-error)', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)' }}>REVOKED</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <span>Prefix: <code style={{ color: 'var(--accent-secondary)' }}>{key.prefix}...</code></span>
                    <span>Created: {new Date(key.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {key.scopes.map((scope: string) => (
                      <span key={scope} style={{ fontSize: '0.75rem', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)', padding: '0.1rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button style={{ padding: '0.5rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }} title="Roll Key">
                    <RefreshCw size={18} />
                  </button>
                  <button style={{ padding: '0.5rem', color: 'var(--status-error)', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }} title="Revoke">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )) : (
              <div className="card" style={{ padding: '4rem', textAlign: 'center' }}>
                <Key size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)' }} />
                <h3>No API Keys Associated</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Generate your first key to allow external systems to securely access your data.</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'webhooks' && (
          <motion.div 
            key="webhooks"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
               <button onClick={handleCreateWebhook} className="glow-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={18} /> Add Webhook Endpoint
              </button>
            </div>

            {isLoading ? (
               <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading webhooks...</div>
            ) : webhooks.length > 0 ? webhooks.map((hook: any) => (
              <div key={hook.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1.5rem' }}>
                <div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <code style={{ fontSize: '1rem', color: 'var(--text-primary)', backgroundColor: 'var(--bg-secondary)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>{hook.url}</code>
                    {hook.isActive ? (
                       <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--status-success)', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)' }}>ACTIVE</span>
                    ) : (
                       <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)' }}>DISABLED</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                    {hook.events.map((evt: string) => (
                      <span key={evt} style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '0.1rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                        {evt}
                      </span>
                    ))}
                  </div>
                </div>
                 <div style={{ display: 'flex', gap: '1rem' }}>
                  <button style={{ padding: '0.5rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }} title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )) : (
              <div className="card" style={{ padding: '4rem', textAlign: 'center' }}>
                <Webhook size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)' }} />
                <h3>No Webhooks Configured</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Set up endpoints to receive real-time updates about orders and inventory.</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'logs' && (
          <motion.div 
            key="logs"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="card"
            style={{ padding: '0' }}
          >
            <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1.25rem 1.5rem' }}>Timestamp</th>
                  <th style={{ padding: '1.25rem' }}>Action</th>
                  <th style={{ padding: '1.25rem' }}>Entity</th>
                  <th style={{ padding: '1.25rem' }}>Actor</th>
                  <th style={{ padding: '1.25rem 1.5rem' }}>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading logs...</td></tr>
                ) : logs.length > 0 ? logs.map((log: any) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.875rem' }}>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      <Clock size={14} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 500 }}>
                      <span style={{ 
                        color: log.action.includes('CREATE') ? 'var(--status-success)' : log.action.includes('DELETE') ? 'var(--status-error)' : 'var(--accent-primary)' 
                      }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.875rem' }}>{log.entityType}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.entityId.substring(0,8)}...</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.875rem' }}>{log.actorType}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.actorId.substring(0,8)}...</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                      {log.ipAddress || '192.168.1.1'}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No audit logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
