-- PHASE 2: Dashboard Expansion Migration

-- 1. Create Clients Table
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  contact_info text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for clients
alter table public.clients enable row level security;

create policy "Users can manage their own clients"
  on public.clients for all
  using ( auth.uid() = user_id );

-- 2. Create Cases Table
create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  type text not null, -- e.g., 'civil', 'criminal', etc.
  status text not null default 'open', -- 'open', 'closed'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for cases
alter table public.cases enable row level security;

create policy "Users can manage their own cases"
  on public.cases for all
  using ( auth.uid() = user_id );

-- 3. Update Documents Table to link to Case
-- We allow documents to be uploaded per case.
alter table public.documents add column if not exists case_id uuid references public.cases(id) on delete cascade;

-- 4. Update Chat History to be per Case and persistent
-- The current chat_messages table is already linked to chat_sessions.
-- We can either link sessions to cases or messages directly to cases.
-- Linking messages to cases is cleaner for this dashboard.
create table if not exists public.case_messages (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references public.cases(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for case_messages
alter table public.case_messages enable row level security;

create policy "Users can manage their own case messages"
  on public.case_messages for all
  using ( auth.uid() = user_id );

-- 5. Updated match function for case-scoped search
create or replace function match_case_documents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  filter_case_id uuid,
  filter_user_id uuid
)
returns table (
  id uuid,
  content text,
  similarity float,
  document_id uuid,
  chunk_index int
)
language plpgsql
stable
as $$
begin
  return query (
    select
      document_chunks.id,
      document_chunks.content,
      1 - (document_chunks.embedding <=> query_embedding) as similarity,
      document_chunks.document_id,
      document_chunks.chunk_index
    from document_chunks
    where 1 - (document_chunks.embedding <=> query_embedding) > match_threshold
    and document_chunks.user_id = filter_user_id
    and document_chunks.document_id in (
        select id from documents where case_id = filter_case_id
    )
    order by document_chunks.embedding <=> query_embedding
    limit match_count
  );
end;
$$;
