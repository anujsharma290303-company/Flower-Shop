-- Enable Row Level Security on all application tables used by the backend.
-- This blocks direct public access through the Supabase API unless explicit
-- policies are later added.

alter table if exists public.admins enable row level security;
alter table if exists public.users enable row level security;
alter table if exists public.credit_transactions enable row level security;
alter table if exists public.order_media enable row level security;
alter table if exists public.categories enable row level security;
alter table if exists public.products enable row level security;
alter table if exists public.orders enable row level security;
alter table if exists public.order_items enable row level security;
alter table if exists public.order_status_logs enable row level security;
alter table if exists public.recipent_access_tokens enable row level security;
alter table if exists public.reviews enable row level security;
alter table if exists public.custom_bouquets enable row level security;
alter table if exists public.blogs enable row level security;
alter table if exists public.faqs enable row level security;
alter table if exists public.site_configs enable row level security;
alter table if exists public.payments enable row level security;
alter table if exists public.notification_logs enable row level security;
alter table if exists public.subscriptions enable row level security;
alter table if exists public.delivery_blackout_dates enable row level security;
alter table if exists public.wishlists enable row level security;
alter table if exists public.flower_me_profiles enable row level security;

-- Optional hard lock: force RLS so table owners do not bypass these rules accidentally.
alter table if exists public.admins force row level security;
alter table if exists public.users force row level security;
alter table if exists public.credit_transactions force row level security;
alter table if exists public.order_media force row level security;
alter table if exists public.categories force row level security;
alter table if exists public.products force row level security;
alter table if exists public.orders force row level security;
alter table if exists public.order_items force row level security;
alter table if exists public.order_status_logs force row level security;
alter table if exists public.recipent_access_tokens force row level security;
alter table if exists public.reviews force row level security;
alter table if exists public.custom_bouquets force row level security;
alter table if exists public.blogs force row level security;
alter table if exists public.faqs force row level security;
alter table if exists public.site_configs force row level security;
alter table if exists public.payments force row level security;
alter table if exists public.notification_logs force row level security;
alter table if exists public.subscriptions force row level security;
alter table if exists public.delivery_blackout_dates force row level security;
alter table if exists public.wishlists force row level security;
alter table if exists public.flower_me_profiles force row level security;

-- Keep the API locked down at the database layer. Your backend should access
-- the database with the service role / server-side credentials.
-- No permissive policies are created here.
