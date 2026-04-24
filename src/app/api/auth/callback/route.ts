import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/app/leads';

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      // Check if profile exists and has skills
      const { data: profile } = await supabase.from('profiles').select('skills').eq('id', data.user.id).single();
      if (!profile || !profile.skills || profile.skills.length === 0) {
        return NextResponse.redirect(`${origin}/app/onboarding`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth error — redirect to sign-in with error flag
  return NextResponse.redirect(`${origin}/signin?error=auth_callback_failed`);
}
