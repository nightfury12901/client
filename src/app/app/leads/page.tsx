'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { TAG_CONFIG } from '@/lib/data';
import type { ScrapedLead } from '@/lib/leads/scraper';

type FilterType = 'all' | 'saved' | 'urgent' | 'high-budget';

/* ── Score Ring ── */
function ScoreRing({ score }: { score: number }) {
  const color = score >= 85 ? '#5cba8b' : score >= 70 ? '#e8a020' : '#555';
  return (
    <div className={styles.scoreRing} style={{ '--score-color': color } as React.CSSProperties}>
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
        <circle cx="19" cy="19" r="16" stroke="rgba(255,255,255,0.06)" strokeWidth="3"/>
        <circle cx="19" cy="19" r="16" stroke={color} strokeWidth="3"
          strokeDasharray={`${(score / 100) * 100.5} 100.5`}
          strokeDashoffset="25" strokeLinecap="round" transform="rotate(-90 19 19)"/>
      </svg>
      <span className={styles.scoreNum} style={{ color }}>{score}</span>
    </div>
  );
}

/* ── Lead Row ── */
function LeadRow({ lead, active, onClick }: { lead: ScrapedLead; active: boolean; onClick: () => void }) {
  return (
    <div
      className={`${styles.leadRow} ${active ? styles.leadRowActive : ''}`}
      onClick={onClick} role="button" tabIndex={0}
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
            {(lead.tags as string[]).slice(0, 2).map(tag => (
              <span key={tag} className={`tag ${TAG_CONFIG[tag as keyof typeof TAG_CONFIG]?.cls ?? 'tag-muted'}`}>
                {TAG_CONFIG[tag as keyof typeof TAG_CONFIG]?.label ?? tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      {lead.saved && (
        <svg className={styles.savedIcon} width="13" height="13" viewBox="0 0 14 14" fill="currentColor">
          <path d="M3 1h8a1 1 0 011 1v10l-4-2-4 2V2a1 1 0 011-1z"/>
        </svg>
      )}
    </div>
  );
}

/* ── Detail Panel ── */
function LeadDetailPanel({ lead, onClose }: { lead: ScrapedLead; onClose: () => void }) {
  const [saved, setSaved] = useState(lead.saved ?? false);
  const [saving, setSaving] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const scoreColor = lead.score >= 85 ? 'var(--success)' : lead.score >= 70 ? 'var(--warning)' : 'var(--text-muted)';

  const toggleSave = async () => {
    setSaving(true);
    try {
      if (!saved) {
        await fetch('/api/leads/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leadId: lead.id, leadData: lead }),
        });
        setSaved(true);
      } else {
        await fetch(`/api/leads/save?leadId=${lead.id}`, { method: 'DELETE' });
        setSaved(false);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`${styles.detailPanel} slide-in`}>
      <div className={styles.detailHeader}>
        <button className={styles.closeBtn} onClick={onClose} title="Close">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </button>
        <div className={styles.detailActions}>
          <button
            className={`btn btn-ghost btn-sm ${saved ? styles.savedActive : ''}`}
            onClick={toggleSave} disabled={saving}
          >
            <svg width="12" height="12" viewBox="0 0 13 13" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.3">
              <path d="M2.5 1.5h8a1 1 0 011 1v9L6.5 9l-5 2.5v-9a1 1 0 011-1z"/>
            </svg>
            {saved ? 'Saved' : 'Save'}
          </button>
          <Link href={`/app/generate?leadId=${lead.id}&title=${encodeURIComponent(lead.title)}`} className="btn btn-primary btn-sm">
            <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 1L8 5H12L9 7.5L10 11.5L6.5 9.5L3 11.5L4 7.5L1 5H5L6.5 1Z" fill="currentColor"/>
            </svg>
            Generate Proposal
          </Link>
        </div>
      </div>

      <div className={styles.detailContent}>
        <div className={styles.scoreBar}>
          <div className={styles.scoreBarLeft}>
            <span className={styles.scoreLabel}>AI Match Score</span>
            <div className={styles.scoreBarTrack}>
              <div className={styles.scoreBarFill} style={{ width: `${lead.score}%`, background: scoreColor }}/>
            </div>
          </div>
          <span className={styles.scoreBig} style={{ color: scoreColor }}>{lead.score}/100</span>
        </div>

        <h1 className={styles.detailTitle}>{lead.title}</h1>
        <div className={styles.detailMetaRow}>
          <span className="tag tag-muted">{lead.platform}</span>
          <span className={styles.detailClient}>{lead.client}</span>
          <span className={styles.leadPosted}>{lead.posted}</span>
          <span className={styles.detailBudget}>{lead.budget}</span>
        </div>

        <div className={styles.detailTags}>
          {(lead.tags as string[]).map(tag => (
            <span key={tag} className={`tag ${TAG_CONFIG[tag as keyof typeof TAG_CONFIG]?.cls ?? 'tag-muted'}`}>
              {TAG_CONFIG[tag as keyof typeof TAG_CONFIG]?.label ?? tag}
            </span>
          ))}
        </div>

        <div className={styles.detailSection}>
            <h4 className={styles.detailSectionTitle}>Job Description</h4>
            <p className={`${styles.detailDesc} ${descExpanded ? '' : styles.detailDescClamped}`}>
              {lead.fullDescription}
            </p>
            {lead.fullDescription.length > 300 && (
              <button className={styles.expandBtn} onClick={() => setDescExpanded(e => !e)}>
                {descExpanded ? '↑ Show less' : '↓ Show more'}
              </button>
            )}
          </div>

        {lead.skills.length > 0 && (
          <div className={styles.detailSection}>
            <h4 className={styles.detailSectionTitle}>Required Skills</h4>
            <div className={styles.skillsList}>
              {lead.skills.map(s => <span key={s} className={styles.skillChip}>{s}</span>)}
            </div>
          </div>
        )}

        {lead.aiInsights.length > 0 && (
          <div className={styles.detailSection}>
            <h4 className={styles.detailSectionTitle}>
              <svg width="12" height="12" viewBox="0 0 13 13" fill="none" style={{ marginRight: 6 }}>
                <path d="M6.5 1L8 5H12L9 7.5L10 11.5L6.5 9.5L3 11.5L4 7.5L1 5H5L6.5 1Z" fill="rgba(240,240,240,0.5)"/>
              </svg>
              AI Insights
            </h4>
            <ul className={styles.insightsList}>
              {lead.aiInsights.map((ins, i) => (
                <li key={i} className={styles.insightItem}>
                  <span className={styles.insightDot}/>
                  {ins}
                </li>
              ))}
            </ul>
          </div>
        )}

        {lead.url && (
          <div className={styles.detailSection}>
            <a href={lead.url} target="_blank" rel="noopener noreferrer" className={styles.viewOriginalLink}>
              View original posting →
            </a>
          </div>
        )}

        <div className={styles.detailCta}>
          <Link href={`/app/generate?leadId=${lead.id}&title=${encodeURIComponent(lead.title)}&desc=${encodeURIComponent(lead.fullDescription.slice(0, 500))}`} className={`btn btn-primary ${styles.detailCtaBtn}`}>
            Generate Winning Proposal
          </Link>
        </div>
      </div>
    </div>
  );
}

function LeadSkeleton() {
  return (
    <div className={styles.leadRowSkeleton}>
      <div className="skeleton" style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0 }}/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="skeleton" style={{ height: 13, width: '60%' }}/>
        <div className="skeleton" style={{ height: 11, width: '85%' }}/>
        <div className="skeleton" style={{ height: 10, width: '35%' }}/>
      </div>
    </div>
  );
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<ScrapedLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<ScrapedLead | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('react developer');
  const [queryInput, setQueryInput] = useState('react developer');

  const fetchLeads = useCallback(async (q: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/leads?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setLeads(data.leads ?? []);
    } catch (e) {
      setError('Could not load leads. Check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(query); }, [query, fetchLeads]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(queryInput);
  };

  const filtered = leads.filter(l => {
    if (filter === 'saved' && !l.saved) return false;
    if (filter === 'urgent' && !(l.tags as string[]).includes('urgent')) return false;
    if (filter === 'high-budget' && !(l.tags as string[]).includes('high-budget')) return false;
    if (search && !l.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className={`${styles.page} ${selected ? styles.pageWithDetail : ''}`}>
      <div className={styles.listPane}>
        <div className={styles.listHeader}>
          <div className={styles.listHeaderTop}>
            <h2 className={styles.pageTitle}>Leads</h2>
            <span className={styles.leadsCount}>{leads.length} live</span>
          </div>

          {/* Query input */}
          <form onSubmit={handleSearch} className={styles.queryForm}>
            <input
              type="text"
              value={queryInput}
              onChange={e => setQueryInput(e.target.value)}
              placeholder="e.g. react developer, python backend..."
              className={styles.queryInput}
            />
            <button type="submit" className={styles.queryBtn}>
              {loading ? '...' : 'Search'}
            </button>
          </form>

          {/* Text filter */}
          <div className={styles.searchWrap}>
            <svg className={styles.searchIcon} width="13" height="13" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <input
              type="text" placeholder="Filter results..."
              className={styles.searchInput}
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>

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

        <div className={styles.leadList}>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <LeadSkeleton key={i}/>)
          ) : error ? (
            <div className={styles.empty}>
              <p style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => fetchLeads(query)}>Retry</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.empty}>
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                <rect x="4" y="4" width="28" height="28" rx="5" stroke="currentColor" strokeWidth="1.5" opacity="0.2"/>
                <path d="M12 14h12M12 18h8M12 22h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.2"/>
              </svg>
              <span>No leads found</span>
            </div>
          ) : (
            filtered.map(lead => (
              <LeadRow
                key={lead.id} lead={lead}
                active={selected?.id === lead.id}
                onClick={() => setSelected(lead)}
              />
            ))
          )}
        </div>
      </div>

      {selected && <LeadDetailPanel lead={selected} onClose={() => setSelected(null)}/>}

      {!selected && (
        <div className={styles.emptyDetail}>
          <svg width="42" height="42" viewBox="0 0 48 48" fill="none">
            <rect x="6" y="6" width="36" height="36" rx="7" stroke="currentColor" strokeWidth="1.5" opacity="0.15"/>
            <path d="M16 20h16M16 26h10M16 32h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.15"/>
          </svg>
          <p>Select a lead to view details</p>
        </div>
      )}
    </div>
  );
}
