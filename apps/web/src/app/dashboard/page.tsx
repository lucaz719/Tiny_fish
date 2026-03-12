'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ChevronRight,
  Zap
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="card"
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
      <div style={{ 
        padding: '0.5rem', 
        backgroundColor: 'rgba(59, 130, 246, 0.1)', 
        borderRadius: 'var(--radius-md)',
        color: 'var(--accent-primary)'
      }}>
        <Icon size={24} />
      </div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.25rem',
        color: trend === 'up' ? 'var(--status-success)' : 'var(--status-error)',
        fontSize: '0.875rem',
        fontWeight: 600
      }}>
        {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        {trendValue}
      </div>
    </div>
    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{title}</div>
    <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{value}</div>
  </motion.div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState({
    gmv: '$124,500',
    orders: '342',
    products: '1,204',
    alerts: '12'
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orders = await apiFetch('/orders');
        setRecentOrders(orders.slice(0, 5));
        
        // Mocking some stats derived from real data count
        setStats({
          gmv: `$${orders.reduce((acc: number, o: any) => acc + o.totalAmount, 0).toLocaleString()}`,
          orders: orders.length.toString(),
          products: '42', // Placeholder
          alerts: '3'
        });
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome to the Glow Shield control center.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <Clock size={16} />
            Last 30 Days
          </button>
        </div>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        <StatCard title="Total Revenue (GMV)" value={stats.gmv} icon={TrendingUp} trend="up" trendValue="+12.5%" delay={0.1} />
        <StatCard title="Fulfillment Orders" value={stats.orders} icon={ShoppingCart} trend="up" trendValue="+8.2%" delay={0.2} />
        <StatCard title="Active SKU Count" value={stats.products} icon={Package} trend="down" trendValue="-2.4%" delay={0.3} />
        <StatCard title="Critical Alerts" value={stats.alerts} icon={AlertTriangle} trend="up" trendValue="+4" delay={0.4} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Recent Orders Table */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
          style={{ padding: '0' }}
        >
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.125rem' }}>Recent Transactions</h3>
            <button style={{ color: 'var(--accent-primary)', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1rem 1.5rem' }}>Order ID</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Total</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? recentOrders.map((order: any) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.875rem' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{order.orderNumber}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.6rem', 
                        borderRadius: 'var(--radius-full)', 
                        fontSize: '0.75rem',
                        backgroundColor: order.status === 'CONFIRMED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: order.status === 'CONFIRMED' ? 'var(--status-success)' : 'var(--status-warning)'
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>${order.totalAmount.toLocaleString()}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No recent orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Sync Status / Activity */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Ecosystem Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--status-success)', boxShadow: '0 0 8px var(--status-success)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>TinyFish Sync Agent</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Synchronized 2 mins ago</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--status-success)', boxShadow: '0 0 8px var(--status-success)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>Webhook Dispatcher</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>All delivery points active</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--status-warning)', boxShadow: '0 0 8px var(--status-warning)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>Inventory Alerts</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>3 warehouses near capacity</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2.5rem', padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-primary)', border: '1px border var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Active Environment</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-secondary)' }}>
                <Zap size={16} />
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Mahi-Mahi Accelerator</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
