import { NextResponse } from 'next/server';
import { scrapeLeads } from '@/lib/leads/scraper';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const revalidate = 1800; // cache 30 min

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') ?? 'react developer';

  try {
    const leads = await scrapeLeads(query);

    // If user is authenticated, mark which leads they've saved
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: saved } = await supabase
        .from('saved_leads')
        .select('lead_id')
        .eq('user_id', user.id);

      const savedIds = new Set((saved ?? []).map((s: any) => s.lead_id));
      const withSaved = leads.map(l => ({ ...l, saved: savedIds.has(l.id) }));
      return NextResponse.json({ leads: withSaved, total: withSaved.length });
    }

    return NextResponse.json({ leads, total: leads.length });
  } catch (error) {
    console.error('[/api/leads]', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}
