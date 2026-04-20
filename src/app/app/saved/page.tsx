'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LEADS, TAG_CONFIG, Lead } from '@/lib/data';
import styles from './page.module.css';

export default function SavedPage() {
  const [saved, setSaved] = useState<Lead[]>(LEADS.filter(l => l.saved));

  const handleUnsave = (id: string) => {
    setSaved(prev => prev.filter(l => l.id !== id));
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Saved Leads</h1>
          <p className={styles.subtitle}>{saved.length} lead{saved.length !== 1 ? 's' : ''} saved</p>
        </div>
      </div>

      {saved.length === 0 ? (
        <div className={styles.empty}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M12 6h24a3 3 0 013 3v33l-15-7.5L9 42V9a3 3 0 013-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.2"/>
          </svg>
          <p className={styles.emptyTitle}>No saved leads yet</p>
          <p className={styles.emptyDesc}>Save leads from the Leads page to revisit them here.</p>
          <Link href="/app/leads" className="btn btn-primary btn-sm" style={{ marginTop: 8 }}>
            Browse Leads
          </Link>
        </div>
      ) : (
        <div className={styles.list}>
          {saved.map((lead, i) => (
            <div
              key={lead.id}
              className={styles.card}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className={styles.cardTop}>
                <div className={styles.cardLeft}>
                  <div className={styles.scoreChip} style={{
                    color: lead.score >= 85 ? 'var(--success)' : lead.score >= 70 ? 'var(--warning)' : 'var(--text-muted)',
                    background: lead.score >= 85 ? 'var(--success-dim)' : lead.score >= 70 ? 'var(--warning-dim)' : 'var(--border)',
                  }}>
                    {lead.score}
                  </div>
                  <div>
                    <h3 className={styles.cardTitle}>{lead.title}</h3>
                    <div className={styles.cardMeta}>
                      <span>{lead.client}</span>
                      <span className={styles.dot}>·</span>
                      <span>{lead.platform}</span>
                      <span className={styles.dot}>·</span>
                      <span className={styles.budget}>{lead.budget}</span>
                    </div>
                  </div>
                </div>
                <button
                  className={styles.unsaveBtn}
                  onClick={() => handleUnsave(lead.id)}
                  title="Remove from saved"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <path d="M3 1.5h8a1 1 0 011 1v9.5L7 9.5l-5 2.5V2.5a1 1 0 011-1z"/>
                  </svg>
                </button>
              </div>

              <p className={styles.cardDesc}>{lead.description}</p>

              <div className={styles.cardFooter}>
                <div className={styles.tags}>
                  {lead.tags.map(tag => (
                    <span key={tag} className={`tag ${TAG_CONFIG[tag].cls}`}>
                      {TAG_CONFIG[tag].label}
                    </span>
                  ))}
                </div>
                <div className={styles.cardActions}>
                  <Link href={`/app/leads`} className="btn btn-ghost btn-sm">
                    View Details
                  </Link>
                  <Link href={`/app/generate?leadId=${lead.id}`} className="btn btn-primary btn-sm">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1L7.5 5H11.5L8.5 7L9.5 11L6 9L2.5 11L3.5 7L0.5 5H4.5L6 1Z" fill="currentColor"/>
                    </svg>
                    Generate Proposal
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
