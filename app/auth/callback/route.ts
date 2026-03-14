import { NextResponse } from 'next/server';
import { sanitizeNextPath } from '@/lib/auth/sanitize-next-path';
import { getPublicAppUrl } from '@/lib/config/env';
import { isSupabaseConfigured } from '@/lib/config/env';
import { createChallengeServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const nextPath = sanitizeNextPath(requestUrl.searchParams.get('next'));
  const code = requestUrl.searchParams.get('code');

  if (!isSupabaseConfigured() || !code) {
    return NextResponse.redirect(new URL(nextPath, getPublicAppUrl()));
  }

  const supabase = await createChallengeServerClient();
  await supabase.auth.exchangeCodeForSession(code);

  return NextResponse.redirect(new URL(nextPath, getPublicAppUrl()));
}
