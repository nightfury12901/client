'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './layout.module.css';

const NAV_ITEMS = [
  {
    href: '/app/leads',
    label: 'Leads',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1.5" y="1.5" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M4.5 5.5h7M4.5 8h5M4.5 10.5h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/app/saved',
    label: 'Saved',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 2h10a1 1 0 011 1v11l-5-2.5L4 14V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: '/app/generate',
    label: 'Generate',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1.5l1.5 3.5 3.5.5-2.5 2.5.6 3.5L8 9.8l-3.1 1.7.6-3.5L3 5.5l3.5-.5L8 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: '/app/settings',
    label: 'Settings',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M8 1.5v1M8 13.5v1M1.5 8h1M13.5 8h1M3.2 3.2l.7.7M12.1 12.1l.7.7M12.1 3.9l-.7.7M3.9 12.1l-.7.7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`${styles.shell} ${collapsed ? styles.collapsed : ''}`}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <Link href="/" className={styles.brand}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="#4F9CF9" strokeWidth="1.5"/>
              <circle cx="10" cy="10" r="3" fill="#4F9CF9"/>
              <circle cx="10" cy="3.5" r="1.5" fill="#4F9CF9" opacity="0.5"/>
              <circle cx="16.5" cy="10" r="1.5" fill="#4F9CF9" opacity="0.5"/>
              <circle cx="10" cy="16.5" r="1.5" fill="#4F9CF9" opacity="0.5"/>
              <circle cx="3.5" cy="10" r="1.5" fill="#4F9CF9" opacity="0.5"/>
            </svg>
            {!collapsed && (
              <span className={styles.brandText}>
                ClientGravity
                <span className={styles.brandAi}>AI</span>
              </span>
            )}
          </Link>

          <button
            className={styles.collapseBtn}
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${active ? styles.navActive : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
                {active && <span className={styles.navIndicator} />}
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.userCard}>
            <div className={styles.avatar}>A</div>
            {!collapsed && (
              <div className={styles.userInfo}>
                <span className={styles.userName}>Alex Johnson</span>
                <span className={styles.userPlan}>Pro Plan</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
