'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LEADS, TAG_CONFIG, Lead } from '@/lib/data';
import styles from './page.module.css';

function ScoreRing({ score }: { score: number }) {
  const color = score >= 85 ? '#3FB68A' : score >= 70 ? '#F5A623' : '#8B949E';
  return (
    <div className={styles.scoreRing} style={{ '--score-color': color } as React.CSSProperties}>
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
        <circle cx="19" cy="19" r="16" stroke="var(--bg-elevated)" strokeWidth="3"/>
        <circle
          cx="19" cy="19" r="16"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={`${(score / 100) * 100.5} 100.5`}
          strokeDashoffset="25"
          strokeLinecap="round"
          transform="rotate(-90 19 19)"
        />
      </svg>
      <span className={styles.scoreNum} style={{ color }}>{score}</span>
    </div>
  );
}

function LeadRow({ lead, active, onClick }: { lead: Lead; active: boolean; onClick: () => void }) {
  return (
    <div
      className={`${styles.leadRow} ${active ? styles.leadRowActive : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      <ScoreRing score={lead.score} />
      <div className={styles.leadMain}>
        <div className={styles.leadHeader}>
          <h3 className={styles.leadTitle}>{lead.title}</h3>
          <span className={styles.leadBudget}>{lead.budget}</span>
        </div>
        <p className={styles.leadDesc}>{lead.description}</p>
        <div className={styles.leadMeta}>
          <span className={styles.leadPlatform}>{lead.platform}</span>
          <span className={styles.leadDot}>·</span>
          <span className={styles.leadPosted}>{lead.posted}</span>
          <div className={styles.leadTags}>
            {lead.tags.slice(0, 2).map(tag => (
              <span key={tag} className={`tag ${TAG_CONFIG[tag].cls}`}>
                {TAG_CONFIG[tag].label}
              </span>
            ))}
          </div>
        </div>
      </div>
      {lead.saved && (
        <svg className={styles.savedIcon} width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <path d="M3 1h8a1 1 0 011 1v10l-4-2-4 2V2a1 1 0 011-1z"/>
        </svg>
      )}
    </div>
  );
}

function LeadDetailPanel({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const [saved, setSaved] = useState(lead.saved ?? false);
  const scoreColor = lead.score >= 85 ? 'var(--success)' : lead.score >= 70 ? 'var(--warning)' : 'var(--text-muted)';

  return (
    <div className={`${styles.detailPanel} slide-in`}>
      <div className={styles.detailHeader}>
        <button className={styles.closeBtn} onClick={onClose} title="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </button>
        <div className={styles.detailActions}>
          <button
            className={`btn btn-ghost btn-sm ${saved ? styles.savedActive : ''}`}
            onClick={() => setSaved(s => !s)}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.3">
              <path d="M2.5 1.5h8a1 1 0 011 1v9L6.5 9l-5 2.5v-9a1 1 0 011-1z"/>
            </svg>
            {saved ? 'Saved' : 'Save'}
          </button>
          <Link href={`/app/generate?leadId=${lead.id}`} className="btn btn-primary btn-sm">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 1L8 5H12L9 7.5L10 11.5L6.5 9.5L3 11.5L4 7.5L1 5H5L6.5 1Z" fill="currentColor"/>
            </svg>
            Generate Proposal
          </Link>
        </div>
      </div>

      <div className={styles.detailContent}>
        {/* Score bar */}
        <div className={styles.scoreBar}>
          <div className={styles.scoreBarLeft}>
            <span className={styles.scoreLabel}>AI Match Score</span>
            <div className={styles.scoreBarTrack}>
              <div
                className={styles.scoreBarFill}
                style={{ width: `${lead.score}%`, background: scoreColor }}
              />
            </div>
          </div>
          <span className={styles.scoreBig} style={{ color: scoreColor }}>{lead.score}/100</span>
        </div>

        {/* Title + meta */}
        <h1 className={styles.detailTitle}>{lead.title}</h1>
        <div className={styles.detailMetaRow}>
          <span className={`tag tag-muted`}>{lead.platform}</span>
          <span className={styles.detailClient}>{lead.client}</span>
          <span className={styles.leadPosted}>{lead.posted}</span>
          <span className={styles.detailBudget}>{lead.budget}</span>
        </div>

        <div className={styles.detailTags}>
          {lead.tags.map(tag => (
            <span key={tag} className={`tag ${TAG_CONFIG[tag].cls}`}>
              {TAG_CONFIG[tag].label}
            </span>
          ))}
        </div>

        {/* Description */}
        <div className={styles.detailSection}>
          <h4 className={styles.detailSectionTitle}>Job Description</h4>
          <p className={styles.detailDesc}>{lead.fullDescription}</p>
        </div>

        {/* Skills */}
        <div className={styles.detailSection}>
          <h4 className={styles.detailSectionTitle}>Required Skills</h4>
          <div className={styles.skillsList}>
            {lead.skills.map(s => (
              <span key={s} className={styles.skillChip}>{s}</span>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className={styles.detailSection}>
          <h4 className={styles.detailSectionTitle}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ marginRight: 6 }}>
              <path d="M6.5 1L8 5H12L9 7.5L10 11.5L6.5 9.5L3 11.5L4 7.5L1 5H5L6.5 1Z" fill="#4F9CF9"/>
            </svg>
            AI Insights
          </h4>
          <ul className={styles.insightsList}>
            {lead.aiInsights.map((insight, i) => (
              <li key={i} className={styles.insightItem}>
                <span className={styles.insightDot} />
                {insight}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className={styles.detailCta}>
          <Link href={`/app/generate?leadId=${lead.id}`} className={`btn btn-primary ${styles.detailCtaBtn}`}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M7.5 1L9.5 6H14.5L10.5 9L12 14L7.5 11L3 14L4.5 9L0.5 6H5.5L7.5 1Z" fill="currentColor"/>
            </svg>
            Generate Winning Proposal
          </Link>
          <p className={styles.detailCtaMeta}>Personalized to this job · Ready in seconds</p>
        </div>
      </div>
    </div>
  );
}

function LeadSkeleton() {
  return (
    <div className={styles.leadRowSkeleton}>
      <div className="skeleton" style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="skeleton" style={{ height: 14, width: '60%' }} />
        <div className="skeleton" style={{ height: 12, width: '85%' }} />
        <div className="skeleton" style={{ height: 10, width: '35%' }} />
      </div>
    </div>
  );
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [filter, setFilter] = useState<'all' | 'saved' | 'urgent' | 'high-budget'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      setLeads(LEADS);
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  const filtered = leads.filter(l => {
    if (filter === 'saved' && !l.saved) return false;
    if (filter === 'urgent' && !l.tags.includes('urgent')) return false;
    if (filter === 'high-budget' && !l.tags.includes('high-budget')) return false;
    if (search && !l.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className={`${styles.page} ${selected ? styles.pageWithDetail : ''}`}>
      {/* LEFT: LIST */}
      <div className={styles.listPane}>
        {/* Header */}
        <div className={styles.listHeader}>
          <div className={styles.listHeaderTop}>
            <h2 className={styles.pageTitle}>Leads</h2>
            <button className="btn btn-primary btn-sm">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Add Lead
            </button>
          </div>

          {/* Search */}
          <div className={styles.searchWrap}>
            <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search leads..."
              className={styles.searchInput}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className={styles.filters}>
            {(['all', 'high-budget', 'urgent', 'saved'] as const).map(f => (
              <button
                key={f}
                className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : f === 'high-budget' ? 'High Budget' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Lead list */}
        <div className={`${styles.leadList} stagger`}>
          {loading ? (
            <>
              {Array.from({ length: 5 }).map((_, i) => <LeadSkeleton key={i} />)}
            </>
          ) : filtered.length === 0 ? (
            <div className={styles.empty}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <rect x="4" y="4" width="28" height="28" rx="6" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
                <path d="M12 14h12M12 18h8M12 22h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
              </svg>
              <span>No leads found</span>
            </div>
          ) : (
            filtered.map(lead => (
              <LeadRow
                key={lead.id}
                lead={lead}
                active={selected?.id === lead.id}
                onClick={() => setSelected(lead)}
              />
            ))
          )}
        </div>
      </div>

      {/* RIGHT: DETAIL */}
      {selected && (
        <LeadDetailPanel
          lead={selected}
          onClose={() => setSelected(null)}
        />
      )}

      {!selected && (
        <div className={styles.emptyDetail}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="6" y="6" width="36" height="36" rx="8" stroke="currentColor" strokeWidth="1.5" opacity="0.2"/>
            <path d="M16 20h16M16 26h10M16 32h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.2"/>
          </svg>
          <p>Select a lead to view details</p>
        </div>
      )}
    </div>
  );
}
