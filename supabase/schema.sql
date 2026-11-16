create table if not exists public.inscricoes (
    id uuid primary key default gen_random_uuid(),
    nome text not null check (char_length(btrim(nome)) between 2 and 120),
    email text not null check (char_length(email) between 3 and 254),
    nascimento date not null check (nascimento <= current_date),
    fantasia text check (fantasia is null or char_length(fantasia) <= 80),
    created_at timestamptz not null default now()
);

alter table public.inscricoes enable row level security;
alter table public.inscricoes force row level security;

revoke all on table public.inscricoes from public, anon, authenticated;
grant usage on schema public to service_role;
grant insert on table public.inscricoes to service_role;
