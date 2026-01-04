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
   - Mount the banner component inside `(survey)/layout.tsx` so it's visible across survey routes.
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
- Hook is reusable and integrated into `(survey)/layout.tsx`.
- Basic a11y validated; tests pass.

## Estimate
- 0.25–0.5 day (hook, banner, integration, tests).

## Tasks
- [x] Implement `useIdleTimer({ timeoutMs })` hook with activity listeners.
- [x] Create `IdleBanner` component with accessible messaging and “Continue” CTA.
- [x] Integrate banner into `(survey)/layout.tsx`; wire to hook.
- [x] Add telemetry events (shown/clicked).
- [x] Write unit/integration and a11y checks.

## Dev Agent Record
### Implementation Plan
- Added reusable `useIdleTimer` hook with default 5-minute timeout, activity listeners (mouse/keyboard/touch, visibilitychange), and route-change reset via `usePathname`. Exposes `isIdle`, `reset`, and `lastActiveAt`; respects `enabled` flag.

### Completion Notes
- Hook implemented with timer scheduling/cleanup and activity handling.
- Unit tests cover idle transition, activity reset, manual reset, and route-change reset (`vitest run use-idle-timer`).
- IdleBanner component added with polite live region, focus management, and "Continue" CTA that triggers reset.
- Integrated banner into `(survey)/layout` with feature flag (`NEXT_PUBLIC_FEATURE_IDLE_BANNER`) and configurable timeout (`NEXT_PUBLIC_IDLE_TIMEOUT_MS`), using idle telemetry for shown/continue events.
- Integration tests validate banner show/dismiss plus telemetry logging (`vitest run idle-banner use-idle-timer`).

### Code Review Fixes Applied
- **Fixed idle seconds calculation**: Replaced `useMemo` with `useState` + interval to update idle seconds every second while idle, fixing the "0 seconds" display bug.
- **Added Escape key handler**: Banner now dismisses on Escape key press for keyboard accessibility.
- **Added error handling**: Telemetry calls wrapped in try/catch to prevent failures from breaking banner functionality.
- **Enhanced test coverage**: Added tests for visibilitychange behavior, enabled/disabled flag, feature flag disabled, unmount cleanup, Escape key, and idle seconds updates.
- **Updated story text**: Fixed references from `AppLayout` to `(survey)/layout.tsx` to match actual implementation.

## File List
- surveyor-frontend/hooks/useIdleTimer.ts
- surveyor-frontend/__tests__/use-idle-timer.spec.tsx
- surveyor-frontend/components/IdleBanner.tsx
- surveyor-frontend/app/(survey)/layout.tsx
- surveyor-frontend/app/(survey)/conversation/layout.tsx
- surveyor-frontend/lib/telemetry.ts
- surveyor-frontend/__tests__/idle-banner-integration.spec.tsx

## Change Log
- Implemented idle timer hook and unit tests; moved story to in-progress.
- Added idle banner UI, telemetry events, and integration tests; wired into (survey) layout with env-configurable timeout and feature flag.
- Removed nested ProgressHeader in conversation layout to prevent duplicate header.
- Code review fixes: Fixed idle seconds calculation bug, added Escape key handler, added error handling for telemetry, enhanced test coverage (12 tests total), updated story text consistency.

## Status
- done

