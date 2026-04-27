create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key,
  full_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null
);

create table if not exists permissions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null
);

create table if not exists product_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  sku text,
  type text,
  name text not null,
  brand text,
  sub_model text,
  compatible_units text[],
  period_month text,
  period_year int,
  critical_stock int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists warehouses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  is_active boolean not null default true
);

create table if not exists inventory_stock (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id),
  warehouse_id uuid not null references warehouses(id),
  initial_stock int not null default 0,
  exits int not null default 0,
  available int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists inventory_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id),
  warehouse_id uuid references warehouses(id),
  type text not null,
  quantity int not null,
  author_id uuid,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id),
  status text not null default 'PENDIENTE',
  note text not null,
  author_id uuid,
  resolved_by uuid,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists authorizations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id),
  movement_id uuid references inventory_movements(id),
  status text not null default 'PENDIENTE',
  requested_by uuid,
  approved_by uuid,
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid,
  action text not null,
  before jsonb,
  after jsonb,
  actor_id uuid,
  created_at timestamptz not null default now()
);

alter table products enable row level security;
alter table warehouses enable row level security;
alter table inventory_stock enable row level security;
alter table inventory_movements enable row level security;
alter table notes enable row level security;
alter table authorizations enable row level security;
alter table audit_logs enable row level security;
