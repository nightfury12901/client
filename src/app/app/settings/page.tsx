'use client';

import { useState, useEffect } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import styles from './page.module.css';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'billing'>('profile');
  const [userData, setUserData] = useState({ name: '', email: '', role: '', skills: '' });
  const [subscription, setSubscription] = useState<{
    plan: string;
    status: string;
    periodEnd: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: profile, error: pError }, { data: sub, error: sError }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('subscriptions').select('*').eq('user_id', user.id).single()
      ]);

      if (pError) console.error('[Supabase Profile Error]:', pError);
      if (sError) console.error('[Supabase Subscription Error]:', sError);

      setUserData({
        name: profile?.full_name || '',
        email: user.email || '',
        role: profile?.skills?.[0] || 'frontend',
        skills: profile?.skills?.slice(1).join(', ') || ''
      });

      if (sub) {
        setSubscription({
          plan: sub.plan || 'free',
          status: sub.status || 'active',
          periodEnd: sub.current_period_end
        });
      }
      
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const supabase = createSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const allSkills = [userData.role, ...userData.skills.split(',').map(s => s.trim()).filter(Boolean)];

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: userData.name,
          email: userData.email,
          skills: allSkills
        })
        .eq('id', user.id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const getPlanFeatures = (plan: string) => {
    if (plan === 'pro') return ['Unlimited AI proposals', 'Full lead insights', 'Priority early access'];
    if (plan === 'agency') return ['Team access', 'API access', 'Custom AI models', 'White-labeling'];
    return ['5 AI proposals / month', 'Basic lead search', 'Community support'];
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>Manage your account and preferences</p>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'profile' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'preferences' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          Preferences
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'billing' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('billing')}
        >
          Billing
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'profile' && (
          <div className={`${styles.section} fade-in`}>
            <h2 className={styles.sectionTitle}>Personal Information</h2>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name</label>
              <input type="text" className={styles.input} value={userData.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })} placeholder="Enter your name" />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <input 
                type="email" 
                className={styles.input} 
                value={userData.email} 
                onChange={(e) => setUserData({ ...userData, email: e.target.value })} 
                placeholder="Enter your email" 
              />
              <span className={styles.helpText}>Required for sending test emails.</span>
            </div>

            <h2 className={styles.sectionTitle} style={{ marginTop: 24 }}>Professional Details</h2>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Primary Role</label>
              <input type="text" className={styles.input} value={userData.role} onChange={(e) => setUserData({ ...userData, role: e.target.value })} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Default Skills to Include in Proposals</label>
              <textarea 
                className={styles.textarea} 
                value={userData.skills}
                onChange={(e) => setUserData({ ...userData, skills: e.target.value })}
              />
              <span className={styles.helpText}>These will be automatically pre-filled in the generator.</span>
            </div>

            <div className={styles.actions}>
              {message.text && (
                <span style={{ color: message.type === 'error' ? '#ff5555' : '#4ade80', fontSize: '13px', marginRight: '16px' }}>
                  {message.text}
                </span>
              )}
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className={`${styles.section} fade-in`}>
            <h2 className={styles.sectionTitle}>Notification Preferences</h2>
            
            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <span className={styles.toggleLabel}>Email Notifications</span>
                <span className={styles.toggleDesc}>Receive daily digest of new high-match leads</span>
              </div>
              <label className={styles.switch}>
                <input type="checkbox" defaultChecked />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <span className={styles.toggleLabel}>Urgent Alerts</span>
                <span className={styles.toggleDesc}>Immediately notify me for leads marked as urgent</span>
              </div>
              <label className={styles.switch}>
                <input type="checkbox" defaultChecked />
                <span className={styles.slider}></span>
              </label>
            </div>

            <h2 className={styles.sectionTitle} style={{ marginTop: 24 }}>Generator Defaults</h2>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Default Tone</label>
              <select className={styles.select} defaultValue="confident">
                <option value="professional">Professional</option>
                <option value="confident">Confident</option>
                <option value="friendly">Friendly</option>
                <option value="brief">Brief</option>
              </select>
            </div>

            <div className={styles.actions}>
              <button className="btn btn-primary" onClick={async () => {
                if (!userData.email) {
                  alert('Please enter an email address first.');
                  return;
                }
                const res = await fetch('/api/email/welcome', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: userData.email, name: userData.name })
                });
                const data = await res.json();
                if (data.success) alert('Test email sent! Check your inbox.');
                else {
                  console.error('Email failed:', data.error);
                  alert('Error: ' + (data.error?.message || data.error || 'Failed to send. Check console for details.'));
                }
              }}>
                Send Test Email
              </button>
              <button className="btn btn-primary" style={{ marginLeft: '12px' }}>Save Preferences</button>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className={`${styles.section} fade-in`}>
            <h2 className={styles.sectionTitle}>Current Plan</h2>
            
            <div className={styles.planCard}>
              <div className={styles.planHeader}>
                <div>
                  <h3 className={styles.planName}>
                    {subscription?.plan ? subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1) : 'Free'} Plan
                  </h3>
                  <p className={styles.planPrice}>
                    {subscription?.plan === 'pro' ? '$19 / month' : subscription?.plan === 'agency' ? '$49 / month' : '$0 / month'}
                  </p>
                </div>
                <span className="tag tag-accent" style={{ background: subscription?.status === 'active' ? '#1dbf73' : 'rgba(255,255,255,0.1)' }}>
                  {subscription?.status ? subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1) : 'Active'}
                </span>
              </div>
              
              <ul className={styles.planFeatures}>
                {getPlanFeatures(subscription?.plan || 'free').map((feat, i) => (
                  <li key={i}><span className={styles.check}>✓</span> {feat}</li>
                ))}
              </ul>
              
              <div className={styles.planActions}>
                <button className="btn btn-surface">Manage Subscription</button>
                {subscription?.plan !== 'free' && (
                  <button className="btn btn-ghost" style={{ color: '#ff5555' }}>Cancel Plan</button>
                )}
              </div>
            </div>

            <h2 className={styles.sectionTitle} style={{ marginTop: 24 }}>Payment Methods</h2>
            
            <div className={styles.paymentMethod}>
              <div className={styles.cardIcon}>
                <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                  <rect width="24" height="16" rx="2" fill="rgba(255,255,255,0.1)"/>
                  <rect y="3" width="24" height="3" fill="rgba(255,255,255,0.2)"/>
                </svg>
              </div>
              <div className={styles.cardDetails}>
                <span className={styles.cardNumber}>No payment methods on file</span>
                <span className={styles.cardExp}>Upgrade to Pro to add a card</span>
              </div>
              <button className="btn btn-ghost btn-sm">Add</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
