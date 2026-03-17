'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Search, 
  Filter, 
  User, 
  Clock, 
  Database,
  ArrowRight,
  Eye,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { apiFetch } from '@/lib/api';

export default function AuditLogPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<any>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await apiFetch('/ecosystem/audit-logs');
        setLogs(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch audit logs', error);
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Activity className="text-indigo-500" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Audit Logs</h1>
            <p className="text-secondary text-sm">Transparent record of all platform activities and data changes</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search logs..." 
                    className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-indigo-500 w-64"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg text-sm text-secondary hover:text-primary transition-all">
                  <Filter size={16} /> Filter
                </button>
              </div>
              <div className="text-sm text-secondary">
                {logs.length} entries found
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs uppercase text-secondary border-b border-border">
                    <th className="px-4 py-3 font-medium">Timestamp</th>
                    <th className="px-4 py-3 font-medium">Actor</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                    <th className="px-4 py-3 font-medium">Entity</th>
                    <th className="px-4 py-3 font-medium">Details</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-border">
                  {loading ? (
                    <tr><td colSpan={5} className="py-8 text-center text-secondary">Loading audit records...</td></tr>
                  ) : logs.length === 0 ? (
                    <tr><td colSpan={5} className="py-8 text-center text-secondary">No audit logs found.</td></tr>
                  ) : logs.map((log) => (
                    <tr 
                      key={log.id} 
                      onClick={() => setSelectedLog(log)}
                      className={clsx(
                        "hover:bg-indigo-500/5 cursor-pointer transition-colors group",
                        selectedLog?.id === log.id && "bg-indigo-500/10"
                      )}
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium text-xs">{new Date(log.createdAt).toLocaleDateString()}</span>
                          <span className="text-[10px] text-secondary">{new Date(log.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                            <User size={12} />
                          </div>
                          <span className="text-xs truncate max-w-[120px]">{log.user?.email || 'System'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={clsx(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                          log.action === 'CREATE' && "bg-green-500/10 text-green-500",
                          log.action === 'UPDATE' && "bg-blue-500/10 text-blue-500",
                          log.action === 'DELETE' && "bg-red-500/10 text-red-500"
                        )}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <Database size={12} className="text-secondary" />
                          <span className="font-mono text-[11px]">{log.entityType}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <button className="text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card sticky top-24">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <FileText size={20} /> Record Details
            </h3>

            {selectedLog ? (
              <div className="space-y-6">
                <div>
                  <div className="text-xs text-secondary mb-1 uppercase tracking-wider font-bold">Impacted Entity</div>
                  <div className="p-3 rounded-lg bg-background border border-border flex items-center gap-3">
                    <Database className="text-indigo-500" size={18} />
                    <div>
                      <div className="text-xs font-semibold">{selectedLog.entityType}</div>
                      <div className="text-[10px] text-secondary font-mono">{selectedLog.entityId}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-background border border-border">
                    <div className="text-[10px] text-secondary mb-1">Old State</div>
                    <pre className="text-[10px] text-red-400 overflow-hidden text-ellipsis italic">
                      {selectedLog.oldValue ? JSON.stringify(selectedLog.oldValue, null, 2) : 'N/A'}
                    </pre>
                  </div>
                  <div className="p-3 rounded-xl bg-background border border-border">
                    <div className="text-[10px] text-secondary mb-1">New State</div>
                    <pre className="text-[10px] text-green-400 overflow-hidden text-ellipsis font-medium">
                      {selectedLog.newValue ? JSON.stringify(selectedLog.newValue, null, 2) : 'N/A'}
                    </pre>
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-secondary">IP Address</span>
                    <span className="font-mono">{selectedLog.ipAddress || '127.0.0.1'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-secondary">User Agent</span>
                    <span className="truncate max-w-[150px] text-right" title={selectedLog.userAgent}>{selectedLog.userAgent || 'Chrome/Next.js'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-secondary">
                <Clock size={48} className="mb-4 opacity-10" />
                <p className="text-sm">Select an entry to view the state diff</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .card {
          background: var(--surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          padding: 1.5rem;
        }
        .text-secondary {
          color: var(--text-secondary);
        }
        .bg-surface {
          background: var(--surface);
        }
        .bg-background {
          background: var(--background);
        }
      `}</style>
    </div>
  );
}
