'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './page.module.css';

type Tone     = 'professional' | 'confident' | 'friendly' | 'brief';
type Platform = 'upwork' | 'linkedin' | 'email' | 'toptal';

const TONE_OPTIONS: { value: Tone; label: string; desc: string }[] = [
  { value: 'professional', label: 'Professional', desc: 'Formal, structured, trustworthy' },
  { value: 'confident',    label: 'Confident',    desc: 'Direct, assertive, results-focused' },
  { value: 'friendly',     label: 'Friendly',     desc: 'Warm, approachable, conversational' },
  { value: 'brief',        label: 'Brief',         desc: 'Ultra-short, punchy, respects their time' },
];

const PLATFORM_OPTIONS: { value: Platform; label: string }[] = [
  { value: 'upwork',   label: 'Upwork' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'email',    label: 'Email' },
  { value: 'toptal',   label: 'Toptal' },
];

// ─── Icon primitives ─────────────────────────────────────────────────────────
const Icon = {
  Bold: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6zm0 8h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /></svg>),
  Italic: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><line x1="19" y1="4" x2="10" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="14" y1="20" x2="5" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="15" y1="4" x2="9" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>),
  Link: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>),
  Attach: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>),
  Emoji: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>),
  Image: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>),
  Send: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 2 11 13M22 2 15 22l-4-9-9-4z"/></svg>),
  More: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>),
  Delete: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>),
  Expand: () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>),
  Minimize: () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>),
  Close: () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
  Star: () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>),
  List: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>),
  ChevronDown: () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>),
};

