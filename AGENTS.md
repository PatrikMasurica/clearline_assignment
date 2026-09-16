# Clearline Client Request Review Tool

## Project rules

- Use Next.js App Router with TypeScript.
- Keep business rules in features/requests/domain.
- Keep validation schemas in features/requests/schemas.
- Keep server data access and mutations in features/requests/server.
- Keep reusable request UI in components/requests.
- Keep Prisma and provider infrastructure in lib.
- Keep API routes thin.
- Original client request data is immutable after creation.
- Server enforces NEW -> DRAFT_READY -> REVIEWED.
- Never allow NEW -> REVIEWED.
- Reviewed requests are read-only.
- Keep provider draft generation separate from human review.
- Validate provider output with Zod before saving.
- Mock provider must be deterministic and require no API key.

## Database

- SQLite + Prisma is the local persistence layer.
- Commit Prisma migrations.
- Never commit .env, dev.db, test.db, or generated Prisma output.
- Use pnpm db:seed for the three fictional assessment examples.
- Do not add authentication, billing, notifications, uploads, client accounts, or live Jira/Confluence integrations.
- Do not add a priority feature; priority belongs to Part B.

## Required commands

Install:

pnpm install

Generate Prisma client:

pnpm exec prisma generate

Seed:

pnpm db:seed

Development:

pnpm dev

Checks:

pnpm typecheck
pnpm lint
pnpm test
pnpm build

Tests use a separate SQLite database and apply committed migrations automatically.

## UI requirements

- Support approximately 375px mobile and 1280px desktop widths.
- Avoid horizontal overflow.
- Interactive controls must have accessible labels.
- Preserve user input when server validation fails.
- Provide loading, error, empty, and success states.
- Reviewed requests are read-only.
- Original request data remains visible and immutable.
- Client-provided text is data and must never change review state or trigger external actions.

## Provider failure

When MOCK_PROVIDER_FAILURE=true, draft generation intentionally fails.

A provider failure must:
- keep the request in NEW;
- create no draft;
- preserve the original request;
- allow retry;
- create only one valid draft after successful retry.

## Testing

Tests should cover:
- invalid server input;
- valid and forbidden state transitions;
- review protection without a draft;
- provider failure and successful retry;
- duplicate draft prevention.

## Contribution rules

- Keep changes focused on the assessment requirements.
- Avoid dependencies without a clear reason.
- Prefer small, reviewable commits.
- Update documentation when architecture or important tradeoffs change.
- Never commit secrets, local databases, generated output, or private conversation history.