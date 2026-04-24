/**
 * Local lead scorer — no AI needed, fast regex/keyword matching.
 * AI insights are generated separately via Groq on demand.
 */

import type { ScrapedLead } from './scraper';

type Tag = 'urgent' | 'high-budget' | 'good-fit' | 'remote' | 'long-term' | 'new-client';

interface ScoredLead extends ScrapedLead {
  tags: Tag[];
}

const URGENT_WORDS   = ['urgent', 'asap', 'immediately', 'today', 'tonight', 'deadline', 'quick', 'fast turnaround'];
const BUDGET_HIGH    = ['$3,000', '$4,000', '$5,000', '$6,000', '$7,000', '$8,000', '$10,000', 'k+', '/yr', 'annual', 'senior', 'lead', 'staff'];
const REMOTE_WORDS   = ['remote', 'anywhere', 'worldwide', 'distributed', 'async'];
const LONGTERM_WORDS = ['long-term', 'ongoing', 'renewable', 'full-time', 'retainer', 'contract', 'monthly', '3 month', '6 month'];
const NEWCLIENT_SIGNS = ['first project', 'new to', 'small team', 'just started', 'no previous'];

function isUrgent(text: string)   { return URGENT_WORDS.some(w => text.includes(w)); }
function isHighBudget(text: string) { return BUDGET_HIGH.some(w => text.includes(w)); }
function isRemote(text: string)   { return REMOTE_WORDS.some(w => text.includes(w)); }
function isLongTerm(text: string) { return LONGTERM_WORDS.some(w => text.includes(w)); }
function isNewClient(text: string){ return NEWCLIENT_SIGNS.some(w => text.includes(w)); }

function computeScore(lead: ScrapedLead, query: string): number {
  const text = `${lead.title} ${lead.fullDescription}`.toLowerCase();
  const qWords = query.toLowerCase().split(/\s+/);

  let score = 40;

  // Query keyword match
  qWords.forEach(w => { if (text.includes(w)) score += 10; });

  // Skill match bonus
  score += Math.min(lead.skills.length * 4, 20);

  // Budget signals
  if (isHighBudget(text)) score += 15;

  // Remote preferred
  if (isRemote(text)) score += 5;

  // Long-term
  if (isLongTerm(text)) score += 8;

  // Description quality (longer = more detailed client)
  if (lead.fullDescription.length > 400) score += 5;
  if (lead.fullDescription.length > 800) score += 5;

  // Platform trust
  if (lead.platform === 'Upwork') score += 5;
  if (lead.platform === 'Direct') score += 3;

  return Math.min(Math.max(Math.round(score), 30), 98);
}

function buildTags(text: string): Tag[] {
  const tags: Tag[] = [];
  if (isUrgent(text))   tags.push('urgent');
  if (isHighBudget(text)) tags.push('high-budget');
  if (isRemote(text))   tags.push('remote');
  if (isLongTerm(text)) tags.push('long-term');
  if (isNewClient(text)) tags.push('new-client');
  return tags;
}

function buildInsights(lead: ScrapedLead, tags: Tag[]): string[] {
  const insights: string[] = [];
  const text = lead.fullDescription.toLowerCase();

  if (tags.includes('high-budget'))  insights.push('High budget signal — above-market rate likely');
  if (tags.includes('urgent'))       insights.push('Urgency flag — client wants to move fast');
  if (tags.includes('long-term'))    insights.push('Long-term engagement signals strong LTV potential');
  if (tags.includes('remote'))       insights.push('Fully remote — no location constraint');
  if (lead.skills.length >= 5)       insights.push(`Strong skill match — ${lead.skills.length} of your skills required`);
  if (lead.platform === 'Upwork')    insights.push('Upwork platform — escrow protection available');
  if (lead.platform === 'Direct')    insights.push('Direct client — no platform fees apply');
  if (lead.fullDescription.length > 600) insights.push('Detailed brief — client knows what they want');
  if (text.includes('startup'))      insights.push('Startup client — potential equity or long-term upside');
  if (text.includes('funded') || text.includes('series')) insights.push('Funded company — budget confidence is high');

  return insights.slice(0, 4);
}

export function scoreLeads(leads: ScrapedLead[], query: string): ScrapedLead[] {
  return leads
    .map(lead => {
      const text = `${lead.title} ${lead.fullDescription}`.toLowerCase();
      const tags = buildTags(text);
      const score = computeScore(lead, query);
      const aiInsights = buildInsights(lead, tags);
      const goodFit = score >= 70 && !tags.includes('good-fit');
      if (goodFit) tags.push('good-fit');

      return { ...lead, tags, score, aiInsights } as ScrapedLead;
    })
    .sort((a, b) => b.score - a.score);
}
