# Dev Story: 1.6 Session ID generation (backend)

## Context

Epic 1: Access Link & Session Management. Each new survey session must receive a cryptographically secure, globally unique identifier used across APIs, storage, and telemetry (safely).

## Problem Statement

When a session is created (via start/redeem), the backend must generate a secure, unique `sessionId` with negligible collision probability, enforce uniqueness at the data layer, and return it to the client.

## In Scope

-   Backend ID generation strategy and implementation.
-   Data model and database uniqueness constraints/indexes.
-   API response shape and validation.

## Out of Scope

-   Frontend storage/usage of `sessionId` (handled in Story 1.3 and later).
-   Expiry/inactivity policies (covered elsewhere).

## Requirements Mapping

-   FR6: System can generate unique session identifiers for each survey.

## Acceptance Criteria

-   [ ] **AC1**: Given a request to create a session, when the backend generates an ID, then the `sessionId` is cryptographically secure and unique, persisted with a uniqueness constraint

-   [ ] **AC2**: Given concurrent session creations, when IDs are generated in parallel, then no collisions occur; if a rare collision is detected, regeneration occurs transparently before persist

-   [ ] **AC3**: Given a successful creation, when the API responds, then the payload includes `{ sessionId: string }` conforming to the chosen format policy

## Recommended Approach

-   Use database-generated UUID (e.g., PostgreSQL `gen_random_uuid()`) with UNIQUE constraint on `session_id` column
-   Handle collision at database layer (DB enforces uniqueness automatically)
-   Return `{ sessionId: string }` in API response from POST `/api/sessions/start`
-   No need for separate generator class or application-level retry logic - database handles uniqueness
