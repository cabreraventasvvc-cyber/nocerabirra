-- Nocera initial Supabase schema
-- Run this in Supabase SQL Editor after creating the project.
-- Do not paste service role keys into the frontend.

create extension if not exists pgcrypto;

create type public.order_status as enum (
  'NUEVO',
  'CONFIRMADO',
  'PREPARANDO',
  'LISTO',
  'ENVIADO',
  'ENTREGADO',
  'CANCELADO'
);

create type public.lead_status as enum (
  'NUEVO',
  'CONTACTADO',
  'CERRADO'
);

create type public.import_status as enum (
  'PREVIEW',
  'APLICADO',
  'CANCELADO',
  'ERROR'
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  code text unique,
  name text not null,
  description text,
  brand text,
  category_id uuid references public.categories(id) on delete set null,
  presentation text,
  unit text,
  pack_quantity numeric,
  price numeric(12, 2) not null default 0,
  promotional_price numeric(12, 2),
  promotion_starts_at timestamptz,
  promotion_ends_at timestamptz,
  stock_status text not null default 'available',
  active boolean not null default true,
  featured boolean not null default false,
  nocera_product boolean not null default false,
  image_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  phone text not null,
  email text,
  address text,
  city text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,
  customer_id uuid references public.customers(id) on delete set null,
  customer_snapshot jsonb not null,
  delivery_mode text not null,
  address_snapshot jsonb,
  status public.order_status not null default 'NUEVO',
  total numeric(12, 2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_snapshot jsonb not null,
  quantity numeric(12, 2) not null,
  unit_price numeric(12, 2) not null,
  subtotal numeric(12, 2) not null,
  created_at timestamptz not null default now()
);

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  reason text,
  message text not null,
  status public.lead_status not null default 'NUEVO',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.franchise_leads (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  phone text not null,
  email text not null,
  city text,
  province text,
  message text,
  status public.lead_status not null default 'NUEVO',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table public.price_imports (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  summary jsonb not null default '{}'::jsonb,
  status public.import_status not null default 'PREVIEW',
  created_at timestamptz not null default now(),
  applied_at timestamptz
);

create table public.price_import_rows (
  id uuid primary key default gen_random_uuid(),
  import_id uuid not null references public.price_imports(id) on delete cascade,
  code text,
  payload jsonb not null,
  action text not null,
  warnings jsonb not null default '[]'::jsonb,
  errors jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index categories_active_sort_idx on public.categories(active, sort_order);
create index products_code_idx on public.products(code);
create index products_category_idx on public.products(category_id);
create index products_public_filter_idx on public.products(active, featured, nocera_product);
create index orders_status_created_idx on public.orders(status, created_at desc);
create index order_items_order_id_idx on public.order_items(order_id);
create index contacts_status_created_idx on public.contacts(status, created_at desc);
create index franchise_leads_status_created_idx on public.franchise_leads(status, created_at desc);
create index price_import_rows_import_id_idx on public.price_import_rows(import_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger customers_set_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create trigger contacts_set_updated_at
before update on public.contacts
for each row execute function public.set_updated_at();

create trigger franchise_leads_set_updated_at
before update on public.franchise_leads
for each row execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.contacts enable row level security;
alter table public.franchise_leads enable row level security;
alter table public.site_settings enable row level security;
alter table public.price_imports enable row level security;
alter table public.price_import_rows enable row level security;

revoke all on table
  public.categories,
  public.products,
  public.customers,
  public.orders,
  public.order_items,
  public.contacts,
  public.franchise_leads,
  public.site_settings,
  public.price_imports,
  public.price_import_rows
from anon, authenticated;

grant select on public.categories, public.products, public.site_settings to anon, authenticated;
grant insert on public.contacts, public.franchise_leads to anon, authenticated;

create policy "Public can read active categories"
on public.categories for select
to anon, authenticated
using (active = true);

create policy "Public can read active products"
on public.products for select
to anon, authenticated
using (active = true);

create policy "Public can read site settings"
on public.site_settings for select
to anon, authenticated
using (true);

create policy "Visitors can create contact messages"
on public.contacts for insert
to anon, authenticated
with check (true);

create policy "Visitors can create franchise leads"
on public.franchise_leads for insert
to anon, authenticated
with check (true);

insert into public.categories (slug, name, description, sort_order, active)
values
  ('productos-nocera', 'Productos Nocera', 'Cervezas, vasos, growlers y ediciones propias.', 0, true),
  ('aguas-jugos-sodas', 'Aguas, jugos y sodas', 'Aguas, sodas, jugos y bebidas sin alcohol.', 1, true),
  ('almacen', 'Almacen', 'Productos de almacen y consumo general.', 2, true),
  ('gaseosas', 'Gaseosas', 'Gaseosas retornables, PET y latas.', 3, true),
  ('cervezas', 'Cervezas', 'Cervezas industriales, artesanales y presentaciones retornables.', 4, true),
  ('licores-aperitivos-whisky', 'Licores, aperitivos y whisky', 'Bebidas espirituosas, aperitivos, vermut, gin y whisky.', 5, true),
  ('snacks', 'Snacks', 'Papas, snacks, galletitas y productos para consumo rapido.', 6, true),
  ('vinos-champagnes', 'Vinos y champagnes', 'Vinos, espumantes y etiquetas para gastronomia.', 7, true),
  ('fiambreria', 'Fiambreria', 'Fiambres y quesos de la lista mayorista.', 8, true)
on conflict (slug) do nothing;
