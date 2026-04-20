'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

const DEMO_PROPOSALS: Record<string, string> = {
  default: `Hi,

I came across your posting and I'm confident I can deliver exactly what you're looking for — on time and within budget.

I've built similar solutions for 3 clients in your industry over the past 12 months. My approach is straightforward: clear milestones, daily updates, and zero hand-holding required from your side.

What you get:
→ Clean, maintainable code (not a spaghetti mess)
→ Full documentation + handover
→ 30-day post-delivery support

I'm available to start immediately. Want to jump on a 15-min call this week?

— Alex`,

  react: `Hello,

Your React project sounds like a great fit for my skillset. I've shipped 20+ production React apps — from startups to enterprise.

Looking at your requirements, I'd structure this with:
• Next.js App Router for server-side performance
• Zustand for lightweight state management
• Shadcn UI + Tailwind for rapid, consistent design

Timeline: I can deliver an MVP in 5–7 days, fully tested.

I don't overbid. My quote reflects the actual scope — no hidden extras.

Let's talk. What's the best time for a quick sync?

— Alex`,

  design: `Hi there,

Your UI/UX brief is exactly the kind of challenge I love — complex product, meaningful problem.

My process: I start with a 2-hour discovery sprint, map the user journey, and deliver high-fidelity Figma mockups before writing a single line of code. No wasted iterations.

Past clients have seen 40%+ conversion lift after my redesigns. I'm not guessing — I'm data-driven.

Portfolio link: [available on request]

Can we set up a 20-min call to review your current flow?

— Alex`,
};

function generateProposal(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('react') || lower.includes('next') || lower.includes('typescript')) return DEMO_PROPOSALS.react;
  if (lower.includes('design') || lower.includes('figma') || lower.includes('ui') || lower.includes('ux')) return DEMO_PROPOSALS.design;
  return DEMO_PROPOSALS.default;
}

const STATS = [
  { value: '3.2×', label: 'Avg reply rate increase' },
  { value: '12 min', label: 'Time to first proposal' },
  { value: '8,400+', label: 'Freelancers using it' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Paste a job post',
    desc: 'Drop any Upwork, Toptal, or LinkedIn job description into ClientGravity.',
  },
  {
    step: '02',
    title: 'AI analyzes the lead',
    desc: 'Instant scoring: budget signals, urgency, red flags, and fit assessment.',
  },
  {
    step: '03',
    title: 'Generate a proposal',
    desc: 'Get a high-converting, personalized proposal in seconds. Edit and send.',
  },
];

