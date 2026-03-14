import { NextResponse } from 'next/server';
import { saveChallengeStateSchema } from '@/lib/api/live-contracts';
import { isSupabaseConfigured } from '@/lib/config/env';
import {
  loadChallengeState,
  saveChallengeState,
  type ServerSupabaseClient,
} from '@/lib/demo/server-state';
import { createChallengeServerClient } from '@/lib/supabase/server';

async function resolveAuthenticatedStateClient() {
  if (!isSupabaseConfigured()) {
    return { error: NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 }) };
  }

  const supabase = (await createChallengeServerClient()) as unknown as ServerSupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: NextResponse.json({ error: 'Authentication required.' }, { status: 401 }) };
  }

  return { supabase, userId: user.id };
}

export async function GET() {
  const resolved = await resolveAuthenticatedStateClient();

  if ('error' in resolved) {
    return resolved.error;
  }

  try {
    const state = await loadChallengeState({
      supabase: resolved.supabase,
      userId: resolved.userId,
    });

    return NextResponse.json(state);
  } catch (error) {
    console.error('[demo-state:get] failed', error);
    return NextResponse.json({ error: 'Failed to load challenge state.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const resolved = await resolveAuthenticatedStateClient();

  if ('error' in resolved) {
    return resolved.error;
  }

  const payload = saveChallengeStateSchema.safeParse(await request.json().catch(() => null));

  if (!payload.success) {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
  }

  try {
    const state = await saveChallengeState({
      supabase: resolved.supabase,
      userId: resolved.userId,
      state: payload.data.state,
    });

    return NextResponse.json(state);
  } catch (error) {
    console.error('[demo-state:put] failed', error);
    return NextResponse.json({ error: 'Failed to save challenge state.' }, { status: 500 });
  }
}
