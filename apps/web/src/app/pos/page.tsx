'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Banknote, 
  User, 
  History,
  Play,
  Square,
  Package,
  CheckCircle2
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { clsx } from 'clsx';

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number; // For POS we assume a base price or latest price
}

interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

interface Session {
  id: string;
  status: string;
  openedAt: string;
}

export default function PosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD'>('CASH');
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const init = async () => {
      try {
        const [prodData, sessions] = await Promise.all([
          apiFetch('/inventory/products'),
          apiFetch('/pos/sessions')
        ]);
        setProducts(prodData);
        const active = sessions.find((s: any) => s.status === 'ACTIVE');
        if (active) setActiveSession(active);
      } catch (err) {
        console.error('POS Init failed', err);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { 
        productId: product.id, 
        name: product.name, 
        quantity: 1, 
        unitPrice: 1500 // Fallback price for demo
      }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const total = cart.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

  const handleOpenSession = async () => {
    try {
      const session = await apiFetch('/pos/sessions', {
        method: 'POST',
        body: JSON.stringify({ openingFloat: 5000 }) // Default opening float
      });
      setActiveSession(session);
    } catch (err) {
      alert('Failed to open session');
    }
  };

  const handleCheckout = async () => {
    if (!activeSession) return;
    try {
      await apiFetch(`/pos/sessions/${activeSession.id}/transactions`, {
        method: 'POST',
        body: JSON.stringify({
          paymentMethod,
          items: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice
          }))
        })
      });
      setCart([]);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      alert('Checkout failed: ' + (err as Error).message);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <div className="p-8">Loading POS Terminal...</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem', height: 'calc(100vh - 12rem)' }}>
      {/* Left Column: Product Selection */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search products by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glow-input"
              style={{ paddingLeft: '2.5rem', width: '100%' }}
            />
          </div>
          {!activeSession ? (
            <button onClick={handleOpenSession} className="glow-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
              <Play size={18} /> Open Session
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(34, 197, 94, 0.1)', color: 'var(--status-success)' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--status-success)', boxShadow: '0 0 8px var(--status-success)' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Active Session</span>
            </div>
          )}
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
          gap: '1rem', 
          overflowY: 'auto',
          padding: '2px'
        }}>
          {filteredProducts.map(product => (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={product.id}
              onClick={() => addToCart(product)}
              disabled={!activeSession}
              className="card"
              style={{ 
                textAlign: 'left', 
                padding: '1rem', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.5rem',
                opacity: activeSession ? 1 : 0.6,
                cursor: activeSession ? 'pointer' : 'not-allowed'
              }}
            >
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', width: 'fit-content' }}>
                <Package size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{product.sku}</div>
                <div style={{ fontWeight: 600, fontSize: '0.925rem', marginBottom: '0.25rem' }}>{product.name}</div>
                <div style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>Rs. 1,500</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Right Column: Cart & Checkout */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={20} color="var(--accent-primary)" />
            Current Order
          </h2>
          <button onClick={() => setCart([])} style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Clear All</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AnimatePresence>
            {cart.map(item => (
              <motion.div 
                key={item.productId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20 }}
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr auto', 
                  gap: '1rem', 
                  padding: '1rem', 
                  backgroundColor: 'var(--bg-primary)', 
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{item.name}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                    Rs. {(item.unitPrice * item.quantity).toLocaleString()}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button onClick={() => updateQuantity(item.productId, -1)} style={{ padding: '0.25rem', borderRadius: '4px', backgroundColor: 'var(--bg-secondary)' }}>
                    <Minus size={14} />
                  </button>
                  <span style={{ minWidth: '1.5rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: 600 }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, 1)} style={{ padding: '0.25rem', borderRadius: '4px', backgroundColor: 'var(--bg-secondary)' }}>
                    <Plus size={14} />
                  </button>
                  <button onClick={() => removeFromCart(item.productId)} style={{ marginLeft: '0.5rem', color: 'var(--status-error)' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {cart.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <div style={{ marginBottom: '1rem', opacity: 0.5 }}>
                <ShoppingBag size={48} style={{ margin: '0 auto' }} />
              </div>
              <p>Your cart is empty.</p>
              <p style={{ fontSize: '0.875rem' }}>Select products to start a sale.</p>
            </div>
          )}
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700 }}>
            <span>Total</span>
            <span style={{ color: 'var(--accent-primary)' }}>Rs. {total.toLocaleString()}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button 
              onClick={() => setPaymentMethod('CASH')}
              className={clsx("card", paymentMethod === 'CASH' && "active-card")}
              style={{ 
                padding: '1rem', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '0.5rem',
                border: paymentMethod === 'CASH' ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                boxShadow: paymentMethod === 'CASH' ? '0 0 10px rgba(59, 130, 246, 0.2)' : 'none'
              }}
            >
              <Banknote size={20} color={paymentMethod === 'CASH' ? 'var(--accent-primary)' : 'var(--text-secondary)'} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>CASH</span>
            </button>
            <button 
              onClick={() => setPaymentMethod('CARD')}
              className={clsx("card", paymentMethod === 'CARD' && "active-card")}
              style={{ 
                padding: '1rem', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '0.5rem',
                border: paymentMethod === 'CARD' ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                boxShadow: paymentMethod === 'CARD' ? '0 0 10px rgba(59, 130, 246, 0.2)' : 'none'
              }}
            >
              <CreditCard size={20} color={paymentMethod === 'CARD' ? 'var(--accent-primary)' : 'var(--text-secondary)'} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>CARD</span>
            </button>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || !activeSession}
            className="glow-btn" 
            style={{ 
              width: '100%', 
              padding: '1rem', 
              fontSize: '1rem', 
              fontWeight: 700,
              opacity: cart.length > 0 && activeSession ? 1 : 0.5,
              cursor: cart.length > 0 && activeSession ? 'pointer' : 'not-allowed'
            }}
          >
            Complete Sale
          </button>
        </div>

        {/* Success Overlay */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(10, 10, 15, 0.95)',
                backdropFilter: 'blur(8px)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                textAlign: 'center',
                padding: '2rem'
              }}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ color: 'var(--status-success)', marginBottom: '1.5rem' }}
              >
                <CheckCircle2 size={80} />
              </motion.div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Sale Successful!</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Inventory has been updated across the network.</p>
              <button onClick={() => setShowSuccess(false)} className="glow-btn" style={{ padding: '0.75rem 2rem' }}>New Sale</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
