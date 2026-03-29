-- body_recomp_plans_v1.sql
-- Stores body recomposition macro plans per user.

create table if not exists body_recomp_plans (
  id                       uuid         primary key default gen_random_uuid(),
  user_id                  uuid         not null references auth.users(id) on delete cascade,

  -- Training day macros
  training_calories        integer      not null,
  training_protein_grams   integer      not null,
  training_carbs_grams     integer      not null,
  training_fat_grams       integer      not null,

  -- Rest day macros
  rest_calories            integer      not null,
  rest_protein_grams       integer      not null,
  rest_carbs_grams         integer      not null,
  rest_fat_grams           integer      not null,

  -- Weekly training schedule (e.g. ["mon","wed","fri"])
  training_days            jsonb        not null default '[]'::jsonb,

  created_at               timestamptz  not null default now(),
  updated_at               timestamptz  not null default now()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────

create index if not exists body_recomp_plans_user_id_idx
  on body_recomp_plans (user_id);

create index if not exists body_recomp_plans_created_at_idx
  on body_recomp_plans (created_at desc);

-- ── updated_at trigger ────────────────────────────────────────────────────────

create or replace function update_body_recomp_plans_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger body_recomp_plans_updated_at
  before update on body_recomp_plans
  for each row execute procedure update_body_recomp_plans_updated_at();

-- ── Row Level Security ────────────────────────────────────────────────────────

alter table body_recomp_plans enable row level security;

create policy "Users can view own recomp plans"
  on body_recomp_plans for select
  using (auth.uid() = user_id);

create policy "Users can insert own recomp plans"
  on body_recomp_plans for insert
  with check (auth.uid() = user_id);

create policy "Users can update own recomp plans"
  on body_recomp_plans for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own recomp plans"
  on body_recomp_plans for delete
  using (auth.uid() = user_id);
