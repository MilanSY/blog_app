create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  role text not null check (role in ('admin', 'blogger')),
  is_active boolean not null default true
);

create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  pseudo text not null unique,
  bio text,
  avatar_url text,
  interests text[],
  is_visible boolean not null default true
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  blog_id uuid not null references public.blogs(id) on delete cascade,
  title text not null,
  slug text not null unique,
  content_html text not null,
  cover_image_url text,
  published_at timestamptz,
  is_visible boolean not null default true
);

create table if not exists public.about (
  id smallint primary key default 1,
  title text not null,
  content_html text not null,
  is_visible boolean not null default true,
  constraint about_single_row check (id = 1)
);

create index if not exists posts_blog_id_idx on public.posts (blog_id);
create index if not exists posts_published_at_desc_idx on public.posts (published_at desc);
