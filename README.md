# Legal AI Assistant

Legal AI assistant utilizing Retrieval-Augmented Generation (RAG) for intelligent case law analysis and document querying.

[![Next.js](https://img.shields.io/badge/Framework-Next.js-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![LangChain](https://img.shields.io/badge/Orchestration-LangChain-1C3C3C?logo=langchain&logoColor=white)](https://www.langchain.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## Overview

Legal AI Assistant is a specialized document intelligence application engineered for attorneys, legal researchers, and corporate legal departments. Reviewing lengthy contracts, legal briefs, judicial rulings, and statutes manually takes substantial billable hours.

This platform applies Retrieval-Augmented Generation (RAG) to legal documents, enabling users to upload PDF case files and execute semantic queries with exact paragraph citations, synthesized legal summaries, and hallucination-free answers anchored directly to the uploaded documents.

---

## Key Features

- **Document Ingestion & Chunking**: Intelligent PDF and text parsing that splits legal briefs by section headers, clauses, and numbered paragraphs.
- **Vector Search & Semantic Retrieval**: Vector embeddings generated and indexed for high-precision cosine similarity retrieval.
- **Cited Responses**: Every AI-generated response includes direct citations and snippet quotations to verify against the source material.
- **Strict Privacy Safeguards**: Local or tenant-isolated processing preventing confidential client data from leaking into public training sets.
- **Contract Risk Analysis**: Specialized prompt workflows highlighting indemnity clauses, termination penalties, and liability caps.

---

## Technical Architecture

1. **Ingestion**: PDF documents are parsed and cleaned using PDF parsers.
2. **Chunking**: Recursive text splitters preserve clause hierarchy and paragraph continuity.
3. **Embedding**: Chunks are transformed into dense vector representations.
4. **Retrieval**: User queries are embedded and compared against the document vector index.
5. **Generation**: Top matching contexts are assembled into an anchored prompt context for LLM completion.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| AI / RAG | LangChain / Vector Store |
| UI | Tailwind CSS |

---

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/francisnaga/Legal-Ai-Assistant.git
   cd Legal-Ai-Assistant
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env.local` file:
   ```env
   OPENAI_API_KEY=your_api_key_or_gemini_key
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

---

## Author

Francis Naga ([Portfolio](https://francisnaga.site) / [GitHub](https://github.com/francisnaga))

---

## License

MIT License. See [LICENSE](LICENSE) for details.
