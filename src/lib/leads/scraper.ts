/**
 * Lead Scraper — aggregates from 3 free public sources:
 *   1. RemoteOK JSON API   (https://remoteok.com/api)
 *   2. Upwork RSS feed     (https://www.upwork.com/ab/feed/jobs/rss)
 *   3. HackerNews Hiring   (Algolia API)
 */

import { scoreLeads } from './scorer';

/** Decode HTML entities and strip tags cleanly */
function cleanHtml(raw: string): string {
  return raw
    // Decode common HTML entities first
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&#\d+;/g, ' ')
    // Strip remaining HTML tags
    .replace(/<[^>]+>/g, ' ')
    // Remove UTF-8 mis-encoding artefacts (Â from &nbsp; etc.)
    .replace(/\u00c2/g, '')
    .replace(/\u00a0/g, ' ')
    // Collapse whitespace
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export interface ScrapedLead {
  id: string;
  title: string;
  client: string;
  platform: 'Upwork' | 'LinkedIn' | 'RemoteOK' | 'HackerNews' | 'Freelancer' | 'Direct';
  url: string;
  posted: string;
  budget: string;
  description: string;
  fullDescription: string;
  tags: string[];
  score: number;
  skills: string[];
  aiInsights: string[];
  saved?: boolean;
}

/* ── helpers ── */
function relativeTime(date: Date | string): string {
  const ms = Date.now() - new Date(date).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function extractSkills(text: string): string[] {
  const SKILL_KEYWORDS = [
    'React','Next.js','TypeScript','JavaScript','Node.js','Python','Vue','Angular',
    'GraphQL','REST','PostgreSQL','MySQL','MongoDB','Redis','AWS','GCP','Azure',
    'Docker','Kubernetes','Figma','Tailwind','CSS','HTML','Swift','Kotlin','Flutter',
    'Django','FastAPI','Rails','Laravel','Rust','Go','Solidity','Web3','AI','LLM',
    'OpenAI','Stripe','Supabase','Firebase','Prisma','tRPC',
    // Non-tech / Creative / Marketing
    'Video Editor','Video Editing','Premiere Pro','After Effects','Final Cut Pro',
    'DaVinci Resolve','Photoshop','Illustrator','Graphic Design','UI/UX','Copywriting',
    'SEO','Sales','SDR','B2B','Marketing','Content Creation','Social Media',
    'Lead Generation','Cold Calling','Email Marketing','Shopify','WordPress','Webflow'
  ];
  const found = new Set<string>();
  const lower = text.toLowerCase();
  SKILL_KEYWORDS.forEach(s => { if (lower.includes(s.toLowerCase())) found.add(s); });
  return [...found].slice(0, 8);
}

function extractBudget(text: string): string {
  const patterns = [
    /\$[\d,]+\s*[-–]\s*\$[\d,]+/,
    /\$[\d,]+(?:k)?(?:\s*\/\s*(?:hr|hour|month|mo|year|yr))?/i,
    /[\d,]+\s*[-–]\s*[\d,]+\s*(?:USD|GBP|EUR)/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[0];
  }
  return 'Negotiable';
}

/* ── Source 1: Reddit (Global Search for high relevance) ── */
async function fetchRedditLeads(query: string): Promise<ScrapedLead[]> {
  try {
    const leads: ScrapedLead[] = [];
    
    // Fallback if query is empty
    const safeQuery = query ? encodeURIComponent(query.trim()) : 'developer';
    // Search across top freelance subreddits for [hiring] tags + the user's specific query
    const url = `https://www.reddit.com/search.json?q=subreddit:(forhire OR freelance_forhire) title:hiring ${safeQuery}&sort=new&limit=25`;

    const res = await fetch(url, {
      headers: { 'User-Agent': 'ClientGravityAI/1.1' },
      next: { revalidate: 300 }, // Cache for 5 mins
    });
    if (!res.ok) return [];
    
    const json = await res.json();
    const posts = json.data?.children ?? [];

    for (const p of posts) {
      const data = p.data;
      if (!data.title?.toLowerCase().includes('hiring')) continue;

      const title = data.title.replace(/\[hiring\]/i, '').trim();
      const desc = cleanHtml(data.selftext ?? '');
      if (desc.length < 30) continue; // Skip empty posts

      leads.push({
        id: `reddit-${data.id}`,
        title: title.slice(0, 100),
        client: data.author ?? 'Reddit Client',
        platform: 'Reddit' as any,
        url: `https://reddit.com${data.permalink}`,
        posted: relativeTime(new Date(data.created_utc * 1000)),
        budget: extractBudget(title + ' ' + desc),
        description: desc.slice(0, 200) + (desc.length > 200 ? '...' : ''),
        fullDescription: desc,
        tags: [],
        score: 0,
        skills: extractSkills(title + ' ' + desc),
        aiInsights: [],
      });
    }
    
    return leads;
  } catch (e) {
    console.error('[Reddit]', e);
    return [];
  }
}

/* ── Source 2: WeWorkRemotely Contract RSS ── */
async function fetchWWRContract(): Promise<ScrapedLead[]> {
  try {
    const res = await fetch('https://weworkremotely.com/categories/remote-contract-jobs.rss', {
      headers: { 'User-Agent': 'ClientGravityAI/1.0' },
      next: { revalidate: 1800 },
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
    return items.slice(0, 15).map((m, i) => {
      const item = m[1];
      const get = (tag: string) =>
        (item.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>|<${tag}[^>]*>([^<]*)</${tag}>`)) ?? [])[1] ?? (item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`)) ?? [])[1] ?? '';

      const titleRaw = get('title').trim();
      const title = titleRaw.split(':').pop()?.trim() ?? titleRaw;
      const client = titleRaw.split(':')[0]?.trim() ?? 'WWR Client';
      const desc  = cleanHtml(get('description'));
      const link  = get('link').trim();
      const pubDate = get('pubDate').trim();

      return {
        id: `wwr-${i}-${Date.now()}`,
        title: title || 'Contract Role',
        client: client,
        platform: 'WWR' as any,
        url: link,
        posted: pubDate ? relativeTime(new Date(pubDate)) : 'Recently',
        budget: extractBudget(desc),
        description: desc.slice(0, 200) + (desc.length > 200 ? '...' : ''),
        fullDescription: desc,
        tags: [],
        score: 0,
        skills: extractSkills(title + ' ' + desc),
        aiInsights: [],
      };
    });
  } catch (e) {
    console.error('[WWR]', e);
    return [];
  }
}

/* ── Main aggregator ── */
export async function scrapeLeads(query = 'react developer'): Promise<ScrapedLead[]> {
  const [reddit, wwr] = await Promise.allSettled([
    fetchRedditLeads(query),
    fetchWWRContract(),
  ]);

  const all: ScrapedLead[] = [
    ...(reddit.status === 'fulfilled' ? reddit.value : []),
    ...(wwr.status    === 'fulfilled' ? wwr.value    : []),
  ];

  // Score all leads
  return scoreLeads(all, query);
}
