-- Enable pgvector extension
create extension if not exists vector;

-- Create users table (handled by Supabase Auth, but we might need a public profile table if we want to store extra data, 
-- but the requirement says "users table" with specific fields. 
-- Usually Supabase uses auth.users. 
-- I will create a public.users table that references auth.users for application-specific data if needed, 
-- or just assume the requirement means the auth schema.
-- HOWEVER, the prompt asks for "users table" with id, email, role, created_at.
-- I'll create a table public.users that mirrors/extends auth.users.
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for users
alter table public.users enable row level security;

-- Policy: Users can view their own profile
create policy "Users can view own profile"
  on public.users for select
  using ( auth.uid() = id );

-- Create documents table
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  filename text not null,
  file_url text not null,
  uploaded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for documents
alter table public.documents enable row level security;

-- Policy: Users can access their own documents
create policy "Users can access own documents"
  on public.documents for all
  using ( auth.uid() = user_id );

-- Create document_chunks table
create table public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references public.documents(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  content text not null,
  embedding vector(1536), -- output reduced to 1536 to fit HNSW index limits
  chunk_index integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for document_chunks
alter table public.document_chunks enable row level security;

-- Policy: Users can access their own chunks
create policy "Users can access own chunks"
  on public.document_chunks for all
  using ( auth.uid() = user_id );

-- Index for vector search
create index on public.document_chunks using hnsw (embedding vector_cosine_ops);

-- Create chat_sessions table
create table public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for chat_sessions
alter table public.chat_sessions enable row level security;

-- Policy: Users can access their own chat sessions
create policy "Users can access own chat sessions"
  on public.chat_sessions for all
  using ( auth.uid() = user_id );

-- Create chat_messages table
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.chat_sessions(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for chat_messages
alter table public.chat_messages enable row level security;

-- Policy: Users can access messages of their own sessions
-- (Complex policy or join needed? Or just add user_id to messages for easier RLS?
-- The prompt Schema for chat_messages doesn't have user_id.
-- So we check via session_id.)
create policy "Users can access own chat messages"
  on public.chat_messages for all
  using (
    exists (
      select 1 from public.chat_sessions
      where id = chat_messages.session_id
      and user_id = auth.uid()
    )
  );

-- Vector Search Function
create or replace function match_documents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
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
    order by document_chunks.embedding <=> query_embedding
    limit match_count
  );
end;
$$;