export default function LandingPage() {
  const [jobText, setJobText] = useState('');
  const [proposal, setProposal] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const proposalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleGenerate = async () => {
    if (!jobText.trim() || generating) return;
    setGenerating(true);
    setGenerated(false);
    setProposal('');

    await new Promise(r => setTimeout(r, 1400));
    const result = generateProposal(jobText);
    setGenerating(false);
    setGenerated(true);

    // Typewriter
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setProposal(result.slice(0, i));
      if (i >= result.length) clearInterval(interval);
    }, 8);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(proposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.page}>
      {/* NAV */}
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
        <div className={styles.navInner}>
          <div className={styles.logo}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="#4F9CF9" strokeWidth="1.5"/>
              <circle cx="10" cy="10" r="3" fill="#4F9CF9"/>
              <circle cx="10" cy="3.5" r="1.5" fill="#4F9CF9" opacity="0.5"/>
              <circle cx="16.5" cy="10" r="1.5" fill="#4F9CF9" opacity="0.5"/>
              <circle cx="10" cy="16.5" r="1.5" fill="#4F9CF9" opacity="0.5"/>
              <circle cx="3.5" cy="10" r="1.5" fill="#4F9CF9" opacity="0.5"/>
            </svg>
            <span>ClientGravity</span>
            <span className={styles.logoAi}>AI</span>
          </div>
          <div className={styles.navLinks}>
            <a href="#how-it-works">How it works</a>
            <a href="#demo">Live demo</a>
          </div>
          <div className={styles.navActions}>
            <Link href="/app/leads" className="btn btn-ghost btn-sm">Sign in</Link>
            <Link href="/app/leads" className="btn btn-primary btn-sm">Get started free</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <div className={`${styles.badge} fade-in`}>
            <span className={styles.badgeDot} />
            Now with GPT-4o powered analysis
          </div>
          <h1 className={`${styles.heroHeadline} fade-up`}>
            Stop applying.{' '}
            <span className={styles.heroAccent}>Start getting clients.</span>
          </h1>
          <p className={`${styles.heroSub} fade-up`} style={{ animationDelay: '80ms' }}>
            AI that finds leads and writes proposals that actually get replies.
            <br />No more spray-and-pray. Just signal.
          </p>
          <div className={`${styles.heroActions} fade-up`} style={{ animationDelay: '160ms' }}>
            <Link href="/app/leads" className="btn btn-primary btn-lg">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L15 8L8 15M15 8H1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Start for free
            </Link>
            <a href="#demo" className="btn btn-ghost btn-lg">
              See demo
            </a>
          </div>

          {/* Stats */}
          <div className={`${styles.stats} fade-up stagger`} style={{ animationDelay: '240ms' }}>
            {STATS.map(s => (
              <div key={s.label} className={styles.statItem}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE DEMO */}
      <section className={styles.demoSection} id="demo">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTag}>Interactive Demo</div>
          <h2 className={styles.sectionTitle}>Try it right now</h2>
          <p className={styles.sectionSub}>Paste any job description. Get a proposal in seconds.</p>
        </div>

        <div className={styles.demoBox}>
          <div className={styles.demoLeft}>
            <div className={styles.demoInputHeader}>
              <span>Job Description</span>
              <span className={styles.demoHint}>Paste from Upwork, LinkedIn, etc.</span>
            </div>
            <textarea
              className={styles.demoTextarea}
              placeholder={`We're looking for an experienced React developer to build a dashboard for our SaaS product. Must have 3+ years experience with TypeScript and Next.js. Budget: $2,000–$3,500. Deadline: 3 weeks...`}
              value={jobText}
              onChange={e => setJobText(e.target.value)}
            />
            <button
              className={`${styles.demoBtn} ${generating ? styles.demoBtnLoading : ''}`}
              onClick={handleGenerate}
              disabled={!jobText.trim() || generating}
            >
              {generating ? (
                <>
                  <span className={styles.spinner} />
                  Analyzing lead...
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M7.5 1L9.5 6H14.5L10.5 9L12 14L7.5 11L3 14L4.5 9L0.5 6H5.5L7.5 1Z" fill="currentColor"/>
                  </svg>
                  Generate proposal
                </>
              )}
            </button>
          </div>

          <div className={styles.demoDivider}>
            <div className={styles.demoDividerLine} />
            <span>→</span>
            <div className={styles.demoDividerLine} />
          </div>

          <div className={styles.demoRight} ref={proposalRef}>
            <div className={styles.demoOutputHeader}>
              <span>Generated Proposal</span>
              {generated && (
                <button className={`btn btn-ghost btn-sm ${styles.copyBtn}`} onClick={handleCopy}>
                  {copied ? (
                    <><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5L5 9.5L11 3.5" stroke="#3FB68A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> Copied</>
                  ) : (
                    <><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="4.5" y="4.5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 8.5H2.5C1.95 8.5 1.5 8.05 1.5 7.5V2.5C1.5 1.95 1.95 1.5 2.5 1.5H7.5C8.05 1.5 8.5 1.95 8.5 2.5V4.5" stroke="currentColor" strokeWidth="1.2"/></svg> Copy</>
                  )}
                </button>
              )}
            </div>

            <div className={styles.demoOutput}>
              {generating && (
                <div className={styles.demoLoading}>
                  <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 10 }} />
                  <div className="skeleton" style={{ height: 14, width: '85%', marginBottom: 10 }} />
                  <div className="skeleton" style={{ height: 14, width: '72%', marginBottom: 20 }} />
                  <div className="skeleton" style={{ height: 14, width: '90%', marginBottom: 10 }} />
                  <div className="skeleton" style={{ height: 14, width: '55%', marginBottom: 10 }} />
                  <div className="skeleton" style={{ height: 14, width: '78%', marginBottom: 20 }} />
                  <div className="skeleton" style={{ height: 14, width: '40%' }} />
                </div>
              )}
              {proposal && (
                <pre className={styles.proposalText}>{proposal}</pre>
              )}
              {!generating && !proposal && (
                <div className={styles.demoEmpty}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <rect x="4" y="4" width="24" height="24" rx="4" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
                    <path d="M10 12h12M10 16h8M10 20h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
                  </svg>
                  <span>Your proposal will appear here</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.howSection} id="how-it-works">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTag}>Process</div>
          <h2 className={styles.sectionTitle}>How it works</h2>
        </div>
        <div className={`${styles.howSteps} stagger`}>
          {HOW_IT_WORKS.map((step) => (
            <div key={step.step} className={`${styles.howStep} fade-up`}>
              <span className={styles.howStepNum}>{step.step}</span>
              <h3 className={styles.howStepTitle}>{step.title}</h3>
              <p className={styles.howStepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BOTTOM */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaGlow} />
        <h2 className={styles.ctaTitle}>Your next client is one proposal away.</h2>
        <p className={styles.ctaSub}>Join 8,400+ freelancers who closed more deals with ClientGravity AI.</p>
        <Link href="/app/leads" className="btn btn-primary btn-lg">
          Get started — it&apos;s free
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 7H13M7 1L13 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <p className={styles.ctaMeta}>No credit card required · Cancel anytime</p>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.logo}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="#4F9CF9" strokeWidth="1.5"/>
              <circle cx="10" cy="10" r="3" fill="#4F9CF9"/>
            </svg>
            <span>ClientGravity AI</span>
          </div>
          <p className={styles.footerMeta}>© 2026 ClientGravity AI. Built for serious freelancers.</p>
        </div>
      </footer>
    </div>
  );
}
