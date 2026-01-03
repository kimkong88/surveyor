# Dev Story: 1.6 Session ID generation (backend)

## Context
Epic 1: Access Link & Session Management. Each new survey session must receive a cryptographically secure, globally unique identifier used across APIs, storage, and telemetry (safely).

## Problem Statement
When a session is created (via start/redeem), the backend must generate a secure, unique `sessionId` with negligible collision probability, enforce uniqueness at the data layer, and return it to the client.

## In Scope
- Backend ID generation strategy and implementation.
- Data model and database uniqueness constraints/indexes.
- API response shape and validation.
- Basic telemetry (no PII) and tests for uniqueness/format.

## Out of Scope
- Frontend storage/usage of `sessionId` (handled in Story 1.3 and later).
- Expiry/inactivity policies (covered elsewhere).

## Requirements Mapping
- FR6: System can generate unique session identifiers for each survey.

## Acceptance Criteria
- Given a request to create a session  
  When the backend generates an ID  
  Then the `sessionId` is cryptographically secure and unique, persisted with a uniqueness constraint

- Given concurrent session creations  
  When IDs are generated in parallel  
  Then no collisions occur; if a rare collision is detected, regeneration occurs transparently before persist

- Given a successful creation  
  When the API responds  
  Then the payload includes `{ sessionId: string }` conforming to the chosen format policy

## Technical Plan
1) ID Format Policy
   - Use ULID (Crockford base32, 26 chars) or UUID v4 (36 chars) backed by CSPRNG.
   - Recommendation: ULID for lexicographic ordering and observability ergonomics; ensure secure randomness for the entropy component.
2) Implementation
   - Create `SessionIdGenerator` with:
     - `generate(): string` using crypto-grade PRNG.
     - `isValid(id: string): boolean` for validation in API and tests.
   - In session creation flow, call `generate()`; on DB unique violation, retry generation up to N times (e.g., 3) before surfacing a 5xx.
3) Data Layer
   - `sessions` table/model includes `session_id` (primary key or unique indexed column).
   - Add UNIQUE index on `session_id`.
4) API Contract
   - POST `/api/sessions/start` returns `{ sessionId }` on success.
   - Error mapping unchanged (Story 1.3 covers client behavior).
5) Telemetry & Logging
   - Emit `session_created` with attributes: `id_length`, `id_format` (e.g., `ulid`), no full ID in logs.
6) Configuration
   - `SESSION_ID_FORMAT` = `ulid` | `uuid` (default `ulid`).
   - `SESSION_ID_RETRY_LIMIT` default 3.

## Data/State Model
- DB column: `session_id VARCHAR(26)` (ULID) or `VARCHAR(36)` (UUID), UNIQUE NOT NULL.
- Entity: `sessionId: string`.

## Risks & Mitigations
- Risk: Rare collision at persist time.  
  Mitigation: Unique index + retry generation on constraint violation.
- Risk: Inconsistent format across services.  
  Mitigation: Centralize generator and validation; enforce via tests and lint rule if feasible.
- Risk: Accidental logging of full IDs.  
  Mitigation: Structured logging policy to mask IDs; lint rule for sensitive logs.

## Testing Strategy
- Unit tests:
  - `generate()` returns valid IDs; `isValid()` accepts correct format and rejects invalid.
  - Generate 1M IDs in-memory (fast path) and assert no duplicates (probabilistic safety check).
  - Retry logic on simulated unique-violation.
- Integration tests:
  - API call returns valid `sessionId`; DB row persisted with unique value.
  - Concurrent creations do not collide; if simulated collision occurs, retry succeeds.

## Definition of Done
- AC pass; unique index in place; generator implemented with retries.
- API returns validated `sessionId`; no full ID appears in logs/telemetry.
- Tests pass (unit + integration).
- Code reviewed and merged.

## Estimate
- 0.5 day (generator + DB constraint + tests + API wiring).

## Tasks
- Implement `SessionIdGenerator` (ULID default) with validation.
- Add unique `session_id` column/index to `sessions`.
- Wire generator into session creation endpoint/service with retry on conflict.
- Add unit and integration tests.
- Add safe telemetry (`session_created`) without logging full ID.

