-- Admin access for Nocera backoffice.
-- Run after creating an admin user in Supabase Authentication.
-- Admin user: distribuidoradesimone@gmail.com

create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

grant select on public.admin_users to authenticated;
grant insert, update, delete on public.products to authenticated;
grant insert, update, delete on public.categories to authenticated;

drop policy if exists "Admins can read own admin row" on public.admin_users;
create policy "Admins can read own admin row"
on public.admin_users for select
to authenticated
using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

drop policy if exists "Admins can manage products" on public.products;
create policy "Admins can manage products"
on public.products for all
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where lower(admin_users.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
)
with check (
  exists (
    select 1
    from public.admin_users
    where lower(admin_users.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
);

drop policy if exists "Admins can manage categories" on public.categories;
create policy "Admins can manage categories"
on public.categories for all
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where lower(admin_users.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
)
with check (
  exists (
    select 1
    from public.admin_users
    where lower(admin_users.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
);

insert into public.admin_users (email)
values ('distribuidoradesimone@gmail.com')
on conflict (email) do nothing;
