# Dev Story: 1.3 Start session (frontend call + mock)

## Context
Epic 1: Access Link & Session Management. After 1.2 stores the link token, this story triggers session creation from the Welcome screen and persists the returned `sessionId` in client state. Backend may be unavailable; provide a mock path.

## Problem Statement
When a homeowner presses “Get started” on the Welcome screen with a valid link token, the app must call a start-session endpoint, handle loading and error states, and store `sessionId` for subsequent flows.

## In Scope
- Frontend API call to start/redeem a session given a link token.
- Loading/disabled states on the CTA.
- Error banner on failure with retry.
- Client state update to store `sessionId`.
- Mock mode was originally planned; removed for MVP. Frontend always calls the real API path.

## Out of Scope
- Backend implementation of session redemption.
- Navigation beyond the immediate success flow (next route choice can be handled by subsequent stories).
- Authentication (POC uses unauthenticated, time-limited links).

## Requirements Mapping
- FR2: System can initiate a new survey session when homeowner clicks link.
- FR5: Handling error states cleanly supports resilience goals.

## User Story
As a homeowner,  
I want the app to request a session from the backend,  
So that my progress can be tracked.

## Acceptance Criteria
- Given I am on the Welcome screen with a valid token in state  
  When I press "Get started"  
  Then the app calls a redeem/start-session endpoint (no mock path in MVP) and stores a `sessionId` in client state

- Given the endpoint returns an error  
  When I press "Get started"  
  Then I see an error banner with retry and the app does not crash

- And loading states are visible during the request

## Technical Plan
1) API Client
   - Create `startSession({ token })` in an API module.
   - Default endpoint: `POST /api/sessions/start` (configurable; alias to redeem if needed).
   - Request body: `{ token: string }`. Response: `{ sessionId: string }`.
2) Mock Mode
   - Removed for MVP; no feature flag or mock path remains. Calls always hit the configured API endpoint.
3) Client State
   - Store `sessionId` and `sessionStatus` (`idle` | `loading` | `ready` | `error`) in a central store (context/zustand/redux).
   - Expose hooks: `useSession()` and `useStartSession()`.
4) UI Wiring (Welcome)
   - “Get started” button triggers `startSession` with current `linkToken`.
   - Show spinner/disable button during `loading`.
   - On success, mark `ready` and optionally navigate to `/conversation` (configurable).
   - On error, show accessible error banner with retry.
5) Telemetry
   - Emit `session_start_request`, `session_start_success`, `session_start_failure` events.
   - Mask the token in telemetry (prefix + length only).
6) Config
   - `API_BASE_URL`, `feature.startSessionNavigateTo` (`/conversation` default). `feature.mockSessionStart` removed for MVP.

## API Contract (Frontend expectation)
- POST `/api/sessions/start`
  - Body: `{ token: string }`
  - 200: `{ sessionId: string }`
  - 400: `{ code: 'INVALID_TOKEN' }`
  - 410: `{ code: 'TOKEN_EXPIRED' }`
  - 429: `{ code: 'RATE_LIMITED' }`
  - 5xx: `{ code: 'SERVER_ERROR' }`

## Data/State Model
- Inputs: `linkToken: string` (from Story 1.2)
- State:  
  - `sessionId: string | null`  
  - `sessionStatus: 'idle' | 'loading' | 'ready' | 'error'`  
  - `sessionErrorCode?: string`

## Telemetry & Logging
- `session_start_request` with masked token preview.
- `session_start_success` with sessionId length only (no full ID).
- `session_start_failure` with error code/category.

## UX Notes
- Button has clear loading state and remains disabled while pending.
- Error banner uses role="alert" and is focusable on appearance.
- Keep copy short and reassuring; provide a single Retry button.

## Risks & Mitigations
- Risk: Token mismatch between state and endpoint.  
  Mitigation: Read token from a single source of truth; block call if missing.
- Risk: Flaky backend during POC.  
  Mitigation: Mock mode was removed; rely on real API with clear errors and retries when appropriate.

## Testing Strategy
- Unit tests:
  - `startSession` client: success path returns sessionId; error path maps codes (no mock mode).
- Store reducers/selectors for `sessionStatus` transitions.
- Integration tests (component):
  - Welcome CTA: shows loading → success sets `sessionId`; failure shows banner; retry recovers.
- Accessibility:
  - Error banner receives focus and has `role="alert"`.
  - Loading state announced (aria-busy or button label/sr-only text).

## Definition of Done
- All AC pass locally on the single real-API path (mock mode removed).
- Telemetry events fire with masked tokens and safe payloads.
- Unit and integration tests passing.
- Code reviewed and merged.

## Estimate
- 0.5–1 day (API client, state, UI wiring, tests, telemetry).

## Tasks/Subtasks
- [x] Implement `startSession({ token })` API client with config-driven endpoint
- [x] Add feature flag + mock path producing a pseudo UUID (later removed for MVP)
- [x] Extend session store with `sessionId` and status transitions
- [x] Wire Welcome CTA: loading/disable, success, error banner with retry
- [x] Add telemetry events with masking
- [x] Write unit/integration tests and basic a11y checks

## Dev Agent Record

### Implementation Plan
- Initial plan included a feature flag to bypass network and return pseudo UUID; this mock path was removed for MVP and the client always calls the API.
- Persist sessionId in SessionContext with storage sync; provide retries and error codes.
- Wire Welcome CTA with loading, a11y, and navigation toggle via env flag.
- Add telemetry masking and structured events.

### Debug Log
- Initial API base URL defaulted to localhost; changed to relative for host-agnostic calls.
- Guarded startSession against missing/empty token to align with risk mitigation.

### Completion Notes
- Implemented `startSession`, session context state machine, UI wiring, telemetry.
- Added unit and integration tests covering success, errors, a11y, and retries; mock mode later removed for MVP.
- Updated sprint status and story metadata.

## File List
- surveyor-frontend/lib/api-client.ts
- surveyor-frontend/context/SessionContext.tsx
- surveyor-frontend/app/welcome/page.tsx
- surveyor-frontend/lib/telemetry.ts
- surveyor-frontend/__tests__/api-client.spec.ts
- surveyor-frontend/__tests__/session-context.spec.tsx
- surveyor-frontend/__tests__/session-start.spec.tsx
- _bmad-output/dev-stories/story-1.3-start-session-frontend-call-mock.md
- _bmad-output/implementation-artifacts/sprint-status.yaml

## Change Log
- Added token guard and relative default API base URL; mock path later removed for MVP.
- Documented and checked tasks; recorded completion notes and file list.
- Synced sprint status for story 1.3.

## Status
done

