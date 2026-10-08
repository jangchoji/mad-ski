create table if not exists public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  image_key text not null,
  image_url text not null,
  alt text,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists gallery_photos_visible_created_at_idx
on public.gallery_photos (is_visible, created_at desc);

alter table public.gallery_photos enable row level security;

drop policy if exists "Public gallery photos are readable" on public.gallery_photos;
create policy "Public gallery photos are readable"
on public.gallery_photos
for select
to anon, authenticated
using (true);

create table if not exists public.review_customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  memo text,
  login_id text not null unique,
  password_hash text not null,
  password_cipher text,
  created_at timestamptz not null default now()
);

alter table public.review_customers
add column if not exists password_cipher text;

create index if not exists review_customers_created_at_idx
on public.review_customers (created_at desc);

alter table public.review_customers enable row level security;

create table if not exists public.customer_reviews (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.review_customers(id) on delete cascade,
  author_name text not null,
  content text not null,
  image_key text,
  image_url text,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists customer_reviews_visible_created_at_idx
on public.customer_reviews (is_visible, created_at desc);

create index if not exists customer_reviews_customer_id_idx
on public.customer_reviews (customer_id);

alter table public.customer_reviews enable row level security;

drop policy if exists "Public customer reviews are readable" on public.customer_reviews;
create policy "Public customer reviews are readable"
on public.customer_reviews
for select
to anon, authenticated
using (is_visible = true);
