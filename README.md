# Legal AI Assistant

A production-ready Legal AI Assistant using RAG (Retrieval-Augmented Generation) to analyze legal documents.

## Tech Stack

- **Frontend**: Next.js 14, TailwindCSS, Shadcn/UI, Supabase Auth.
- **Backend**: Node.js, Express, TypeScript, OpenAI (Embeddings/Chat), PostgreSQL (pgvector).
- **Database**: Supabase (Postgres + Vector).

## Setup & Running

1.  **Environment Variables**:
    - Backend: `backend/.env` (configured with your keys).
    - Frontend: `frontend/.env.local` (configured with your keys).

2.  **Database**:
    - Ensure `backend/schema.sql` has been run in your Supabase SQL Editor.

3.  **Start the App**:
    - **Backend**: `cd backend && npm start` (Runs on http://localhost:5000)
    - **Frontend**: `cd frontend && npm run dev` (Runs on http://localhost:3000)

## Features

- **Upload**: PDF/DOCX/TXT support.
- **RAG**: Vector search with 1536 dimensions.
- **Chat**: Streaming responses with citations.
- **Security**: Row-Level Security and Supabase Auth.
