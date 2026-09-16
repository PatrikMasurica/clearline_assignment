# Part B Design Note

## Future downstream task creation

If this workflow later creates Jira tasks through an MCP or similar integration, the application database should remain the source of truth for the reviewed request.

### Source of truth

The Request and Review records remain authoritative. External tasks should reference the reviewed request rather than becoming the primary record.

### Human approval

No downstream task should be created from a NEW or DRAFT_READY request. A human must first mark the request as REVIEWED.

### Duplicate prevention

The system should store an external task identifier and enforce a one-to-one relationship between a reviewed request and its downstream task. Before creating a task, the server should check whether one already exists. The creation operation should be idempotent where the external system supports it.

### Failure recovery

If task creation fails, the reviewed request must remain intact. The system should retain enough state to retry safely without creating duplicate tasks.

### Useful business measure

Track the median time from request creation to Reviewed status. This measures how quickly incoming requests move through triage while keeping human review in the workflow.

This design intentionally does not implement Jira, MCP, notifications, or other external integrations as part of this exercise.