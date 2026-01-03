# Dev Story: 1.4 Progress header chip and room counter (UI only)

## Context
Epic 1: Access Link & Session Management. Provide a lightweight progress indicator in the header that shows item count and spaces progress (N/X). This is UI-only with mock state to enable quick feedback loops while core flows are built.

## Problem Statement
Users need an always-visible sense of progress across rooms/spaces and total items captured. We need a simple header chip that reflects counts immediately when mock state changes.

## In Scope
- Header progress chip UI component.
- Read from mock client state for:
  - Total items count
  - Completed spaces / total spaces (N/X)
- Immediate UI update on mock state changes.
- Basic accessibility labels and roles.

## Out of Scope
- Real integration to capture/analysis or persistence.
- Complex progress logic (confidence thresholds handled in later epics).

## User Story
As a homeowner,  
I want to see progress (N/X spaces),  
So that I know how far I’ve gotten.

## Acceptance Criteria
- Given a mock list of spaces and completion states  
  When I view any primary route  
  Then the header chip shows `items count` and `N/X` spaces

- Given I change a space status in mock state  
  When the UI updates  
  Then the header chip reflects the new counts immediately

- And labels have accessible names for screen readers

## Technical Plan
1) Component
   - `ProgressChip` showing:
     - Left: items total (e.g., “Items: 12”)
     - Right: spaces progress (e.g., “3/7 spaces”)
   - Compact, mobile-first chip styling; fits into existing header placeholder.
2) Mock State
   - Store shape:
     ```ts
     type Space = { id: string; name: string; isComplete: boolean };
     type ProgressState = {
       spaces: Space[];
       totalItems: number;
     };
     ```
   - Provide a simple store/hook (context/zustand) to read `spaces` and `totalItems` and to “toggle complete” for testing.
3) Reactivity
   - Derive `completedCount = spaces.filter(s => s.isComplete).length`.
   - Render `completedCount / spaces.length`.
   - Update immediately when mock setter changes state.
4) Accessibility
   - Chip has `aria-label="Survey progress"` and readable text nodes for counts.
   - Ensure sufficient color contrast and focus ring if interactive in future.
5) Placement
   - Integrate into shared `AppLayout` header area.
   - Ensure no overflow on small screens; truncate gracefully if needed.

## Data/State Model
- `ProgressState` in a mock store with:
  - `spaces: Space[]`
  - `totalItems: number`
- Selectors:
  - `useTotalItems()`
  - `useSpacesProgress()` → `{ completed: number, total: number }`

## Telemetry (Optional Placeholder)
- Future: `progress_view` emitted on route change; not required in this story.

## Risks & Mitigations
- Risk: Layout crowding in small viewports.  
  Mitigation: Keep chip compact; abbreviate copy, e.g., “Items 12 · 3/7”.
- Risk: Inconsistent mock data across routes.  
  Mitigation: Single store used across all routes.

## Testing Strategy
- Unit tests:
  - Selector computes `completed/total` correctly.
  - Component renders expected text for given state.
- Integration tests:
  - Toggling a space completion updates the chip text immediately.
- Responsive checks:
  - No horizontal scroll or text overflow on small screens.
- Accessibility:
  - `aria-label` present; text readable by screen readers.

## Definition of Done
- All AC pass in local environment with mock state.
- Chip displays correct counts and updates immediately when mock state changes.
- Integrated in header across primary routes without layout regressions.
- Basic a11y validated.

## Estimate
- 0.25–0.5 day (component, mock store wiring, tests).

## Tasks
- Implement `ProgressChip` UI component.
- Add mock `ProgressState` store with selectors.
- Mount `ProgressChip` in `AppLayout` header.
- Add tests for selectors and UI updates.

