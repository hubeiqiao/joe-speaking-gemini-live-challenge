import { createEmptyChallengeState, normalizeChallengeState } from '@/lib/demo/challenge-state';
import type { ChallengeDemoState } from '@/lib/types/challenge';

const STATE_TABLE = 'challenge_user_state';

export interface ServerSupabaseClient {
  auth: {
    getUser: () => Promise<{ data: { user: { id: string } | null } }>;
  };
  from: (table: string) => {
    select: (columns: string) => {
      eq: (column: string, value: string) => {
        maybeSingle: () => Promise<{ data: { state?: unknown } | null; error: { message?: string } | null }>;
      };
    };
    upsert: (
      values: { user_id: string; state: ChallengeDemoState; updated_at: string },
      options?: { onConflict?: string },
    ) => {
      select: (columns: string) => {
        single: () => Promise<{ data: { state?: unknown } | null; error: { message?: string } | null }>;
      };
    };
  };
}

export async function loadChallengeState({
  supabase,
  userId,
}: {
  supabase: ServerSupabaseClient;
  userId: string;
}): Promise<ChallengeDemoState> {
  const { data, error } = await supabase
    .from(STATE_TABLE)
    .select('state')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || 'Failed to load challenge state.');
  }

  if (!data?.state) {
    return createEmptyChallengeState();
  }

  return normalizeChallengeState(data.state);
}

export async function saveChallengeState({
  supabase,
  userId,
  state,
}: {
  supabase: ServerSupabaseClient;
  userId: string;
  state: ChallengeDemoState;
}): Promise<ChallengeDemoState> {
  const { data, error } = await supabase
    .from(STATE_TABLE)
    .upsert(
      {
        user_id: userId,
        state,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    )
    .select('state')
    .single();

  if (error) {
    throw new Error(error.message || 'Failed to save challenge state.');
  }

  return normalizeChallengeState(data?.state ?? state);
}
