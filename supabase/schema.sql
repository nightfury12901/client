-- ── Subscriptions (billing) ──────
create table if not exists subscriptions (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references auth.users(id) on delete cascade unique,
  plan                text default 'free', -- 'free', 'pro', 'agency'
  status              text default 'active',
  current_period_end  timestamptz,
  razorpay_sub_id     text,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

alter table subscriptions enable row level security;

drop policy if exists "Users can view their own subscription" on subscriptions;
create policy "Users can view their own subscription"
  on subscriptions for select
  using (auth.uid() = user_id);

-- ── Profiles (display name, skills) ──────
create table if not exists profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text,
  email         text,
  skills        text[] default '{}',
  bio           text,
  location      text,
  default_tone  text default 'confident',
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table profiles enable row level security;

drop policy if exists "Users can manage their own profile" on profiles;
create policy "Users can manage their own profile"
  on profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ── Trigger for new users ──────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.subscriptions (user_id, plan, status)
  values (new.id, 'free', 'active')
  on conflict (user_id) do nothing;
  
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email)
  on conflict (id) do nothing;
  
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Saved Leads ──────
create table if not exists saved_leads (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  lead_id     text not null, -- external ID (e.g. reddit post id)
  title       text,
  url         text,
  source      text,
  content     text,
  created_at  timestamptz default now(),
  unique(user_id, lead_id)
);

alter table saved_leads enable row level security;

drop policy if exists "Users can manage their own saved leads" on saved_leads;
create policy "Users can manage their own saved leads"
  on saved_leads for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
