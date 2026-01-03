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
- Mock mode when backend is unavailable.

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
  Then the app calls a redeem/start-session endpoint (mocked if backend unavailable) and stores a `sessionId` in client state

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
   - Feature flag `feature.mockSessionStart` to bypass network and return `{ sessionId: pseudoUuid() }` after a small delay.
   - Log mock usage in dev; no PII/token logging in production.
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
   - `API_BASE_URL`, `feature.mockSessionStart`, `feature.startSessionNavigateTo` (`/conversation` default).

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
  Mitigation: Mock mode + exponential backoff retry on client only if explicitly enabled.

## Testing Strategy
- Unit tests:
  - `startSession` client: success path returns sessionId; error path maps codes; mock mode returns pseudo UUID.
  - Store reducers/selectors for `sessionStatus` transitions.
- Integration tests (component):
  - Welcome CTA: shows loading → success sets `sessionId`; failure shows banner; retry recovers.
- Accessibility:
  - Error banner receives focus and has `role="alert"`.
  - Loading state announced (aria-busy or button label/sr-only text).

## Definition of Done
- All AC pass locally with and without mock mode.
- Telemetry events fire with masked tokens and safe payloads.
- Unit and integration tests passing.
- Code reviewed and merged.

## Estimate
- 0.5–1 day (API client, state, UI wiring, tests, telemetry).

## Tasks
- Implement `startSession({ token })` API client with config-driven endpoint.
- Add feature flag + mock path producing a pseudo UUID.
- Extend session store with `sessionId` and status transitions.
+- Wire Welcome CTA: loading/disable, success, error banner with retry.
 - Add telemetry events with masking.
 - Write unit/integration tests and basic a11y checks.

