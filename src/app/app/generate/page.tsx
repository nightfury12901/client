'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LEADS } from '@/lib/data';
import styles from './page.module.css';

type Tone = 'professional' | 'confident' | 'friendly' | 'brief';
type Platform = 'upwork' | 'linkedin' | 'email' | 'toptal';

const TONE_OPTIONS: { value: Tone; label: string; desc: string }[] = [
  { value: 'professional', label: 'Professional',  desc: 'Formal, structured, trustworthy' },
  { value: 'confident',    label: 'Confident',     desc: 'Direct, assertive, results-focused' },
  { value: 'friendly',     label: 'Friendly',      desc: 'Warm, approachable, conversational' },
  { value: 'brief',        label: 'Brief',         desc: 'Ultra-short, punchy, respects their time' },
];

const PLATFORM_OPTIONS: { value: Platform; label: string }[] = [
  { value: 'upwork',   label: 'Upwork' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'email',    label: 'Email' },
  { value: 'toptal',   label: 'Toptal' },
];

function generateProposal(desc: string, tone: Tone, platform: Platform, yourSkills: string): string {
  const name = 'Alex';
  const skills = yourSkills || 'React, TypeScript, Node.js';

  const openers: Record<Tone, string> = {
    professional: `Dear Hiring Manager,\n\nAfter reviewing your posting carefully, I'm confident I can deliver exactly the results you're describing.`,
    confident:    `Hi,\n\nI'll cut to the chase — I'm the right person for this.`,
    friendly:     `Hey there! 👋\n\nYour project caught my eye and I'd love to help you pull it off.`,
    brief:        `Hi — I can do exactly this. Here's why:`,
  };

  const closers: Record<Tone, string> = {
    professional: `I'd welcome the opportunity to discuss this further at your convenience.\n\nBest regards,\n${name}`,
    confident:    `Ready to start immediately. When's a good time to connect?\n\n— ${name}`,
    friendly:     `Would love to hop on a quick call — totally low-pressure! 😊\n\n${name}`,
    brief:        `Available now. Want to talk?\n\n— ${name}`,
  };

  const platformNote: Record<Platform, string> = {
    upwork:   `My Upwork profile shows my full history — 100% JSS, $150k+ earned.`,
    linkedin:  `You can review my full work history on my LinkedIn profile.`,
    email:    `Happy to share references and portfolio samples on request.`,
    toptal:   `As a Toptal-vetted developer, I represent the top 3% globally.`,
  };

  const middle = `My background with ${skills} maps directly to your requirements. Here's how I'd approach this:

→ Week 1: Discovery + architecture planning, aligned with your team
→ Week 2–3: Core build with daily async updates (no hand-holding needed)
→ Final week: Testing, polish, and full documentation handover

What I bring beyond the code:
• No surprises on scope or timeline
• Clean, documented output — not a spaghetti mess
• 30 days of post-delivery support included

${platformNote[platform]}`;

  return `${openers[tone]}\n\n${middle}\n\n${closers[tone]}`;
}

