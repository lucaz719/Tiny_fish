'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Package, 
  History, 
  Search, 
  FileText, 
  AlertTriangle,
  ChevronRight,
  User,
  Building2,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { apiFetch } from '@/lib/api';

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState<'batches' | 'licenses' | 'recalls'>('batches');
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [traceData, setTraceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In a real app, we'd fetch batches for a product. Let's fetch all (mocked backend support for now)
    // Or just show placeholders until a search is performed
  }, []);

  const handleTrace = async (batchId: string) => {
    setLoading(true);
    try {
      const data = await apiFetch(`/compliance/batches/${batchId}/trace`);
      setTraceData(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to trace batch', error);
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <ShieldCheck className="text-blue-500" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Compliance & Traceability</h1>
            <p className="text-secondary text-sm">Monitor batch custody and regulatory standards</p>
          </div>
        </div>
      </header>

      <div className="flex gap-4 mb-8">
        {(['batches', 'licenses', 'recalls'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              "px-4 py-2 rounded-lg transition-all",
              activeTab === tab 
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" 
                : "bg-surface text-secondary hover:text-primary"
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'batches' && (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Package size={20} /> Active Batches
                </h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search Batch #..." 
                    className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {/* Mock data for demonstration */}
                {[
                  { id: '1', number: 'B-2024-001', product: 'Glow Serum X', qty: 500, status: 'ACTIVE', expiry: '2025-12-01' },
                  { id: '2', number: 'B-2024-002', product: 'Vitamin C Complex', qty: 1200, status: 'ACTIVE', expiry: '2026-06-15' },
                  { id: '3', number: 'R-992-X', product: 'Moisturizer Ultra', qty: 0, status: 'RECALLED', expiry: '2024-03-10' },
                ].map((b) => (b.status === 'RECALLED' && activeTab === 'recalls') ? null : (
                  <motion.div 
                    key={b.id}
                    layoutId={b.id}
                    onClick={() => { setSelectedBatch(b); handleTrace(b.id); }}
                    className={clsx(
                      "p-4 rounded-xl border border-transparent hover:border-blue-500/30 bg-background/50 cursor-pointer transition-all",
                      selectedBatch?.id === b.id && "border-blue-500 bg-blue-500/5 shadow-inner"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={clsx(
                          "w-12 h-12 rounded-lg flex items-center justify-center",
                          b.status === 'RECALLED' ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"
                        )}>
                          {b.status === 'RECALLED' ? <AlertTriangle size={24} /> : <Package size={24} />}
                        </div>
                        <div>
                          <div className="font-medium">{b.number}</div>
                          <div className="text-xs text-secondary">{b.product}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{b.qty} Units</div>
                        <div className="text-xs text-secondary">Exp: {b.expiry}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'licenses' && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <FileText size={20} /> Regulatory Licenses
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { type: 'Manufacturer License', no: 'ML-88219-X', expiry: '2026-03-20', status: 'ACTIVE' },
                  { type: 'Wholesale Drug License', no: 'WDL-00112', expiry: '2025-01-15', status: 'WARN' },
                ].map((l, i) => (
                  <div key={i} className="p-4 rounded-xl bg-background/50 border border-border flex items-center gap-4">
                    <div className={clsx(
                      "p-2 rounded-lg",
                      l.status === 'ACTIVE' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                    )}>
                      <ShieldCheck size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{l.type}</div>
                      <div className="text-xs text-secondary">No: {l.no}</div>
                    </div>
                    <div className="text-xs font-medium px-2 py-1 rounded bg-background border border-border capitalize">
                      {l.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card h-full min-h-[400px]">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <History size={20} /> Chain of Custody
            </h3>
            
            {selectedBatch ? (
              <div className="relative pl-6 border-l-2 border-dashed border-border space-y-8">
                {/* Timeline rendering */}
                {[
                  { date: '2024-03-01', from: null, to: 'Producer Corp', qty: 500, doc: 'MFG-DOC-01' },
                  { date: '2024-03-05', from: 'Producer Corp', to: 'Global Logistics', qty: 500, doc: 'BOL-5512' },
                  { date: '2024-03-10', from: 'Global Logistics', to: 'Central Warehouse', qty: 250, doc: 'TRF-992' },
                ].map((step, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="relative group"
                  >
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-surface shadow-sm" />
                    <div className="mb-1 text-xs text-secondary font-medium flex items-center gap-1">
                      <Calendar size={12} /> {step.date}
                    </div>
                    <div className="p-3 rounded-lg bg-background/50 border border-border group-hover:border-blue-500/50 transition-colors">
                      <div className="flex items-center gap-2 text-sm mb-2">
                        {step.from && <span className="text-secondary">{step.from}</span>}
                        {step.from && <ChevronRight size={14} className="text-secondary" />}
                        <span className="font-semibold text-blue-400">{step.to}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-secondary">{step.qty} Units</span>
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 font-mono">{step.doc}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Visual End state */}
                <div className="text-center pt-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
                    <ShieldCheck size={14} /> Verified Chain of Custody
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center text-secondary">
                <Package size={48} className="mb-4 opacity-20" />
                <p>Select a batch to view transfer history</p>
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
          height: auto;
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
