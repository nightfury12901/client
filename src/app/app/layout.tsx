'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
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
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [userData, setUserData] = useState<{ name: string; plan: string }>({ name: '', plan: 'Free' });

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: profile }, { data: sub }] = await Promise.all([
        supabase.from('profiles').select('full_name').eq('id', user.id).single(),
        supabase.from('subscriptions').select('plan').eq('user_id', user.id).single()
      ]);

      setUserData({
        name: profile?.full_name || user.email?.split('@')[0] || 'User',
        plan: sub?.plan === 'pro' ? 'Pro Plan' : sub?.plan === 'agency' ? 'Agency Plan' : 'Free Plan'
      });
    };
    fetchUser();
  }, []);

  const avatarChar = userData.name ? userData.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className={`${styles.shell} ${collapsed ? styles.collapsed : ''}`}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <Link href="/" className={styles.brand}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect width="16" height="16" rx="2" fill="rgba(240,240,240,0.9)"/>
              <rect x="4" y="4" width="4" height="4" rx="0.5" fill="#0a0a0a"/>
              <rect x="4" y="9" width="8" height="1.5" rx="0.5" fill="#0a0a0a" opacity="0.4"/>
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
          <Link href="/app/profile" className={styles.userCard}>
            <div className={styles.avatar}>{avatarChar}</div>
            {!collapsed && (
              <div className={styles.userInfo}>
                <span className={styles.userName}>{userData.name || 'Loading...'}</span>
                <span className={styles.userPlan}>{userData.plan}</span>
              </div>
            )}
          </Link>
          <button className={styles.logoutBtn} onClick={handleLogout} title="Log out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            {!collapsed && <span>Log out</span>}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
