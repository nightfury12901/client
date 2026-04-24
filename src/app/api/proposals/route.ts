import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import Groq from 'groq-sdk';
import OpenAI from 'openai';

type Tone     = 'professional' | 'confident' | 'friendly' | 'brief';
type Platform = 'upwork' | 'linkedin' | 'email' | 'toptal';

const SYSTEM_PROMPT = `You are an expert freelance proposal writer. Write high-converting, concise freelance proposals.
Rules:
- Sound human and specific to THIS job, never generic
- Keep it under 250 words
- Use the exact tone requested
- Reference specific details from the job description
- End with a clear next step (call, quick question, etc.)
- Do NOT include subject lines, just the proposal body`;

function buildUserPrompt(jobDesc: string, skills: string, tone: Tone, platform: Platform, name: string): string {
  const toneGuide: Record<Tone, string> = {
    professional: 'formal, structured, uses "I" professionally, no emoji',
    confident:    'direct and assertive, results-focused, no fluff, uses dashes for emphasis',
    friendly:     'warm, conversational, one emoji max, feels like a peer talking',
    brief:        'ultra-short — 3 paragraphs max, punchy sentences, respects their time',
  };

  const platformNote: Record<Platform, string> = {
    upwork:   'mention Upwork JSS/history naturally if relevant',
    linkedin:  'reference their LinkedIn profile or company if visible',
    email:    'start with how you found them, offer to share samples',
    toptal:   'mention Toptal vetting / top 3% briefly',
  };

  return `Write a ${tone} freelance proposal for this job posting.

Tone guide: ${toneGuide[tone]}
Platform note: ${platformNote[platform]}

Freelancer name: ${name}
Freelancer skills: ${skills}

Job Description:
${jobDesc.slice(0, 2000)}

Write the proposal now:`;
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { jobDesc, tone = 'confident', platform = 'upwork', skills = 'React, TypeScript, Node.js', leadId, leadTitle, usePro } = body;

  if (!jobDesc?.trim()) return NextResponse.json({ error: 'jobDesc is required' }, { status: 400 });

  // If using Pro, verify subscription
  if (usePro) {
    const { data: sub } = await supabase.from('subscriptions').select('status, plan').eq('user_id', user.id).single();
    if (!sub || sub.status !== 'active') {
      return NextResponse.json({ error: 'Pro plan required for GPT-4o', requiresUpgrade: true }, { status: 403 });
    }
  }

  // Get user display name from profile
  const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
  const name = profile?.full_name ?? user.email?.split('@')[0] ?? 'Alex';

  const systemMsg = SYSTEM_PROMPT;
  const userMsg   = buildUserPrompt(jobDesc, skills, tone as Tone, platform as Platform, name);

  let proposal = '';

  try {
    if (usePro) {
      // Use OpenAI GPT-4o for Pro
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemMsg },
          { role: 'user',   content: userMsg },
        ],
        max_tokens: 600,
        temperature: 0.7,
      });
      proposal = completion.choices[0]?.message?.content ?? '';
    } else {
      // Use Groq for Free
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemMsg },
          { role: 'user',   content: userMsg },
        ],
        max_tokens: 600,
        temperature: 0.7,
      });
      proposal = completion.choices[0]?.message?.content ?? '';
    }
  } catch (err) {
    console.error('[AI failed]', err);
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 });
  }

  // Persist to DB
  await supabase.from('proposals').insert({
    user_id: user.id,
    lead_id: leadId ?? null,
    lead_title: leadTitle ?? null,
    content: proposal,
    tone,
    platform,
  });

  return NextResponse.json({ proposal });
}
