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
