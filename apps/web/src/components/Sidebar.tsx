'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Globe, 
  ShieldCheck, 
  Settings, 
  LogOut,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Package, label: 'Inventory', href: '/inventory' },
  { icon: ShoppingCart, label: 'Orders', href: '/orders' },
  { icon: Globe, label: 'Marketplace', href: '/marketplace' },
  { icon: ShieldCheck, label: 'Ecosystem', href: '/ecosystem' },
];

export const Sidebar = () => {
  const pathname = usePathname();

  // Don't show sidebar on login/register pages
  if (pathname === '/login' || pathname === '/register') return null;

  const handleLogout = () => {
    localStorage.removeItem('gs_token');
    window.location.href = '/login';
  };

  return (
    <aside className="sidebar">
      <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ 
          backgroundColor: 'var(--accent-primary)', 
          padding: '0.5rem', 
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Zap size={24} color="white" />
        </div>
        <span style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.03em' }}>
          Glow Shield
        </span>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={clsx('nav-item', isActive && 'active')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  transition: 'var(--transition-fast)',
                }}
              >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span style={{ fontWeight: isActive ? 500 : 400 }}>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    style={{
                      marginLeft: 'auto',
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent-primary)',
                      boxShadow: '0 0 8px var(--accent-glow)'
                    }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
        <Link href="/settings">
          <div className="nav-item" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            padding: '0.75rem 1rem', 
            color: 'var(--text-secondary)' 
          }}>
            <Settings size={20} />
            <span>Settings</span>
          </div>
        </Link>
        <button 
          onClick={handleLogout}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            padding: '0.75rem 1rem', 
            color: 'var(--status-error)', 
            width: '100%',
            textAlign: 'left'
          }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
