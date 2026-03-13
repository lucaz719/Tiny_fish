'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  Search, 
  Filter,
  ShoppingCart,
  Star,
  ShieldCheck,
  Building,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function MarketplacePage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('ALL');

  useEffect(() => {
    fetchMarketplaceData();
  }, [category]); // Refetch on category change

  const fetchMarketplaceData = async () => {
    setIsLoading(true);
    try {
      // Mock category filtering in the query string
      const query = new URLSearchParams();
      if (searchQuery) query.append('query', searchQuery);
      
      // In a real app we'd pass category, but our search endpoint expects 'query'
      const data = await apiFetch(`/marketplace/search?${query.toString()}`);
      
      // Filter locally for the sake of the demo if categories were assigned
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch marketplace data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMarketplaceData();
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Global Marketplace</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Discover products and components from verified vendors across the network.</p>
        </div>
        <div style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--status-success)', fontSize: '0.875rem', fontWeight: 600 }}>
          <Globe size={16} />
          Network Active
        </div>
      </header>

      {/* Hero Search Section */}
      <div className="card" style={{ padding: '3rem', marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', backgroundImage: 'radial-gradient(ellipse at top, rgba(139, 92, 246, 0.15), transparent 70%)' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontWeight: 600 }}>What are you sourcing today?</h2>
        <form onSubmit={handleSearch} style={{ width: '100%', maxWidth: '600px', position: 'relative' }}>
          <Search size={22} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for microcontrollers, sensors, bulk materials..."
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--accent-secondary)',
              borderRadius: 'var(--radius-full)',
              padding: '1.25rem 1.5rem 1.25rem 3.5rem',
              color: 'white',
              fontSize: '1rem',
              outline: 'none',
              boxShadow: '0 0 20px rgba(139, 92, 246, 0.15)'
            }}
          />
          <button 
            type="submit"
            className="glow-btn" 
            style={{ position: 'absolute', right: '0.5rem', top: '0.5rem', bottom: '0.5rem', padding: '0 1.5rem', borderRadius: 'var(--radius-full)' }}
          >
            Search
          </button>
        </form>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['ALL', 'Electronics', 'Materials', 'Machinery', 'Software'].map(cat => (
             <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '0.35rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.875rem',
                backgroundColor: category === cat ? 'var(--text-primary)' : 'var(--bg-secondary)',
                color: category === cat ? 'var(--bg-primary)' : 'var(--text-secondary)',
                border: '1px solid',
                borderColor: category === cat ? 'var(--text-primary)' : 'var(--border-subtle)',
                transition: 'var(--transition-fast)'
              }}
             >
               {cat}
             </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem' }}>Top Results {category !== 'ALL' && `for ${category}`}</h3>
        <button className="card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
          <Filter size={16} />
          Filter & Sort
        </button>
      </div>

      {/* Product Grid */}
      <AnimatePresence>
        {isLoading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Searching network...</div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="product-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}
          >
            {products.length > 0 ? products.map((product: any, idx: number) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="card" 
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}
              >
                {/* Product Image Placeholder */}
                <div style={{ 
                  height: '160px', 
                  backgroundColor: 'var(--bg-secondary)', 
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.5rem',
                  backgroundImage: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.05) 0%, transparent 70%)'
                }}>
                  <Globe size={48} color="var(--text-muted)" opacity={0.2} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.3 }}>{product.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--status-warning)', fontSize: '0.875rem', fontWeight: 600 }}>
                    <Star size={14} fill="currentColor" />
                    4.8
                  </div>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {product.description || 'Premium component sourced directly from verified manufacturer.'}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <Building size={14} />
                  <span>Vendor ID: {product.tenantId.substring(0,8)}</span>
                  <ShieldCheck size={14} color="var(--status-success)" style={{ marginLeft: 'auto' }} />
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
                      ${product.price?.toLocaleString() || 'Contact'}
                    </div>
                    {product.quantity > 0 ? (
                      <div style={{ fontSize: '0.75rem', color: 'var(--status-success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                         <TrendingUp size={12} /> {product.quantity} units available
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.75rem', color: 'var(--status-error)' }}>Out of stock</div>
                    )}
                  </div>
                  
                  <button className="glow-btn" style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)' }} disabled={product.quantity <= 0}>
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </motion.div>
            )) : (
               <div style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center' }} className="card">
                 <Globe size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)' }} />
                 <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No products found</h3>
                 <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search criteria or broadening your query.</p>
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