// ─── Platform Components ───────────────────────────────────────────────────────
function LinkedInEditor({ value, onChange, to, onToChange }: any) {
  const liIconBtn = { background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: "4px", padding: "3px 5px", cursor: "pointer", display: "flex", alignItems: "center", lineHeight: 1 };
  const liToolBtn = { background: "none", border: "none", color: "#666", padding: "6px 8px", cursor: "pointer", borderRadius: "4px", display: "flex", alignItems: "center", transition: "background 0.12s" };

  return (
    <div style={{ width: "100%", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.10)", fontFamily: "-apple-system, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif", background: "#fff", border: "1px solid #d0d0d0" }}>
      <div style={{ background: "#0a66c2", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "#fff", fontSize: "14px", fontWeight: 600, letterSpacing: "0.01em" }}>New message</span>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button style={liIconBtn as any}><Icon.Expand /></button>
          <button style={liIconBtn as any}><Icon.Minimize /></button>
          <button style={liIconBtn as any}><Icon.Close /></button>
        </div>
      </div>
      <div style={{ borderBottom: "1px solid #e8e8e8", display: "flex", alignItems: "center", padding: "0 16px" }}>
        <span style={{ fontSize: "13px", color: "#666", fontWeight: 500, minWidth: 28, paddingTop: 12, paddingBottom: 12 }}>To</span>
        <input value={to} onChange={e => onToChange(e.target.value)} placeholder="Type a name" style={{ border: "none", outline: "none", flex: 1, fontSize: "13px", color: "#1a1a1a", background: "transparent", padding: "12px 8px", fontFamily: "inherit" }} />
      </div>
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder="Write a message…" style={{ width: "100%", minHeight: "180px", border: "none", outline: "none", resize: "none", padding: "14px 16px", fontSize: "13.5px", lineHeight: "1.6", color: "#1a1a1a", fontFamily: "inherit", background: "#fff", boxSizing: "border-box" }} />
      <div style={{ borderTop: "1px solid #e8e8e8", padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: "2px" }}>
          {[Icon.Attach, Icon.Emoji, Icon.Image].map((Ic, i) => <button key={i} style={liToolBtn as any}><Ic /></button>)}
        </div>
        <button style={{ background: "#0a66c2", color: "#fff", border: "none", borderRadius: "16px", padding: "6px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s" }}>Send</button>
      </div>
    </div>
  );
}

function GmailEditor({ value, onChange, to, onToChange, subject, onSubjectChange }: any) {
  const gmIconBtn = { background: "none", border: "none", color: "rgba(255,255,255,0.8)", cursor: "pointer", padding: "2px 4px", borderRadius: "3px", display: "flex", alignItems: "center" };
  const gmLabelBtn = { background: "none", border: "none", color: "#444", fontSize: "12px", fontWeight: 500, cursor: "pointer", padding: "2px 6px" };
  const gmToolBtn = { background: "none", border: "none", color: "#444", padding: "5px 7px", cursor: "pointer", borderRadius: "4px", display: "flex", alignItems: "center", transition: "background 0.12s" };

  return (
    <div style={{ width: "100%", borderRadius: "8px 8px 0 0", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.10)", fontFamily: "'Google Sans', Roboto, -apple-system, sans-serif", background: "#fff", border: "1px solid #c9c9c9", borderBottom: "none" }}>
      <div style={{ background: "#404040", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "#fff", fontSize: "13px", fontWeight: 500 }}>New Message</span>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button style={gmIconBtn as any}><Icon.Minimize /></button>
          <button style={gmIconBtn as any}><Icon.Expand /></button>
          <button style={gmIconBtn as any}><Icon.Close /></button>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #e0e0e0", padding: "0 12px" }}>
        <span style={{ fontSize: "13px", color: "#444", minWidth: 60, padding: "10px 0" }}>Recipients</span>
        <input value={to} onChange={e => onToChange(e.target.value)} style={{ border: "none", outline: "none", flex: 1, fontSize: "13px", padding: "10px 6px", color: "#1a1a1a", background: "transparent", fontFamily: "inherit" }} />
        <div style={{ display: "flex", gap: "8px" }}><button style={gmLabelBtn as any}>Cc</button><button style={gmLabelBtn as any}>Bcc</button></div>
      </div>
      <div style={{ borderBottom: "1px solid #e0e0e0", padding: "0 12px" }}>
        <input value={subject} onChange={e => onSubjectChange(e.target.value)} placeholder="Subject" style={{ border: "none", outline: "none", width: "100%", fontSize: "13px", padding: "10px 0", color: "#1a1a1a", background: "transparent", fontFamily: "inherit", boxSizing: "border-box" }} />
      </div>
      <textarea value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%", minHeight: "180px", border: "none", outline: "none", resize: "none", padding: "12px", fontSize: "13.5px", lineHeight: "1.65", color: "#1a1a1a", fontFamily: "inherit", background: "#fff", boxSizing: "border-box" }} />
      <div style={{ borderTop: "1px solid #e0e0e0", padding: "8px 12px", display: "flex", alignItems: "center", gap: "4px", background: "#f8f8f8" }}>
        <div style={{ display: "flex", alignItems: "center", marginRight: "4px" }}>
          <button style={{ background: "#0b57d0", color: "#fff", border: "none", borderRadius: "4px 0 0 4px", padding: "7px 18px", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Send</button>
          <button style={{ background: "#0b57d0", color: "#fff", border: "none", borderLeft: "1px solid rgba(255,255,255,0.3)", borderRadius: "0 4px 4px 0", padding: "7px 6px", cursor: "pointer" }}><Icon.ChevronDown /></button>
        </div>
        <div style={{ width: "1px", height: "20px", background: "#ddd", margin: "0 4px" }} />
        {[Icon.Bold, Icon.Italic, Icon.Link, Icon.List, Icon.Attach, Icon.Emoji, Icon.Image, Icon.More].map((Ic, i) => <button key={i} style={gmToolBtn as any}><Ic /></button>)}
        <div style={{ flex: 1 }} />
        <button style={gmToolBtn as any}><Icon.Delete /></button>
      </div>
    </div>
  );
}

function UpworkEditor({ value, onChange, charLimit = 5000 }: any) {
  const remaining = charLimit - value.length;
  const pct = Math.min(100, (value.length / charLimit) * 100);
  return (
    <div style={{ width: "100%", borderRadius: "8px", overflow: "hidden", background: "#fff", border: "1px solid #d5d9e2", boxShadow: "0 2px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", borderTop: "3px solid #14a800" }}>
      <div style={{ padding: "14px 18px 12px", borderBottom: "1px solid #eef0f3", background: "#fafafa" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a1a", display: "block" }}>Cover Letter</span>
            <span style={{ fontSize: "11.5px", color: "#7a8697", marginTop: "2px", display: "block" }}>Describe your approach and why you're a great fit</span>
          </div>
          <div style={{ background: "#e6f9e6", border: "1px solid #b3e6b3", borderRadius: "12px", padding: "3px 10px", fontSize: "11px", color: "#14a800", fontWeight: 600, letterSpacing: "0.03em" }}>Required</div>
        </div>
      </div>
      <div style={{ padding: "0" }}>
        <textarea value={value} onChange={e => onChange(e.target.value.slice(0, charLimit))} placeholder="Start with a personalized introduction..." style={{ width: "100%", minHeight: "200px", border: "none", outline: "none", resize: "vertical", padding: "16px 18px", fontSize: "14px", lineHeight: "1.7", color: "#1a1a1a", fontFamily: "inherit", background: "#fff", boxSizing: "border-box" }} />
      </div>
      <div style={{ borderTop: "1px solid #eef0f3", padding: "10px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fafafa" }}>
        <div style={{ flex: 1, marginRight: "16px" }}>
          <div style={{ height: "3px", background: "#eef0f3", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: pct > 90 ? "#f44336" : "#14a800", borderRadius: "2px", transition: "width 0.2s, background 0.2s" }} />
          </div>
          <span style={{ fontSize: "11px", color: remaining < 200 ? "#f44336" : "#7a8697", marginTop: "4px", display: "block" }}>{remaining.toLocaleString()} characters remaining</span>
        </div>
        <button style={{ background: "#14a800", color: "#fff", border: "none", borderRadius: "20px", padding: "8px 22px", fontSize: "13.5px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.01em" }}>Apply Now</button>
      </div>
    </div>
  );
}

function ToptalEditor({ value, onChange }: any) {
  return (
    <div style={{ width: "100%", borderRadius: "10px", overflow: "hidden", background: "#0d1117", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 20px 60px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)", fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div style={{ padding: "16px 20px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "linear-gradient(135deg, #0f1923 0%, #131d2e 100%)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "18px", height: "18px", borderRadius: "4px", background: "linear-gradient(135deg, #1a8fff 0%, #0066cc 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon.Star /></div>
            <span style={{ color: "#e8edf5", fontSize: "13px", fontWeight: 600, letterSpacing: "0.02em" }}>Expert Application</span>
            <div style={{ background: "rgba(26,143,255,0.12)", border: "1px solid rgba(26,143,255,0.25)", borderRadius: "10px", padding: "2px 8px", fontSize: "10px", fontWeight: 700, color: "#4da6ff", letterSpacing: "0.08em" }}>TOP 3%</div>
          </div>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)", margin: "4px 0 0", letterSpacing: "0.02em" }}>Craft your pitch for elite clients</p>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>{["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width: "11px", height: "11px", borderRadius: "50%", background: c, opacity: 0.85 }} />)}</div>
      </div>
      <div style={{ padding: "10px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", gap: "16px" }}>
        {["Engagement type", "Rate", "Availability"].map((label, i) => (
          <div key={label} style={{ flex: 1 }}>
            <span style={{ display: "block", fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>{label}</span>
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "5px", padding: "5px 10px", fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>{["Full-time", "$120 / hr", "Immediate"][i]}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "relative" }}>
        <textarea value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%", minHeight: "210px", border: "none", outline: "none", resize: "vertical", padding: "18px 20px", fontSize: "14px", lineHeight: "1.75", color: "rgba(232,237,245,0.92)", fontFamily: "inherit", background: "transparent", boxSizing: "border-box", caretColor: "#4da6ff" }} />
        <div style={{ position: "absolute", left: 20, top: 18, width: "2px", height: "calc(100% - 36px)", background: "rgba(26,143,255,0.15)", borderRadius: "2px" }} />
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          {[Icon.Bold, Icon.Italic, Icon.Link, Icon.Attach].map((Ic, i) => <button key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.45)", padding: "5px 8px", cursor: "pointer", borderRadius: "5px", display: "flex", alignItems: "center", transition: "all 0.12s" }}><Ic /></button>)}
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.04em" }}>{value.length} / 2000</span>
          <button style={{ background: "linear-gradient(135deg, #1a8fff 0%, #0059b3 100%)", color: "#fff", border: "none", borderRadius: "6px", padding: "8px 20px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.02em", boxShadow: "0 2px 12px rgba(26,143,255,0.35)" }}>Submit Pitch</button>
        </div>
      </div>
    </div>
  );
}

function GenerateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const leadTitle = searchParams.get('title') ?? '';
  const leadDesc  = searchParams.get('desc')  ?? '';

  const [jobDesc, setJobDesc]   = useState(leadDesc);
  const [skills, setSkills]     = useState('React, TypeScript, Node.js, Next.js');
  const [tone, setTone]         = useState<Tone>('confident');
  const [platform, setPlatform] = useState<Platform>('upwork');
  const [proposal, setProposal] = useState('');
  const [to, setTo]             = useState('');
  const [subject, setSubject]   = useState('');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated]   = useState(false);
  const [copied, setCopied]     = useState(false);
  const [error, setError]       = useState('');
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setWordCount(proposal.trim() ? proposal.trim().split(/\s+/).length : 0);
  }, [proposal]);

  const handleGenerate = async (usePro = false) => {
    if (generating || !jobDesc.trim()) return;
    setGenerating(true);
    setGenerated(false);
    setProposal('');
    setError('');

    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDesc,
          tone,
          platform,
          skills,
          leadTitle,
          usePro,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.requiresUpgrade) {
          router.push('/app/settings#pricing');
          return;
        }
        setError(data.error ?? 'Generation failed');
        setGenerating(false);
        return;
      }

      const result: string = data.proposal ?? '';
      setGenerating(false);
      setGenerated(true);

      // Typewriter effect
      let i = 0;
      const interval = setInterval(() => {
        i += 3;
        setProposal(result.slice(0, i));
        if (i >= result.length) { setProposal(result); clearInterval(interval); }
      }, 10);
    } catch {
      setError('Network error — please try again');
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(proposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Generate Proposal</h1>
          {leadTitle && <p className={styles.pageSubtitle}>For: {leadTitle}</p>}
        </div>
        {generated && <span className={styles.wordCount}>{wordCount} words</span>}
      </div>

      <div className={styles.splitLayout}>
        {/* LEFT */}
        <div className={styles.leftPane}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Job Description</label>
            <textarea
              className={styles.jobTextarea}
              placeholder="Paste the full job description here..."
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Your Key Skills</label>
            <input
              type="text" className={styles.input}
              placeholder="React, TypeScript, Node.js..."
              value={skills} onChange={e => setSkills(e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Platform</label>
            <div className={styles.segmented}>
              {PLATFORM_OPTIONS.map(p => (
                <button
                  key={p.value}
                  className={`${styles.segmentBtn} ${platform === p.value ? styles.segmentActive : ''}`}
                  onClick={() => setPlatform(p.value)}
                >{p.label}</button>
              ))}
            </div>
          </div>

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

          <div className={styles.btnRow}>
            <button
              className={`${styles.generateBtn} ${generating ? styles.generateBtnLoading : ''}`}
              onClick={() => handleGenerate(false)}
              disabled={!jobDesc.trim() || generating}
            >
              {generating ? (
                <><span className={styles.spinner}/> Crafting...</>
              ) : (
                <><svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L10 6H15L11 9L12.5 14L8 11.5L3.5 14L5 9L1 6H6L8 1Z" fill="currentColor"/>
                </svg>
                {generated ? 'Regenerate' : 'Generate Proposal'}</>
              )}
            </button>
            <button
              className={`${styles.generateBtn} ${styles.proBtn}`}
              onClick={() => handleGenerate(true)}
              disabled={!jobDesc.trim() || generating}
            >
              ✨ Enhance (Pro)
            </button>
          </div>

          {error && <p className={styles.errorMsg}>{error}</p>}
        </div>

        <div className={styles.divider}/>

        {/* RIGHT */}
        <div className={styles.rightPane}>
          <div className={styles.outputHeader}>
            <span className={styles.outputTitle}>
              {generating ? 'Drafting Proposal...' : generated ? 'Your Proposal' : 'Output'}
            </span>
            {generated && !generating && (
              <div className={styles.outputActions}>
                <button className="btn btn-ghost btn-sm" onClick={() => handleGenerate(false)}>
                  <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                    <path d="M1.5 6.5A5 5 0 0111.5 4M11.5 2v2h-2M11.5 6.5A5 5 0 011.5 9M1.5 11V9h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Regenerate
                </button>
                <button className={`btn btn-ghost btn-sm ${copied ? styles.copiedBtn : ''}`} onClick={handleCopy}>
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            )}
          </div>

          <div className={styles.outputBody}>
            {generating && (
              <div className={styles.outputLoading}>
                <div className={styles.loadingBar}><div className={styles.loadingBarFill}/></div>
                <p className={styles.loadingText}>Analyzing job post & generating proposal...</p>
                <div className={styles.skeletons}>
                  {[55, 80, 68, 90, 73, 58, 42].map((w, i) => (
                    <div key={i} className="skeleton" style={{ height: 12, width: `${w}%` }}/>
                  ))}
                </div>
              </div>
            )}

            {!generating && generated && (
              <div style={{ padding: '24px', width: '100%', boxSizing: 'border-box', background: platform === 'toptal' ? '#06080d' : '#f5f7fa', minHeight: '100%', flex: 1, display: 'flex', alignItems: 'flex-start', overflowY: 'auto' }}>
                <div style={{ width: '100%', maxWidth: '640px', margin: '0 auto' }}>
                  {platform === 'linkedin' && <LinkedInEditor value={proposal} onChange={setProposal} to={to} onToChange={setTo} />}
                  {platform === 'email' && <GmailEditor value={proposal} onChange={setProposal} to={to} onToChange={setTo} subject={subject} onSubjectChange={setSubject} />}
                  {platform === 'upwork' && <UpworkEditor value={proposal} onChange={setProposal} />}
                  {platform === 'toptal' && <ToptalEditor value={proposal} onChange={setProposal} />}
                </div>
              </div>
            )}

            {!generating && !generated && (
              <div className={styles.outputEmpty}>
                <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
                  <rect x="8" y="8" width="32" height="32" rx="5" stroke="currentColor" strokeWidth="1.3" opacity="0.15"/>
                  <path d="M16 20h16M16 26h12M16 32h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.15"/>
                  <circle cx="36" cy="12" r="6" fill="rgba(240,240,240,0.08)"/>
                  <path d="M36 9v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.3"/>
                </svg>
                <p className={styles.emptyTitle}>Your proposal will appear here</p>
                <p className={styles.emptyDesc}>Paste a job description and hit Generate</p>
              </div>
            )}
          </div>

          {generated && !generating && (
            <div className={styles.outputFooter}>
              <span className={styles.tip}>
                Tip: Personalise before sending — AI drafts are starting points
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
      <GenerateContent/>
    </Suspense>
  );
}
