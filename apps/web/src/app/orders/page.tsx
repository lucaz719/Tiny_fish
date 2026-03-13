'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Search, 
  Filter,
  MoreVertical,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
  User,
  Package
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, CONFIRMED, SHIPPED, DELIVERED

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch('/orders');
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await apiFetch(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      // Optimistic update
      setOrders(orders.map((o: any) => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return { bg: 'rgba(245, 158, 11, 0.1)', text: 'var(--status-warning)', icon: <Clock size={14} /> };
      case 'CONFIRMED': return { bg: 'rgba(59, 130, 246, 0.1)', text: 'var(--accent-primary)', icon: <CheckCircle2 size={14} /> };
      case 'SHIPPED': return { bg: 'rgba(139, 92, 246, 0.1)', text: 'var(--accent-secondary)', icon: <Truck size={14} /> };
      case 'DELIVERED': return { bg: 'rgba(16, 185, 129, 0.1)', text: 'var(--status-success)', icon: <CheckCircle2 size={14} /> };
      case 'CANCELLED': return { bg: 'rgba(239, 68, 68, 0.1)', text: 'var(--status-error)', icon: <Clock size={14} /> };
      default: return { bg: 'var(--bg-primary)', text: 'var(--text-secondary)', icon: <Clock size={14} /> };
    }
  };

  const filteredOrders = filter === 'ALL' ? orders : orders.filter((o: any) => o.status === filter);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Order Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>B2B transactions, fulfillments, and status tracking.</p>
        </div>
        <button className="glow-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShoppingCart size={20} />
          Create Order
        </button>
      </header>

      {/* Tabs / Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '2rem', 
        marginBottom: '2rem', 
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '0.5rem',
        overflowX: 'auto'
      }}>
        {['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              fontSize: '0.875rem',
              fontWeight: filter === tab ? 600 : 400,
              color: filter === tab ? 'var(--accent-primary)' : 'var(--text-secondary)',
              position: 'relative',
              padding: '0.5rem 0',
              textTransform: 'capitalize',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.toLowerCase()}
            {filter === tab && (
              <motion.div
                layoutId="active-order-tab"
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

      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by Order ID, Buyer, or SKU..."
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem 0.75rem 2.5rem',
              color: 'white',
              outline: 'none'
            }}
          />
        </div>
        <button className="card" style={{ padding: '0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} />
          More Filters
        </button>
      </div>

      {/* Orders List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <AnimatePresence>
          {isLoading ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading orders...</div>
          ) : filteredOrders.length > 0 ? filteredOrders.map((order: any) => {
            const statusStyle = getStatusColor(order.status);
            return (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="card" 
                style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{order.orderNumber}</h3>
                      <span style={{ 
                        display: 'flex', alignItems: 'center', gap: '0.25rem',
                        padding: '0.25rem 0.75rem', 
                        borderRadius: 'var(--radius-full)', 
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.text
                      }}>
                        {statusStyle.icon}
                        {order.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Clock size={14} /> {new Date(order.createdAt).toLocaleString()}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><User size={14} /> Buyer ID: {order.buyerTenantId.substring(0,8)}...</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      ${order.totalAmount.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.items?.length || 0} items</div>
                  </div>
                </div>

                {/* Items Preview */}
                <div style={{ backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', gap: '1rem', overflowX: 'auto' }}>
                  {order.items?.map((item: any) => (
                    <div key={item.id} style={{ minWidth: '200px', display: 'flex', gap: '0.75rem', alignItems: 'center', borderRight: '1px solid var(--border-subtle)', paddingRight: '1rem' }}>
                      <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                        <Package size={16} color="var(--accent-primary)" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.product.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Qty: {item.quantity} × ${item.unitPrice}</div>
                      </div>
                    </div>
                  ))}
                  {(!order.items || order.items.length === 0) && (
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Item details loading...</span>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {order.status === 'PENDING' && (
                      <button onClick={() => updateOrderStatus(order.id, 'CONFIRMED')} className="glow-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                        Confirm Order
                      </button>
                    )}
                    {order.status === 'CONFIRMED' && (
                      <button onClick={() => updateOrderStatus(order.id, 'SHIPPED')} className="glow-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                        Mark as Shipped
                      </button>
                    )}
                    {order.status === 'SHIPPED' && (
                      <button onClick={() => updateOrderStatus(order.id, 'DELIVERED')} className="glow-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                        Confirm Delivery
                      </button>
                    )}
                  </div>
                  <button style={{ color: 'var(--accent-primary)', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    View Full Details <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            );
          }) : (
             <div className="card" style={{ padding: '4rem', textAlign: 'center' }}>
               <ShoppingCart size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)' }} />
               <h3>No orders found</h3>
               <p style={{ color: 'var(--text-secondary)' }}>There are no {filter !== 'ALL' ? filter.toLowerCase() : ''} transactions matching your criteria.</p>
             </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
