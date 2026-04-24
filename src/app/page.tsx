'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

/* ══════════════════════════════════════════════════════
   CANVAS LOADER — person assembles from scanlines
══════════════════════════════════════════════════════ */
function CanvasLoader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 3800); 
    return () => clearTimeout(timer);
  }, [onDone]);

  // Clients scattered around to be pulled in
  const dots = [
    { id: 1, sx: '-40px', sy: '-30px', delay: '0.2s' },
    { id: 2, sx: '50px',  sy: '-10px', delay: '0.4s' },
    { id: 3, sx: '-20px', sy: '45px',  delay: '0.6s' },
    { id: 4, sx: '35px',  sy: '35px',  delay: '0.3s' },
    { id: 5, sx: '0px',   sy: '-55px', delay: '0.7s' },
  ];

  return (
    <div className={styles.hrLoaderScreen}>
      {/* Gravity Waves */}
      <div className={styles.gravityPulse} style={{ animationDelay: '0s' }} />
      <div className={styles.gravityPulse} style={{ animationDelay: '0.4s' }} />
      
      {/* Client Dots */}
      {dots.map(d => (
        <div 
          key={d.id} 
          className={styles.clientDot} 
          style={{ 
            '--startX': d.sx, 
            '--startY': d.sy,
            animationDelay: d.delay 
          } as React.CSSProperties} 
        />
      ))}

      {/* Central Gravity Well -> Morph Shape */}
      <div className={styles.hrMorphShape} />
      
      <div className={styles.hrTextContainer}>
        <span className={styles.hrCursor}>_</span>
        <span className={styles.hrBrandName}>clientgravity</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SCROLL REVEAL HOOK
══════════════════════════════════════════════════════ */
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, vis };
}

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, vis } = useInView();
  return (
    <div ref={ref} className={`${styles.reveal} ${vis ? styles.revealVis : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   HORIZONTAL SCROLL TEXT REVEAL (uilora-style)
══════════════════════════════════════════════════════ */
function HScrollText({ text }: { text: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = trackRef.current; if (!el) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
        el.style.transform = `translateX(${-progress * 120}px)`;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const repeated = Array.from({ length: 4 }, () => text).join('  ·  ');
  return (
    <div className={styles.hScrollWrap}>
      <div ref={trackRef} className={styles.hScrollTrack}>
        {repeated}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   REVEAL BANNER (uilora-style) — appears as a bold strip
══════════════════════════════════════════════════════ */
function RevealBanner() {
  const { ref, vis } = useInView(0.1);
  return (
    <div ref={ref} className={`${styles.revealBanner} ${vis ? styles.revealBannerVis : ''}`}>
      <div className={styles.revealBannerInner}>
        <div className={styles.revealBannerLine} />
        <p className={styles.revealBannerText}>
          The smartest freelancers aren&apos;t the most talented —<br />
          they&apos;re the ones who <em>show up with the right pitch.</em>
        </p>
        <div className={styles.revealBannerLine} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   FRACTURE ASSEMBLER TEXT (uilora-style)
   Letters scatter then assemble on reveal
══════════════════════════════════════════════════════ */
function FractureText({ text, className = '' }: { text: string; className?: string }) {
  const { ref, vis } = useInView(0.3);
  return (
    <div ref={ref} className={`${styles.fractureWrap} ${className}`} aria-label={text}>
      {text.split('').map((ch, i) => (
        <span
          key={i}
          className={`${styles.fractureLetter} ${vis ? styles.fractureLetterVis : ''}`}
          style={{
            transitionDelay: vis ? `${i * 28}ms` : '0ms',
            '--tx': `${(Math.random() - 0.5) * 60}px`,
            '--ty': `${(Math.random() - 0.5) * 40}px`,
            '--r': `${(Math.random() - 0.5) * 30}deg`,
          } as React.CSSProperties}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PRICING CARD — clipboard pin style
══════════════════════════════════════════════════════ */
function PricingCard({ plan, price, features, highlight = false }: {
  plan: string; price: string; features: string[]; highlight?: boolean;
}) {
  return (
    <div className={`${styles.pricingCard} ${highlight ? styles.pricingCardHL : ''}`}>
      <div className={styles.pricingTape} />
      <div className={styles.pricingCardInner}>
        <h3 className={styles.pricingPlan}>{plan}</h3>
        <p className={styles.pricingPrice}>{price}</p>
        <ul className={styles.pricingFeatures}>
          {features.map(f => (
            <li key={f} className={styles.pricingFeature}>
              <span className={styles.pricingDash}>—</span> {f}
            </li>
          ))}
        </ul>
        <Link href="/signup" className={styles.pricingBtn}>Get started</Link>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [loaderDone, setLoaderDone] = useState(false);
  const [heroVis, setHeroVis] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  const handleLoaderDone = useCallback(() => {
    setLoaderDone(true);
    setTimeout(() => setHeroVis(true), 60);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-zoom scale (hero image zooms as you scroll in)
  const zoomScale = 1 + Math.min(scrollY / 1800, 0.18);

  return (
    <>
      {!loaderDone && <CanvasLoader onDone={handleLoaderDone} />}

      <div className={`${styles.page} ${loaderDone ? styles.pageVis : ''}`}>

        {/* ── NAV ── */}
        <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
          <div className={styles.navInner}>
            <div className={styles.logo}>
              <div className={styles.logoSq} />
              <span>ClientGravity<span className={styles.logoAi}>AI</span></span>
            </div>
            <div className={styles.navLinks}>
              <a href="#how-it-works">How it works</a>
              <a href="#pricing">Pricing</a>
            </div>
            <div className={styles.navActions}>
              <Link href="/signin" className={styles.navLink}>Sign in</Link>
              <Link href="/signup" className={styles.navCta}>Get started →</Link>
            </div>
          </div>
        </nav>

        {/* ── HERO with scroll-zoom BG ── */}
        <section ref={heroRef} className={styles.hero}>
          <div
            className={styles.heroBg}
            style={{ transform: `scale(${zoomScale})`, backgroundImage: `url('/hero-bg.png')` }}
          />
          <div className={styles.heroBgOverlay} />

          <div className={`${styles.heroContent} ${heroVis ? styles.heroContentVis : ''}`}>
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeDot} />
              AI powered lead intelligence
            </div>

            <h1 className={styles.heroHeadline}>
              Stop applying.<br />
              <em className={styles.heroItalic}>Start getting clients.</em>
            </h1>

            <p className={styles.heroSub}>
              AI that surfaces your best leads and writes proposals<br className={styles.hideMobile} />
              that actually get replies. No more spray-and-pray.
            </p>

            <div className={styles.heroCtas}>
              <Link href="/signup" className={styles.ctaPrimary}>
                Start for free
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7H13M7 1L13 7L7 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <a href="#how-it-works" className={styles.ctaGhost}>See how it works</a>
            </div>

            <div className={styles.heroStats}>
              {[
                { v: '3.2×', l: 'avg reply rate' },
                { v: '8,400+', l: 'freelancers' },
                { v: '12 min', l: 'first proposal' },
              ].map(s => (
                <div key={s.l} className={styles.statItem}>
                  <span className={styles.statV}>{s.v}</span>
                  <span className={styles.statL}>{s.l}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`${styles.scrollCue} ${heroVis ? styles.scrollCueVis : ''}`}>
            <div className={styles.scrollLine} />
          </div>
        </section>

        {/* ── HSCROLL REVEAL STRIP ── */}
        <HScrollText text="Leads · Proposals · AI Scoring · Conversion · Freelance · Growth" />

        {/* ── REVEAL BANNER ── */}
        <RevealBanner />

        {/* ── NARRATIVE ── */}
        <section className={styles.narrative} id="how-it-works">
          <div className={styles.narrativeInner}>
            <Reveal>
              <FractureText
                text="Every day, thousands of freelancers send the same generic proposal."
                className={styles.narrativeHook}
              />
            </Reveal>
            <Reveal delay={80}>
              <p className={styles.narrativePara}>
                Copy-paste openers. Recycled skill lists. Silence.
                The problem isn&apos;t effort — it&apos;s signal-to-noise.
              </p>
            </Reveal>
            <Reveal delay={140}>
              <p className={styles.narrativePara}>
                <strong>ClientGravity AI</strong> fixes that. It reads every posting,
                scores it against your skills, and drafts a proposal that sounds like <em>you</em> — in seconds.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── THREE-STEP PROCESS ── */}
        <section className={styles.stepsSection}>
          <div className={styles.stepsInner}>
            <Reveal>
              <div className={styles.eyebrow}>The process</div>
              <h2 className={styles.sectionTitle}>Three steps to your next client</h2>
            </Reveal>

            <div className={styles.stepsGrid}>
              {[
                { n: '01', t: 'Drop any job post', b: 'Paste from Upwork, LinkedIn, Toptal — anywhere. Instant parse.' },
                { n: '02', t: 'AI scores the lead', b: 'Budget signals, urgency flags, red flags, and a fit score for your skills.' },
                { n: '03', t: 'Send a winning proposal', b: 'A personalized pitch drafted in seconds. Edit once, send.' },
              ].map((s, i) => (
                <Reveal key={s.n} delay={i * 80}>
                  <div className={styles.stepCard}>
                    <span className={styles.stepNum}>{s.n}</span>
                    <h3 className={styles.stepTitle}>{s.t}</h3>
                    <p className={styles.stepBody}>{s.b}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className={styles.featuresSection}>
          <div className={styles.featuresInner}>
            <Reveal>
              <div className={styles.eyebrow}>Capabilities</div>
              <h2 className={styles.sectionTitle}>Everything a serious freelancer needs</h2>
            </Reveal>
            <div className={styles.featuresGrid}>
              {[
                { ic: '◈', t: 'AI Match Score',      b: 'Every lead scored against your skill stack, budget, and urgency signals.' },
                { ic: '✦', t: 'Proposal Generator',  b: 'Tone selector — confident, professional, brief, friendly — then generate.' },
                { ic: '◉', t: 'Lead Intelligence',   b: 'Client quality, red flags, and conversion likelihood shown at a glance.' },
                { ic: '◌', t: 'Saved Leads Vault',   b: 'Bookmark your highest-fit leads and pitch when the moment is right.' },
              ].map((f, i) => (
                <Reveal key={f.t} delay={i * 60}>
                  <div className={styles.featureCard}>
                    <span className={styles.featureIcon}>{f.ic}</span>
                    <h3 className={styles.featureTitle}>{f.t}</h3>
                    <p className={styles.featureBody}>{f.b}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── QUOTE ── */}
        <section className={styles.quoteSection}>
          <Reveal>
            <blockquote className={styles.quote}>
              &ldquo;I went from a 4% reply rate to closing 2 clients in the first week.&rdquo;
            </blockquote>
            <p className={styles.quoteAuthor}>— Marcus T., Full-stack freelancer</p>
          </Reveal>
        </section>

        {/* ── HSCROLL 2 ── */}
        <HScrollText text="Stop Applying · Start Winning · Close More · Work Less · Ship Proposals" />

        {/* ── PRICING ── */}
        <section className={styles.pricingSection} id="pricing">
          <div className={styles.pricingInner}>
            <Reveal>
              <div className={styles.eyebrow}>Pricing</div>
              <h2 className={`${styles.sectionTitle} ${styles.pricingTitle}`}>
                <em>Rough Estimates</em>
              </h2>
              <div className={styles.pricingTitleUnderline} />
            </Reveal>

            <div className={styles.pricingGrid}>
              <Reveal delay={0}>
                <PricingCard
                  plan="Starter"
                  price="Free"
                  features={['10 leads / month', 'AI proposal generator', 'Lead scoring', 'Saved leads vault']}
                />
              </Reveal>
              <Reveal delay={80}>
                <PricingCard
                  plan="Pro"
                  price="₹999 / mo"
                  features={['Unlimited leads', 'Priority AI model (GPT-4o)', 'Custom tone profiles', 'Email alerts for high-fit leads', '30-day history']}
                  highlight
                />
              </Reveal>
              <Reveal delay={160}>
                <PricingCard
                  plan="Agency"
                  price="₹2,499 / mo"
                  features={['Everything in Pro', 'Multi-freelancer seats (up to 5)', 'API access', 'Custom integrations', 'Priority support']}
                />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className={styles.finalCta}>
          <Reveal>
            <p className={styles.eyebrow}>Ready?</p>
            <h2 className={styles.finalCtaHeadline}>
              Your next client is<br />one proposal away.
            </h2>
            <p className={styles.finalCtaSub}>Join 8,400+ freelancers who close more with ClientGravity AI.</p>
            <div className={styles.finalCtaBtns}>
              <Link href="/signup" className={styles.ctaPrimary}>
                Get started free
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7H13M7 1L13 7L7 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/signin" className={styles.ctaGhost}>Already have an account →</Link>
            </div>
            <p className={styles.finalCtaMeta}>No credit card required · Cancel anytime</p>
          </Reveal>
        </section>

        {/* ── FOOTER ── */}
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.logo}>
              <div className={styles.logoSq} style={{ width: 12, height: 12 }} />
              <span>ClientGravity AI</span>
            </div>
            <p className={styles.footerCopy}>© 2026 ClientGravity AI. Built for serious freelancers.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
