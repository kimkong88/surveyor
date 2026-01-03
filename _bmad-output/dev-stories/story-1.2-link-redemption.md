# Dev Story: 1.2 Link redemption (stub against API)

## Context
Epic 1: Access Link & Session Management. Users arrive via a secure unique link and the app must recognize and hold that token to start a survey session later. This story scopes the routing and client state handling only, stubbing the backend call.

## Problem Statement
When a homeowner opens a URL like `/s/{token}`, the app must parse and validate the token format, display the Welcome screen, and expose the token in client state for later “start session” flow. Invalid tokens should show a friendly error.

## In Scope
- Route handling for `/s/{token}` (Next.js or router equivalent).
- Token extraction, lightweight format validation, and storage in client state.
- Navigation/rendering of the Welcome screen upon success.
- Error UI for obviously invalid tokens.
- Client-side telemetry event for link open.

## Out of Scope
- Actual session creation or backend redemption logic (covered in Story 1.3).
- Server-side token lookup or DB persistence.
- Authentication and authorization (POC links are unauthenticated).

## Requirements Mapping
- FR1: Homeowner can access a survey session via unique link without authentication (covered here).
- Telemetry note aligns with NFR logging/observability (high-level).

## User Story
As a homeowner,  
I want to open a unique link and see the Welcome screen,  
So that I can start a survey session.

## Acceptance Criteria
- Given I open a URL like `/s/{token}`  
  When the page loads  
  Then I see the Welcome screen and the token is available in client state

- Given an invalid token format  
  When I open `/s/invalid_token!`  
  Then I see a friendly error state with a way to retry or contact support

- And an instrumentation event "link_opened" is recorded in client telemetry

## Technical Plan
1) Routing
   - Add route pattern `/s/[token]` that renders a small loader while parsing the param.
   - On mount, validate the token format via a minimal regex (e.g., UUIDv4-like or configured).
2) Client State
   - Store token in a central store (context/zustand/redux) as `linkToken`.
   - Expose a selector/hook `useLinkToken` for downstream flows (Story 1.3).
3) Welcome Screen Navigation
   - On valid token, navigate/render Welcome screen (`/welcome`) with token already present in state.
   - Consider SSR vs. client-only: prefer client-side handling to avoid leaking token in HTML if not needed.
4) Error Handling
   - On invalid token, render an error view with retry (navigate to `/` or allow manual paste).
5) Telemetry
   - Fire `link_opened` event with masked token pattern (e.g., first 6 chars + length) to avoid PII leakage.
6) Config/Flags
   - Feature flag `feature.linkRedemption` to allow turning this on/off during integration.

## API Contract (Stubbed)
- No network call in this story. The next story (1.3) will call `POST /api/sessions/redeem` or similar.

## Data/State Model
- Client: `linkToken: string | null`
- Derived: `hasValidLink: boolean`
- Telemetry payload: `{ event: 'link_opened', token_preview: 'abc123…(len=32)' }`

## Telemetry & Logging
- Emit `link_opened` on route resolve with masked token preview.
- Log invalid-format attempts (client dev console in non-production, suppressed in production).

## UX Notes
- Welcome screen should load fast with clear CTA “Get started”.
- If error, show guidance and a primary button to try again or go home.
- Mobile-first layout; ensure focus management and accessible labels.

## Risks & Mitigations
- Risk: Overly strict token validation blocks legitimate tokens.  
  Mitigation: Keep validation minimal; rely on backend validation in Story 1.3.
- Risk: Token exposure in logs/URL copy.  
  Mitigation: Never log full token; mask in telemetry and console.

## Testing Strategy
- Unit tests:
  - Token format validator (valid/invalid cases).
  - State setter and selector (stores token, clears on route change if needed).
- Integration tests (routing):
  - Navigate to `/s/goodtoken` → lands on Welcome, `linkToken` populated.
  - Navigate to `/s/bad!token` → shows error UI.
- Accessibility:
  - Validate focus order and roles on Welcome and Error screens.

## Definition of Done
- All AC pass in local environment.
- Routing, state, and error UI implemented behind feature flag.
- Telemetry event emitted with masked token.
- Unit and integration tests passing.
- Code reviewed and merged.

## Estimate
- 0.5–1 day (routing + state + tests + telemetry).

## Tasks
- Add `/s/[token]` route and loader view.
- Implement token format validator utility and tests.
- Wire client state for `linkToken` with hook/selector.
- Implement navigation to Welcome on success.
- Implement error UI for invalid tokens.
- Add `link_opened` telemetry with masked token preview.
- Add feature flag and configuration guard.

