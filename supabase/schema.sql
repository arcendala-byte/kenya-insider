-- Kenya Insider: complete Supabase schema
-- Run once in the Supabase SQL editor. This file is safe to re-run for the core tables.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.trip_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null, email text not null, arrival date not null, departure date not null,
  travelers text not null, traveling_with text, interests text[] not null default '{}',
  destinations text[] not null default '{}', notes text,
  status text not null default 'new' check (status in ('new', 'reviewing', 'contacted', 'closed')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (departure >= arrival)
);
create index if not exists trip_requests_email_idx on public.trip_requests(email);
create index if not exists trip_requests_status_idx on public.trip_requests(status);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null,
  experience_slug text not null, start_date date, guests integer not null check (guests > 0),
  total_amount numeric(12,2), currency text not null default 'KES',
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(), name text not null, email text not null,
  subject text, message text not null, status text not null default 'new' check (status in ('new', 'read', 'replied', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(), email text unique not null,
  subscribed_at timestamptz not null default now(), unsubscribed_at timestamptz
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null,
  experience_slug text, rating integer not null check (rating between 1 and 5),
  title text, body text not null, is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name) values (new.id, new.raw_user_meta_data ->> 'full_name') on conflict (id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists trip_requests_updated_at on public.trip_requests;
create trigger trip_requests_updated_at before update on public.trip_requests for each row execute procedure public.touch_updated_at();
drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles for each row execute procedure public.touch_updated_at();
drop trigger if exists bookings_updated_at on public.bookings;
create trigger bookings_updated_at before update on public.bookings for each row execute procedure public.touch_updated_at();

alter table public.profiles enable row level security;
alter table public.trip_requests enable row level security;
alter table public.bookings enable row level security;
alter table public.contact_messages enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.reviews enable row level security;

drop policy if exists "Users can read their own trip requests" on public.trip_requests;
drop policy if exists "Admins manage trip requests" on public.trip_requests;
drop policy if exists "Users can read their profile" on public.profiles;
drop policy if exists "Users can update their profile" on public.profiles;
drop policy if exists "Admins manage profiles" on public.profiles;

-- Policies use profiles.role, so admins do not need insecure user_metadata changes.
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'); $$;

drop policy if exists "profiles own read" on public.profiles;
create policy "profiles own read" on public.profiles for select using (id = auth.uid() or public.is_admin());
drop policy if exists "profiles own update" on public.profiles;
create policy "profiles own update" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));
drop policy if exists "trip request customer read" on public.trip_requests;
create policy "trip request customer read" on public.trip_requests for select using (email = (auth.jwt() ->> 'email') or public.is_admin());
drop policy if exists "trip request admin update" on public.trip_requests;
create policy "trip request admin update" on public.trip_requests for update using (public.is_admin());
drop policy if exists "booking customer read" on public.bookings;
create policy "booking customer read" on public.bookings for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists "review public read" on public.reviews;
create policy "review public read" on public.reviews for select using (is_published or user_id = auth.uid() or public.is_admin());
drop policy if exists "review user create" on public.reviews;
create policy "review user create" on public.reviews for insert with check (user_id = auth.uid());
drop policy if exists "review owner update" on public.reviews;
create policy "review owner update" on public.reviews for update using (user_id = auth.uid() or public.is_admin());

-- The Next.js server API uses SUPABASE_SERVICE_ROLE_KEY to create requests safely.
-- Promote an existing signed-in account to admin (replace the email):
-- update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'you@example.com');
-- update auth.users set raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb where email = 'you@example.com';
