# Dev Story: 1.1 Frontend shell scaffold (routes + screens)

## Context

Epic 1: Access Link & Session Management. Establish a navigable, mobile-first app shell with the primary screens used across the survey flow. This creates the foundation for subsequent stories (e.g., link redemption and session start).

## Problem Statement

We need baseline routes and skeleton screens for the core flow (Welcome, Conversation, Capture, Inventory, Submit) with header/footer placeholders and basic accessibility so teams can build features incrementally without blocking on layout.

## In Scope

-   Routes: `/welcome`, `/conversation`, `/submit`.
-   Skeleton screen components for each route.
-   Shared layout with header/footer placeholders (status, progress, voice/text controls).
-   Mobile-first layout and basic accessibility (labels, focus order).

## Out of Scope

-   Real data, API calls, or session logic.
-   Voice, camera, inventory wiring beyond placeholders.
-   Final styling/branding; this is scaffolding.

## Requirements Mapping

-   Supports FR3–FR4 indirectly by establishing structure for progress display (placeholder now).
-   Aligns with Additional Requirements: Next.js (mobile-first), accessible UI patterns.

## User Story

As a homeowner,  
I want a basic app shell with routes for Welcome, Conversation, Capture, Inventory, and Submit,  
So that I can navigate the survey flow.

## Acceptance Criteria

-   Given the app runs locally  
    When I navigate to `/welcome`  
    Then I see a Welcome screen with a primary CTA and permission guidance

-   Given I visit `/conversation`  
    When the route loads  
    Then the chat skeleton renders with header/footer placeholders and I can open a right-side panel

-   Given I am on `/conversation`  
    When I open Capture from chat actions  
    Then a right-side Capture panel opens and shows the already stored image (no separate page), and the chat remains mounted with all messages

-   Given I am on `/conversation`  
    When I open Inventory from chat actions  
    Then a right-side Inventory panel opens (no separate page), and the chat remains mounted with all messages

-   Given the right-side panel is open  
    When I close the panel (via close button or Escape)  
    Then focus returns to the chat and no messages are lost

-   Given I attempt to navigate to `/capture` or `/inventory` directly  
    When the app handles the request  
    Then those routes are not available, and the correct behavior is to open the right-side panel from `/conversation`

-   Scope note for this story  
    No session persistence across reload is required; if a reload occurs, reset behavior is acceptable and documented as out of scope

## Technical Plan

1. Project Structure
    - Create shared `AppLayout` with header/footer placeholders and responsive container.
    - Provide a simple `Screen` wrapper with consistent paddings and skip-to-content link.
2. Routing
    - Add pages for `/welcome`, `/conversation`, `/submit`.
    - Each page exports a skeleton component with semantic landmarks.
3. Accessibility
    - Header/footer have appropriate roles/labels.
    - Ensure logical focus order and skip link to main content.
    - Buttons and controls use accessible names.
4. Mobile-first UX
    - Use responsive layout with touch-friendly spacing.
    - Avoid overflow; ensure content remains usable in portrait/landscape.
5. Telemetry (optional placeholder)
    - Stub a `page_view` event hook to wire later (no-op in this story).

## Data/State Model

-   None required. Components render static placeholders.

## Testing Strategy

-   Routing smoke tests: each path renders expected skeleton content.
-   Accessibility checks: presence of landmarks, labels, and focusable CTA on Welcome.
-   Responsive snapshot: verify no horizontal scroll on small widths.

## Definition of Done

-   All AC pass with skeleton screens and layout in place.
-   Pages render without runtime errors and pass basic a11y checks.
-   Code reviewed and merged.

## Estimate

-   0.5–1 day (layout + 5 routes + tests).

## Tasks

-   [x] Create `AppLayout` with header/footer placeholders and skip link.
-   [x] Implement skeleton screens for `/welcome`, `/conversation`, `/capture`, `/inventory`, `/submit`.
-   [x] Add basic a11y: roles, labels, focus order, skip to content.
-   [x] Add routing smoke tests for each path.
-   [x] Right Panel Skeleton in `conversation` (open/close behavior, focus return)
-   [x] Inline Panel Refactor: move `capture` and `inventory` into right-side panel components
-   [x] Remove `/capture` and `/inventory` routes; update tests and docs

## Status

completed

## Dev Agent Record

### File List

-   `surveyor-frontend/app/layout.tsx` (refactor to use `components/AppLayout`)
-   `surveyor-frontend/components/AppLayout.tsx` (new)
-   `surveyor-frontend/app/welcome/page.tsx` (permission guidance + CTA label)
-   `surveyor-frontend/app/conversation/page.tsx`
-   `surveyor-frontend/app/submit/page.tsx`
-   `surveyor-frontend/__tests__/routes.spec.tsx` (tests for routes + guidance + controls)
-   `surveyor-frontend/test/setup.ts` (jest-dom + font mocks)
-   `surveyor-frontend/vitest.config.ts`
-   `surveyor-frontend/package.json` (scripts/devDeps for Vitest + RTL)

### Change Log

-   Added explicit permission guidance on Welcome page and clarified CTA label.
-   Introduced `AppLayout` with labeled placeholders for status/progress and voice/text controls.
-   Adjusted tests to avoid rendering `<html>` in RTL and assert control placeholders.
-   Configured Vitest + RTL with jsdom and jest-dom setup.
-   Removed `/capture` and `/inventory` routes in favor of inline right-side panel from `/conversation`. Updated tests and documentation.
-   Dropped querystring sync for right-side panel (no `?panel=`). Panel state is internal to `/conversation` only.

### SM Notification

-   Scope adjustment: removed `/capture` and `/inventory` routes; flow consolidated under `/conversation` with right-side panels. No change to user journey; reduces surface and aligns with panel-first UX. This is implemented and tests updated.
-   Proposal: adopt an animated HeroUI Drawer for the right-side panel in a follow-up story (see below).

### Follow-up Story (Completed)

-   Title: 1.7 UI Shell Enhancement – HeroUI Drawer Integration
-   Status: **Completed** ✅
-   Summary: Installed/configured HeroUI v2.8.7, replaced custom `RightPanel` with `Drawer` for improved animation and accessibility defaults, confirmed Tailwind v4 compatibility.
-   Outcome: HeroUI integration complete. All panels now use framework-standard drawers with better UX, animations, and a11y. See `_bmad-output/dev-stories/story-1.7-ui-shell-enhancement-drawer.md` for full details.
