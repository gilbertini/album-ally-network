create table if not exists public.albums (
  id text primary key,
  name text not null,
  core_sticker_count integer not null check (core_sticker_count > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.album_editions (
  id text primary key,
  album_id text not null references public.albums(id) on delete cascade,
  name text not null,
  region text not null,
  sticker_count integer not null check (sticker_count > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.stickers (
  id text primary key,
  album_id text not null references public.albums(id) on delete cascade,
  edition_id text not null references public.album_editions(id) on delete cascade,
  code text not null,
  name text not null,
  section text not null,
  category text not null check (category in ('player', 'emblem', 'team_photo', 'world_cup', 'coca_cola')),
  sort_order integer not null check (sort_order > 0),
  source_url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (album_id, edition_id, code)
);

create index if not exists stickers_album_code_idx on public.stickers(album_id, code);
create index if not exists stickers_name_search_idx on public.stickers using gin (to_tsvector('simple', name || ' ' || section || ' ' || code));

alter table public.albums enable row level security;
alter table public.album_editions enable row level security;
alter table public.stickers enable row level security;

create policy "Albums are publicly readable" on public.albums for select using (true);
create policy "Album editions are publicly readable" on public.album_editions for select using (true);
create policy "Stickers are publicly readable" on public.stickers for select using (true);
