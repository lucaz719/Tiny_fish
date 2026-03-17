'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Search, 
  MessageSquare, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight,
  Info,
  Clock,
  ArrowRight,
  Filter,
  LogOut,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { clsx } from 'clsx';

interface Benchmark {
  id: string;
  productId: string;
  marketLow: number;
  marketMedian: number;
  marketHigh: number;
  sampleSize: number;
  calculatedAt: string;
  product?: {
    name: string;
    sku: string;
  };
}

interface Rfq {
  id: string;
  buyer: { name: string };
  seller: { name: string };
  product: { name: string; sku: string };
  quantity: number;
  status: string;
  createdAt: string;
}

export default function AnalyticsPage() {
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
  const [rfqs, setRfqs] = useState<Rfq[]>([]);
  const [reliability, setReliability] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('benchmarks');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Since we don't have a bulk benchmarks endpoint, we'll fetch products first
        // and then fetch benchmarks for them. For MVP, we'll fetch RFQs and a sample set of benchmarks.
        const [rfqData, products, relData] = await Promise.all([
          apiFetch('/intelligence/rfqs'),
          apiFetch('/inventory/products'),
          apiFetch('/intelligence/reliability')
        ]);
        setRfqs(rfqData);
        setReliability(relData);

        // Fetch benchmarks for first 5 products for demo
        const benchPromises = products.slice(0, 5).map((p: any) => 
          apiFetch(`/intelligence/benchmarks/${p.id}`).catch(() => null)
        );
        const benchData = (await Promise.all(benchPromises)).filter(b => b !== null);
        
        // Attach product info
        const enrichedBench = benchData.map((b, i) => ({
          ...b,
          product: { name: products[i].name, sku: products[i].sku }
        }));
        setBenchmarks(enrichedBench);

      } catch (err) {
        console.error('Failed to fetch analytics data', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'var(--status-warning)';
      case 'QUOTED': return 'var(--accent-primary)';
      case 'ACCEPTED': return 'var(--status-success)';
      case 'REJECTED': return 'var(--status-error)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Intelligence & Insights</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Cross-network pricing benchmarks and sourcing request management.</p>
      </header>

      {/* Reliability Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.02) 100%)' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-primary)' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fulfillment Rate</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{reliability?.fulfillmentRate?.toFixed(1) || '0.0'}%</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.02) 100%)' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(34, 197, 94, 0.2)', color: 'var(--status-success)' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trust Rating</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--status-success)' }}>{reliability?.rating?.toFixed(1) || '0.0'} / 5.0</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-secondary)' }}>
            <BarChart3 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pricing Tier</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>Optimized</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-subtle)' }}>
        {['benchmarks', 'sourcing requests'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab === 'benchmarks' ? 'benchmarks' : 'rfqs')}
            style={{
              padding: '1rem 0',
              fontSize: '1rem',
              fontWeight: activeTab === (tab === 'benchmarks' ? 'benchmarks' : 'rfqs') ? 600 : 400,
              color: activeTab === (tab === 'benchmarks' ? 'benchmarks' : 'rfqs') ? 'var(--accent-primary)' : 'var(--text-secondary)',
              position: 'relative',
              textTransform: 'capitalize'
            }}
          >
            {tab}
            {activeTab === (tab === 'benchmarks' ? 'benchmarks' : 'rfqs') && (
              <motion.div layoutId="anal-tab" style={{ position: 'absolute', bottom: '-1px', left: 0, right: 0, height: '2px', backgroundColor: 'var(--accent-primary)', boxShadow: '0 0 8px var(--accent-glow)' }} />
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ padding: '4rem', textAlign: 'center' }}>Loading Intelligence Data...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {activeTab === 'benchmarks' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
                <Info size={20} color="var(--accent-primary)" />
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Benchmarking data is aggregated from unified platform transactions. "Market Median" represents the fair market value based on the last 30 days of activity.
                </p>
              </div>

              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-secondary)' }}>
                      <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Product</th>
                      <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Market Low</th>
                      <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Market Median</th>
                      <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Market High</th>
                      <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Data Points</th>
                      <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Last Sync</th>
                    </tr>
                  </thead>
                  <tbody>
                    {benchmarks.map(b => (
                      <tr key={b.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '1.25rem 1.5rem' }}>
                          <div style={{ fontWeight: 600 }}>{b.product?.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.product?.sku}</div>
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem', color: 'var(--status-success)' }}>Rs. {Number(b.marketLow).toLocaleString()}</td>
                        <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700 }}>Rs. {Number(b.marketMedian).toLocaleString()}</td>
                        <td style={{ padding: '1.25rem 1.5rem', color: 'var(--status-error)' }}>Rs. {Number(b.marketHigh).toLocaleString()}</td>
                        <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)' }}>{b.sampleSize} txns</td>
                        <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Clock size={12} />
                            {new Date(b.calculatedAt).toLocaleDateString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {benchmarks.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                          No benchmarking data available yet. Start trading to populate insights.
                        </td>
                      </tr>
                    ) }
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
              {rfqs.map(rfq => (
                <div key={rfq.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ 
                      padding: '0.4rem 0.75rem', 
                      borderRadius: 'var(--radius-sm)', 
                      fontSize: '0.75rem', 
                      fontWeight: 700,
                      backgroundColor: `${getStatusColor(rfq.status)}20`,
                      color: getStatusColor(rfq.status),
                      border: `1px solid ${getStatusColor(rfq.status)}40`
                    }}>
                      {rfq.status}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Requested {new Date(rfq.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{rfq.product?.name}</h3>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Qty: {rfq.quantity} units</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Buyer</div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{rfq.buyer.name}</div>
                    </div>
                    <ArrowRight size={16} color="var(--text-muted)" />
                    <div style={{ flex: 1, textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Seller</div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{rfq.seller.name}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                    <button className="glow-btn" style={{ flex: 1, padding: '0.6rem', fontSize: '0.875rem' }}>Update Status</button>
                    <button className="card" style={{ flex: 1, padding: '0.6rem', fontSize: '0.875rem', border: '1px solid var(--border-subtle)' }}>View Thread</button>
                  </div>
                </div>
              ))}
              {rfqs.length === 0 && (
                <div className="card" style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center' }}>
                  <MessageSquare size={48} style={{ margin: '0 auto 1.5rem', color: 'var(--text-muted)', opacity: 0.5 }} />
                  <h3>No active RFQs</h3>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}> Sourcing requests allow you to bypass the marketplace and negotiate bulk rates directly with partners.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
