# Dev Story: 1.5 Inactivity timeout messaging (UI behavior)

## Context
Epic 1: Access Link & Session Management. We need client-side idle detection that warns users if inactivity may end the session and allows them to continue without losing context.

## Problem Statement
When the user is idle past a configured threshold, the app should show a clear banner explaining that inactivity may end the session, with a primary “Continue” action that dismisses the banner and resets the timer.

## In Scope
- Client-only idle timer with configurable threshold (e.g., 5 minutes for demo).
- Detect user activity (pointer, keypress, touch, route change) and reset the timer.
- Inactivity banner UI with “Continue” action.
- Accessible behavior and basic telemetry.

## Out of Scope
- Server-side session expiry policies (handled later).
- Persisting idle state across reloads.

## User Story
As a homeowner,  
I want clear messaging if I’m idle,  
So that I’m not surprised if the session expires.

## Acceptance Criteria
- Given an idle timer is configured client-side (e.g., 5 minutes for demo)  
  When there is no interaction for the threshold  
  Then a banner appears explaining that inactivity may end the session, with a "Continue" action

- Given I press "Continue"  
  When the banner is shown  
  Then the banner dismisses and the idle timer resets

## Technical Plan
1) Idle Detection
   - Implement a reusable `useIdleTimer({ timeoutMs })` hook:
     - Listens for `mousemove`, `mousedown`, `keydown`, `touchstart`, `visibilitychange`, and route changes.
     - Exposes `isIdle`, `reset()`, and `lastActiveAt`.
   - Default `timeoutMs`: `5 * 60_000` (env-configurable).
2) Banner UI
   - Non-modal, dismissible banner at the top of the app within the shared layout.
   - Content: short explanation; primary “Continue” button.
   - When `isIdle` flips true → show banner; pressing “Continue” calls `reset()` and hides banner.
3) Accessibility
   - Banner container uses `role="status"` or `aria-live="polite"` for announcement.
   - “Continue” button is focusable; focus is moved to banner when it appears.
   - Ensure escape hatch for keyboard users (button in natural tab order).
4) Integration
   - Mount the banner component inside `AppLayout` so it’s visible across primary routes.
   - Hook into route changes to reset idle timer.
5) Telemetry (lightweight)
   - Emit `idle_banner_shown` and `idle_banner_continue_clicked`.
   - No PII; include elapsed idle seconds only.
6) Config/Flags
   - `feature.idleBanner` to toggle on/off.
   - `IDLE_TIMEOUT_MS` defaulted for demo; override via env/config.

## Data/State Model
- Hook state:
  - `isIdle: boolean`
  - `lastActiveAt: number` (epoch ms)
- UI state:
  - `isBannerVisible: boolean` (derived from `isIdle` and dismissed state until activity)

## Risks & Mitigations
- Risk: Over-eager idle triggering on background tabs.  
  Mitigation: Consider `visibilitychange`; pause countdown when hidden (optional).
- Risk: Banner fatigue.  
  Mitigation: Only show after threshold; hide immediately on continue/activity.

## Testing Strategy
- Unit tests:
  - `useIdleTimer` transitions to idle after timeout with no events.
  - Any activity event resets the timer and clears idle state.
- Integration tests:
  - After timeout, banner appears; pressing “Continue” dismisses and resets timer.
  - Route navigation resets idle state and hides banner.
- Accessibility:
  - Banner announces via live region; button focusable and operable via keyboard.

## Definition of Done
- All AC pass locally with configurable timeout.
- Banner appears after idle threshold and dismisses on “Continue”.
- Hook is reusable and integrated into `AppLayout`.
- Basic a11y validated; tests pass.

## Estimate
- 0.25–0.5 day (hook, banner, integration, tests).

## Tasks
- Implement `useIdleTimer({ timeoutMs })` hook with activity listeners.
- Create `IdleBanner` component with accessible messaging and “Continue” CTA.
- Integrate banner into `AppLayout`; wire to hook.
- Add telemetry events (shown/clicked).
- Write unit/integration and a11y checks.

