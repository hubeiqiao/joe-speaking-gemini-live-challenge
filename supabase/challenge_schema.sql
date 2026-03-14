create table if not exists public.challenge_user_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null default '{"collectionItems":[],"sessions":[],"reviews":[]}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_challenge_user_state_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists challenge_user_state_set_updated_at on public.challenge_user_state;

create trigger challenge_user_state_set_updated_at
before update on public.challenge_user_state
for each row
execute function public.set_challenge_user_state_updated_at();

alter table public.challenge_user_state enable row level security;

drop policy if exists "challenge_user_state_select_own" on public.challenge_user_state;
create policy "challenge_user_state_select_own"
on public.challenge_user_state
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "challenge_user_state_insert_own" on public.challenge_user_state;
create policy "challenge_user_state_insert_own"
on public.challenge_user_state
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "challenge_user_state_update_own" on public.challenge_user_state;
create policy "challenge_user_state_update_own"
on public.challenge_user_state
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

grant select, insert, update on public.challenge_user_state to authenticated;
