import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { leadId, leadData } = body;

  const { error } = await supabase.from('saved_leads').upsert({
    user_id: user.id,
    lead_id: leadId,
    lead_data: leadData,
  }, { onConflict: 'user_id,lead_id' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ saved: true });
}

export async function DELETE(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const leadId = searchParams.get('leadId');
  if (!leadId) return NextResponse.json({ error: 'Missing leadId' }, { status: 400 });

  const { error } = await supabase
    .from('saved_leads')
    .delete()
    .eq('user_id', user.id)
    .eq('lead_id', leadId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ saved: false });
}
