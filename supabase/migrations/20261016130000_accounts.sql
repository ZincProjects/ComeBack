-- ComeBack accounts: username-only profiles + per-user app state, locked down with RLS.
-- Applied to Supabase project "ComeBack" (ddoapvyluddtteahlbdw) on 2026-10-16.

-- Profiles: one per auth user, username only (no real names / emails stored here)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9_]{3,20}$'),
  created_at timestamptz not null default now()
);

-- App state: one JSON document per user (rehab progress, check-ins, chat, etc.)
create table public.user_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb
    check (jsonb_typeof(data) = 'object' and pg_column_size(data) < 65536),
  updated_at timestamptz not null default now()
);

-- Sign-up attempts per IP, written only by the signup Edge Function (service role).
create table public.signup_attempts (
  id bigint generated always as identity primary key,
  ip text not null,
  created_at timestamptz not null default now()
);
create index signup_attempts_ip_time on public.signup_attempts (ip, created_at desc);

alter table public.profiles enable row level security;
alter table public.user_state enable row level security;
alter table public.signup_attempts enable row level security;

-- Least privilege: anon gets nothing; authenticated only what the app needs
revoke all on public.profiles, public.user_state, public.signup_attempts from anon, authenticated;
grant select on public.profiles to authenticated;
grant select, insert, update on public.user_state to authenticated;

create policy "Read own profile" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);

create policy "Read own state" on public.user_state
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Insert own state" on public.user_state
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own state" on public.user_state
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

comment on table public.signup_attempts is
  'Intentionally has no RLS policies: written/read only by the signup Edge Function via service role.';

-- Keep updated_at honest
create function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;
create trigger user_state_touch before update on public.user_state
  for each row execute function public.touch_updated_at();

-- On sign-up: create profile + empty state. Invalid/missing username aborts the sign-up.
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, username)
  values (new.id, lower(new.raw_user_meta_data ->> 'username'));
  insert into public.user_state (user_id) values (new.id);
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Username availability check, used only by the signup Edge Function
create function public.username_available(name text) returns boolean
language sql stable security definer set search_path = '' as $$
  select not exists (select 1 from public.profiles where username = lower(name));
$$;

-- Self-service account deletion (cascades to profile + state)
create function public.delete_my_account() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  delete from auth.users where id = auth.uid();
end $$;
comment on function public.delete_my_account() is
  'Intentionally callable by authenticated users: deletes only the caller (auth.uid()).';

revoke execute on function public.touch_updated_at() from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.username_available(text) from public, anon, authenticated;
grant execute on function public.username_available(text) to service_role;
revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
