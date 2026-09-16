# Client Request Review Tool

A small full-stack workflow for capturing client requests, generating a deterministic triage draft, and requiring human review before a request becomes finalized.

## Overview

The Client Request Review Tool helps a team turn incoming client messages into structured triage information.

The workflow is:

NEW -> DRAFT_READY -> REVIEWED

The original client request is immutable after creation. Provider-generated content is treated as a draft, and a human reviewer can edit the summary and category before marking the request as Reviewed.

Reviewed requests are read-only.

## Tech Stack

- Next.js 16.3.5
- React 19.2.8
- TypeScript 5.9.3
- Tailwind CSS 4.3.3
- Prisma 7.10.0
- SQLite
- Zod 4.6.5
- Vitest 5.0.1
- pnpm 10.34.5
- Node.js 22.22.3

The project intentionally stays local and does not require an external AI API key.

## Architecture

The project separates UI, domain rules, validation, server-side operations, and infrastructure.

```text
app/
  App Router pages and API routes

components/requests/
  Request-specific UI components

features/requests/
  domain/
    State transition rules
  schemas/
    Request and provider validation
  server/
    Server-side request operations

lib/
  Prisma client
  Draft provider boundary
  Mock provider

prisma/
  Prisma schema
  Migrations
  Seed data

tests/
  Unit and integration tests