'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'billing'>('profile');

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
              <input type="text" className={styles.input} defaultValue="Alex Johnson" />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <input type="email" className={styles.input} defaultValue="alex@example.com" />
            </div>

            <h2 className={styles.sectionTitle} style={{ marginTop: 24 }}>Professional Details</h2>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Primary Role</label>
              <select className={styles.select} defaultValue="frontend">
                <option value="frontend">Frontend Developer</option>
                <option value="backend">Backend Developer</option>
                <option value="fullstack">Full Stack Developer</option>
                <option value="designer">UX/UI Designer</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Default Skills to Include in Proposals</label>
              <textarea 
                className={styles.textarea} 
                defaultValue="React, TypeScript, Node.js, Next.js, TailwindCSS"
              />
              <span className={styles.helpText}>These will be automatically pre-filled in the generator.</span>
            </div>

            <div className={styles.actions}>
              <button className="btn btn-primary">Save Changes</button>
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
              <button className="btn btn-primary">Save Preferences</button>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className={`${styles.section} fade-in`}>
            <h2 className={styles.sectionTitle}>Current Plan</h2>
            
            <div className={styles.planCard}>
              <div className={styles.planHeader}>
                <div>
                  <h3 className={styles.planName}>Pro Plan</h3>
                  <p className={styles.planPrice}>$19 / month</p>
                </div>
                <span className="tag tag-accent">Active</span>
              </div>
              
              <ul className={styles.planFeatures}>
                <li><span className={styles.check}>✓</span> Unlimited AI proposals</li>
                <li><span className={styles.check}>✓</span> Full lead insights (budget, urgency)</li>
                <li><span className={styles.check}>✓</span> Priority early access to leads</li>
              </ul>
              
              <div className={styles.planActions}>
                <button className="btn btn-surface">Manage Subscription</button>
                <button className="btn btn-ghost" style={{ color: 'var(--danger)' }}>Cancel Plan</button>
              </div>
            </div>

            <h2 className={styles.sectionTitle} style={{ marginTop: 24 }}>Payment Methods</h2>
            
            <div className={styles.paymentMethod}>
              <div className={styles.cardIcon}>
                <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                  <rect width="24" height="16" rx="2" fill="#E6EDF3"/>
                  <rect y="3" width="24" height="3" fill="#121821"/>
                  <rect x="2" y="10" width="4" height="3" fill="#121821" opacity="0.3"/>
                  <rect x="7" y="10" width="3" height="3" fill="#121821" opacity="0.3"/>
                </svg>
              </div>
              <div className={styles.cardDetails}>
                <span className={styles.cardNumber}>Visa ending in 4242</span>
                <span className={styles.cardExp}>Expires 08/28</span>
              </div>
              <button className="btn btn-ghost btn-sm">Edit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
