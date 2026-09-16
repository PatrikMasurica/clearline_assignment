# ADR: Persistence and Human Review Boundary

## Status

Accepted

## Context

The Client Request Review Tool needs persistent request, draft, and review data across page refreshes and application restarts.

The workflow also needs a clear separation between automated draft generation and human approval. Provider output must not directly finalize a request.

## Decision

### Database

Use SQLite with Prisma for local persistence.

SQLite is sufficient for the scope of this exercise and keeps setup simple without requiring an external database service. Prisma provides typed data access and committed migrations.

The data model separates:

- Request: immutable original client input.
- Draft: provider-generated triage suggestion.
- NextAction: exactly three structured follow-up actions belonging to a draft.
- Review: human-approved final summary and category with a server-generated timestamp.

### Draft generation boundary

Provider generation is isolated behind the `DraftProvider` interface.

The current implementation is a deterministic `MockDraftProvider`.

Provider output is validated with Zod before it can be persisted. Invalid provider output is rejected rather than being saved.

### Human review boundary

Draft generation does not mean approval.

A request can only move through:

NEW -> DRAFT_READY -> REVIEWED

The server enforces these transitions.

A reviewer can edit the generated summary and category while the request is DRAFT_READY. Marking the request as Reviewed creates the final Review record and changes the request state to REVIEWED.

Reviewed requests are read-only.

## Consequences

This design keeps the original client message separate from generated and human-approved data.

It prevents provider output from bypassing human review and prevents duplicate drafts or reviews through state checks and database constraints.

The provider can later be replaced by a real AI provider without changing the request or review workflow.