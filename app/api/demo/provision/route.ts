import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/config/env';
import { provisionRequestSchema } from '@/lib/api/live-contracts';
import { createEmptyChallengeState, provisionChallengeState } from '@/lib/demo/challenge-state';
import {
  loadChallengeState,
  saveChallengeState,
  type ServerSupabaseClient,
} from '@/lib/demo/server-state';
import { buildStarterDemoContent } from '@/lib/demo/starter-content';
import { createChallengeServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const payload = provisionRequestSchema.safeParse(await request.json().catch(() => null));

  if (!payload.success) {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    if (!payload.data.userId) {
      return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
    }

    const starter = buildStarterDemoContent({ userId: payload.data.userId });
    return NextResponse.json(provisionChallengeState(createEmptyChallengeState(), starter));
  }

  try {
    const supabase = (await createChallengeServerClient()) as unknown as ServerSupabaseClient;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const currentState = payload.data.reset
      ? createEmptyChallengeState()
      : await loadChallengeState({ supabase, userId: user.id });
    const starter = buildStarterDemoContent({ userId: user.id });
    const nextState = provisionChallengeState(currentState, starter);
    const persisted = await saveChallengeState({
      supabase,
      userId: user.id,
      state: nextState,
    });

    return NextResponse.json(persisted);
  } catch (error) {
    console.error('[demo-provision] failed', error);
    return NextResponse.json({ error: 'Failed to provision challenge state.' }, { status: 500 });
  }
}