function GenerateContent() {
  const searchParams = useSearchParams();
  const leadId = searchParams.get('leadId');
  const lead = leadId ? LEADS.find(l => l.id === leadId) : null;

  const [jobDesc, setJobDesc] = useState(lead?.fullDescription ?? '');
  const [yourSkills, setYourSkills] = useState('React, TypeScript, Node.js, Next.js');
  const [tone, setTone] = useState<Tone>('confident');
  const [platform, setPlatform] = useState<Platform>('upwork');
  const [proposal, setProposal] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setWordCount(proposal.trim() ? proposal.trim().split(/\s+/).length : 0);
  }, [proposal]);

  const handleGenerate = async () => {
    if (generating || !jobDesc.trim()) return;
    setGenerating(true);
    setGenerated(false);
    setProposal('');

    await new Promise(r => setTimeout(r, 1600));
    const result = generateProposal(jobDesc, tone, platform, yourSkills);
    setGenerating(false);
    setGenerated(true);

    let i = 0;
    const interval = setInterval(() => {
      i += 2;
      setProposal(result.slice(0, i));
      if (i >= result.length) {
        setProposal(result);
        clearInterval(interval);
      }
    }, 12);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(proposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    if (!generated || generating) return;
    handleGenerate();
  };

  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Generate Proposal</h1>
          {lead && <p className={styles.pageSubtitle}>For: {lead.title}</p>}
        </div>
        <div className={styles.pageHeaderActions}>
          {generated && (
            <span className={styles.wordCount}>{wordCount} words</span>
          )}
        </div>
      </div>

      {/* Split layout */}
      <div className={styles.splitLayout}>
        {/* LEFT: Controls */}
        <div className={styles.leftPane}>
          {/* Job description */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Job Description</label>
            <textarea
              className={styles.jobTextarea}
              placeholder="Paste the full job description here. The more detail you include, the more personalized the proposal."
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
            />
          </div>

          {/* Your skills */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Your Key Skills</label>
            <input
              type="text"
              className={styles.input}
              placeholder="React, TypeScript, Node.js..."
              value={yourSkills}
              onChange={e => setYourSkills(e.target.value)}
            />
          </div>

          {/* Platform */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Platform</label>
            <div className={styles.segmented}>
              {PLATFORM_OPTIONS.map(p => (
                <button
                  key={p.value}
                  className={`${styles.segmentBtn} ${platform === p.value ? styles.segmentActive : ''}`}
                  onClick={() => setPlatform(p.value)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tone */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Tone</label>
            <div className={styles.toneGrid}>
              {TONE_OPTIONS.map(t => (
                <button
                  key={t.value}
                  className={`${styles.toneCard} ${tone === t.value ? styles.toneActive : ''}`}
                  onClick={() => setTone(t.value)}
                >
                  <span className={styles.toneName}>{t.label}</span>
                  <span className={styles.toneDesc}>{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            className={`${styles.generateBtn} ${generating ? styles.generateBtnLoading : ''}`}
            onClick={handleGenerate}
            disabled={!jobDesc.trim() || generating}
          >
            {generating ? (
              <>
                <span className={styles.spinner} />
                Crafting your proposal...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L10 6H15L11 9L12.5 14L8 11.5L3.5 14L5 9L1 6H6L8 1Z" fill="currentColor"/>
                </svg>
                {generated ? 'Regenerate Proposal' : 'Generate Proposal'}
              </>
            )}
          </button>
        </div>

        {/* DIVIDER */}
        <div className={styles.divider} />

        {/* RIGHT: Output */}
        <div className={styles.rightPane}>
          <div className={styles.outputHeader}>
            <span className={styles.outputTitle}>
              {generating ? 'Writing...' : generated ? 'Your Proposal' : 'Output'}
            </span>
            {generated && !generating && (
              <div className={styles.outputActions}>
                <button className={`btn btn-ghost btn-sm`} onClick={handleRegenerate}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M1.5 6.5A5 5 0 0111.5 4M11.5 2v2h-2M11.5 6.5A5 5 0 011.5 9M1.5 11V9h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Regenerate
                </button>
                <button className={`btn btn-ghost btn-sm ${copied ? styles.copiedBtn : ''}`} onClick={handleCopy}>
                  {copied ? (
                    <><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5L5 9.5L11 3.5" stroke="#3FB68A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> Copied!</>
                  ) : (
                    <><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="4.5" y="4.5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 8.5H2.5C1.95 8.5 1.5 8.05 1.5 7.5V2.5C1.5 1.95 1.95 1.5 2.5 1.5H7.5C8.05 1.5 8.5 1.95 8.5 2.5V4.5" stroke="currentColor" strokeWidth="1.2"/></svg> Copy</>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className={styles.outputBody}>
            {generating && (
              <div className={styles.outputLoading}>
                <div className={styles.loadingBar}>
                  <div className={styles.loadingBarFill} />
                </div>
                <p className={styles.loadingText}>Analyzing job post & personalizing proposal...</p>
                <div className={styles.skeletons}>
                  <div className="skeleton" style={{ height: 13, width: '55%' }} />
                  <div className="skeleton" style={{ height: 13, width: '80%' }} />
                  <div className="skeleton" style={{ height: 13, width: '68%' }} />
                  <div style={{ height: 12 }} />
                  <div className="skeleton" style={{ height: 13, width: '90%' }} />
                  <div className="skeleton" style={{ height: 13, width: '73%' }} />
                  <div className="skeleton" style={{ height: 13, width: '58%' }} />
                  <div style={{ height: 12 }} />
                  <div className="skeleton" style={{ height: 13, width: '42%' }} />
                </div>
              </div>
            )}

            {!generating && generated && (
              <textarea
                ref={textareaRef}
                className={styles.proposalEditor}
                value={proposal}
                onChange={e => setProposal(e.target.value)}
              />
            )}

            {!generating && !generated && (
              <div className={styles.outputEmpty}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <rect x="8" y="8" width="32" height="32" rx="6" stroke="currentColor" strokeWidth="1.5" opacity="0.2"/>
                  <path d="M16 20h16M16 26h12M16 32h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.2"/>
                  <circle cx="36" cy="12" r="6" fill="#4F9CF9" opacity="0.2"/>
                  <path d="M36 9v3l2 2" stroke="#4F9CF9" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
                </svg>
                <p className={styles.emptyTitle}>Your proposal will appear here</p>
                <p className={styles.emptyDesc}>Fill in the job description and hit Generate</p>
              </div>
            )}
          </div>

          {/* Footer tips */}
          {generated && !generating && (
            <div className={styles.outputFooter}>
              <span className={styles.tip}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5" stroke="#4F9CF9" strokeWidth="1.2"/>
                  <path d="M6 4v4M6 3v.5" stroke="#4F9CF9" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                Tip: Personalize the proposal before sending for best results
              </span>
              <span className={styles.wordCountFoot}>{wordCount} words</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: 'var(--text-muted)', fontSize: 13 }}>Loading...</div>}>
      <GenerateContent />
    </Suspense>
  );
}
