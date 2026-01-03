# Dev Story: 1.1 Frontend shell scaffold (routes + screens)

## Context
Epic 1: Access Link & Session Management. Establish a navigable, mobile-first app shell with the primary screens used across the survey flow. This creates the foundation for subsequent stories (e.g., link redemption and session start).

## Problem Statement
We need baseline routes and skeleton screens for the core flow (Welcome, Conversation, Capture, Inventory, Submit) with header/footer placeholders and basic accessibility so teams can build features incrementally without blocking on layout.

## In Scope
- Routes: `/welcome`, `/conversation`, `/capture`, `/inventory`, `/submit`.
- Skeleton screen components for each route.
- Shared layout with header/footer placeholders (status, progress, voice/text controls).
- Mobile-first layout and basic accessibility (labels, focus order).

## Out of Scope
- Real data, API calls, or session logic.
- Voice, camera, inventory wiring beyond placeholders.
- Final styling/branding; this is scaffolding.

## Requirements Mapping
- Supports FR3–FR4 indirectly by establishing structure for progress display (placeholder now).
- Aligns with Additional Requirements: Next.js (mobile-first), accessible UI patterns.

## User Story
As a homeowner,  
I want a basic app shell with routes for Welcome, Conversation, Capture, Inventory, and Submit,  
So that I can navigate the survey flow.

## Acceptance Criteria
- Given the app runs locally  
  When I navigate to `/welcome`  
  Then I see a Welcome screen with a primary CTA and permission guidance

- Given I visit `/conversation`, `/capture`, `/inventory`, or `/submit`  
  When those routes load  
  Then the corresponding skeleton screen renders with header/footer placeholders

- Given a mobile viewport  
  When I navigate between routes  
  Then the header shows status placeholders and the footer shows voice/text controls placeholders with basic accessibility (labels, focus order)

## Technical Plan
1) Project Structure
   - Create shared `AppLayout` with header/footer placeholders and responsive container.
   - Provide a simple `Screen` wrapper with consistent paddings and skip-to-content link.
2) Routing
   - Add pages for `/welcome`, `/conversation`, `/capture`, `/inventory`, `/submit`.
   - Each page exports a skeleton component with semantic landmarks.
3) Accessibility
   - Header/footer have appropriate roles/labels.
   - Ensure logical focus order and skip link to main content.
   - Buttons and controls use accessible names.
4) Mobile-first UX
   - Use responsive layout with touch-friendly spacing.
   - Avoid overflow; ensure content remains usable in portrait/landscape.
5) Telemetry (optional placeholder)
   - Stub a `page_view` event hook to wire later (no-op in this story).

## Data/State Model
- None required. Components render static placeholders.

## Testing Strategy
- Routing smoke tests: each path renders expected skeleton content.
- Accessibility checks: presence of landmarks, labels, and focusable CTA on Welcome.
- Responsive snapshot: verify no horizontal scroll on small widths.

## Definition of Done
- All AC pass with skeleton screens and layout in place.
- Pages render without runtime errors and pass basic a11y checks.
- Code reviewed and merged.

## Estimate
- 0.5–1 day (layout + 5 routes + tests).

## Tasks
- Create `AppLayout` with header/footer placeholders and skip link.
- Implement skeleton screens for `/welcome`, `/conversation`, `/capture`, `/inventory`, `/submit`.
- Add basic a11y: roles, labels, focus order, skip to content.
- Add routing smoke tests for each path.

