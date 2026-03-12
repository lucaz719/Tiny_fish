'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Warehouse, 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  ArrowRight,
  Boxes
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodData, whData] = await Promise.all([
          apiFetch('/inventory/products'),
          apiFetch('/inventory/warehouses')
        ]);
        setProducts(prodData);
        setWarehouses(whData);
      } catch (err) {
        console.error('Failed to fetch inventory data', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Inventory Control</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage products, warehouses, and global stock levels.</p>
        </div>
        <button className="glow-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} />
          Add New {activeTab === 'products' ? 'Product' : 'Warehouse'}
        </button>
      </header>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '2rem', 
        marginBottom: '2rem', 
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '0.5rem'
      }}>
        {['products', 'warehouses'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              fontSize: '1rem',
              fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? 'var(--accent-primary)' : 'var(--text-secondary)',
              position: 'relative',
              padding: '0.5rem 0',
              textTransform: 'capitalize'
            }}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="active-tab"
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
            placeholder={`Search ${activeTab}...`}
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
          Filters
        </button>
      </div>

      {/* Content Grid */}
      <AnimatePresence mode="wait">
        {activeTab === 'products' ? (
          <motion.div 
            key="products"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}
          >
            {products.length > 0 ? products.map((product: any) => (
              <div key={product.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    backgroundColor: 'rgba(59, 130, 246, 0.1)', 
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-primary)'
                  }}>
                    <Package size={24} />
                  </div>
                  <button style={{ color: 'var(--text-muted)' }}><MoreVertical size={20} /></button>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{product.sku}</div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{product.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.description || 'No description provided.'}
                  </p>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--status-success)', fontSize: '0.875rem', fontWeight: 600 }}>
                    <Boxes size={16} />
                    In Stock
                  </div>
                  <button style={{ color: 'var(--accent-primary)', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    Stock Details <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )) : (
              <div className="card" style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center' }}>
                <Package size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)' }} />
                <h3>No products found</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Get started by adding your first product to the catalog.</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="warehouses"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}
          >
            {warehouses.length > 0 ? warehouses.map((wh: any) => (
              <div key={wh.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    backgroundColor: 'rgba(139, 92, 246, 0.1)', 
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-secondary)'
                  }}>
                    <Warehouse size={24} />
                  </div>
                  <button style={{ color: 'var(--text-muted)' }}><MoreVertical size={20} /></button>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{wh.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{wh.location}</p>
                </div>
                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Storage Utilization</span>
                    <span style={{ fontWeight: 600 }}>68%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ width: '68%', height: '100%', backgroundColor: 'var(--accent-secondary)' }} />
                  </div>
                </div>
              </div>
            )) : (
              <div className="card" style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center' }}>
                <Warehouse size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)' }} />
                <h3>No warehouses found</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Add your storage facilities to start managing localized inventory.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
