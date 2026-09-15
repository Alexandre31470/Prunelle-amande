/* ==========================================================================
   Prunelle & Amande — Schéma Supabase
   --------------------------------------------------------------------------
   À exécuter UNE FOIS dans votre projet Supabase :
   Dashboard Supabase → SQL Editor → New query → collez tout ce fichier →
   Run.

   Ce script crée :
   - le catalogue public (categories, services, offers) : lisible par tout
     le monde (le site), modifiable uniquement par vous une fois connectée
   - le CRM privé (bookings, clients) : personne d'autre que vous ne peut
     les lire, seul le formulaire de réservation du site peut y ajouter
     une nouvelle demande
   ========================================================================== */

-- Permet de générer des identifiants uniques (uuid)
create extension if not exists "pgcrypto";

/* ==========================================================================
   1. CATALOGUE (public en lecture)
   ========================================================================== */

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text not null,
  note text default '',
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete cascade,
  name text not null,
  description text default '',
  duration text default '',
  price numeric(10,2) not null default 0,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  figure text not null,
  description text default '',
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table categories enable row level security;
alter table services   enable row level security;
alter table offers     enable row level security;

-- N'importe qui (site public) peut LIRE le catalogue
drop policy if exists "public_read_categories" on categories;
drop policy if exists "public_read_services" on services;
drop policy if exists "public_read_offers" on offers;
create policy "public_read_categories" on categories for select to anon, authenticated using (true);
create policy "public_read_services"   on services   for select to anon, authenticated using (true);
create policy "public_read_offers"     on offers     for select to anon, authenticated using (true);

-- Seule une personne connectée (vous, via admin.html) peut modifier
drop policy if exists "admin_insert_categories" on categories;
drop policy if exists "admin_update_categories" on categories;
drop policy if exists "admin_delete_categories" on categories;
create policy "admin_insert_categories" on categories for insert to authenticated with check (true);
create policy "admin_update_categories" on categories for update to authenticated using (true) with check (true);
create policy "admin_delete_categories" on categories for delete to authenticated using (true);

drop policy if exists "admin_insert_services" on services;
drop policy if exists "admin_update_services" on services;
drop policy if exists "admin_delete_services" on services;
create policy "admin_insert_services" on services for insert to authenticated with check (true);
create policy "admin_update_services" on services for update to authenticated using (true) with check (true);
create policy "admin_delete_services" on services for delete to authenticated using (true);

drop policy if exists "admin_insert_offers" on offers;
drop policy if exists "admin_update_offers" on offers;
drop policy if exists "admin_delete_offers" on offers;
create policy "admin_insert_offers" on offers for insert to authenticated with check (true);
create policy "admin_update_offers" on offers for update to authenticated using (true) with check (true);
create policy "admin_delete_offers" on offers for delete to authenticated using (true);

/* ==========================================================================
   2. CRM (privé — jamais lisible publiquement)
   ========================================================================== */

-- Demandes de réservation envoyées depuis le site (bon de commande)
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  first_name text,
  last_name text,
  email text,
  phone text,
  wanted_date date,
  wanted_time text,
  address text,
  message text,
  items jsonb default '[]',
  total numeric(10,2) default 0,
  status text default 'nouveau',
  created_at timestamptz default now()
);

-- Fiches clientes, gérées uniquement par vous depuis admin.html
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  first_name text,
  last_name text,
  email text,
  phone text,
  notes text default '',
  tags text default '',
  created_at timestamptz default now()
);

alter table bookings enable row level security;
alter table clients   enable row level security;

-- Le site public peut CRÉER une demande (formulaire de réservation),
-- mais ne peut jamais la relire, la modifier ou la lister : les données
-- de vos clientes restent privées.
drop policy if exists "public_create_bookings" on bookings;
create policy "public_create_bookings" on bookings for insert to anon with check (true);

-- Seule une personne connectée (vous) peut consulter / gérer les demandes
drop policy if exists "admin_read_bookings" on bookings;
drop policy if exists "admin_update_bookings" on bookings;
drop policy if exists "admin_delete_bookings" on bookings;
create policy "admin_read_bookings"   on bookings for select to authenticated using (true);
create policy "admin_update_bookings" on bookings for update to authenticated using (true) with check (true);
create policy "admin_delete_bookings" on bookings for delete to authenticated using (true);

-- Les fiches clientes sont 100% privées : ni lecture ni écriture publique
drop policy if exists "admin_read_clients" on clients;
drop policy if exists "admin_insert_clients" on clients;
drop policy if exists "admin_update_clients" on clients;
drop policy if exists "admin_delete_clients" on clients;
create policy "admin_read_clients"   on clients for select to authenticated using (true);
create policy "admin_insert_clients" on clients for insert to authenticated with check (true);
create policy "admin_update_clients" on clients for update to authenticated using (true) with check (true);
create policy "admin_delete_clients" on clients for delete to authenticated using (true);

/* ==========================================================================
   Fin du script.
   Prochaine étape : Authentication → Users → Add user, pour créer votre
   propre compte (email + mot de passe) qui vous servira à vous connecter
   sur admin.html.
   ========================================================================== */
