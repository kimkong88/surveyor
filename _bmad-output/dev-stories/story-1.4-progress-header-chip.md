# Dev Story: 1.4 Progress header chip and room counter (UI only)

Status: ready-for-dev  
Epic: 1 - Access Link & Session Management  
Story ID: 1.4  
File: `1-4-progress-header-chip.md`

## Context

-   Provide an always-visible progress indicator (items count and spaces N/X) in the header for primary routes.
-   UI-only with mock client state to unblock demos while backend/session flows mature.
-   Align with Epic 1 flows, UX wireframes (header chip, progress bar), and HeroUI v2.8.7 component inventory.

## Problem Statement

Homeowners need a clear, accessible signal of overall progress (rooms/ spaces completed and items captured). The header chip must update instantly when mock space status changes and remain mobile-friendly.

## User Story

As a homeowner,  
I want to see progress (N/X spaces),  
so that I know how far I’ve gotten.

## Acceptance Criteria

-   [ ] **AC1**: Given a mock list of spaces and completion states, when I view any primary route, then the header chip shows `items count` and `N/X` spaces.
-   [ ] **AC2**: Given I change a space status in mock state, when the UI updates, then the header chip reflects the new counts immediately.
-   [ ] **AC3**: Labels have accessible names for screen readers (aria-label/text equivalents); contrast meets AA.

## Tasks / Subtasks

-   [ ] Task 1 (AC1, AC2) Implement Progress Header component
    -   [ ] Subtask 1.1 Create `ProgressHeader`/`ProgressChip` component (HeroUI Chip/Badge + optional Progress) with compact layout for mobile.
    -   [ ] Subtask 1.2 Render counts: `Items: <totalItems>` and `<completedSpaces>/<totalSpaces> spaces`. Guard zero/undefined state.
    -   [ ] Subtask 1.3 Apply AA contrast and spacing per wireframes; ensure truncation on narrow widths.
-   [ ] Task 2 (AC1, AC2) Mock state + selectors
    -   [ ] Subtask 2.1 Define mock state shape `{ id, name, status, itemCount }` and derived selectors `{ completed, total, totalItems }`.
    -   [ ] Subtask 2.2 Provide a simple hook/provider (context or Zustand) to read/update statuses for demos; default data lives in a single source.
    -   [ ] Subtask 2.3 Expose an updater to toggle status for fast UI verification.
-   [ ] Task 3 (AC3) Accessibility & semantics
    -   [ ] Subtask 3.1 Add `aria-label="Survey progress: <completed>/<total> spaces complete, <items> items"` on the chip; readable text nodes for SRs.
    -   [ ] Subtask 3.2 Verify focus order and that chip is non-interactive (or has `role="status"` if live). Ensure captions/text equivalents exist.
    -   [ ] Subtask 3.3 Validate AA contrast on chip background/text per theme.
-   [ ] Task 4 (AC1, AC2, AC3) Integration & tests
    -   [ ] Subtask 4.1 Mount component in shared header (e.g., `app/(shell)/layout.tsx` or `app/s/[token]/layout.tsx`) so it appears on primary routes.
    -   [ ] Subtask 4.2 Component tests: renders counts, updates on state change, handles zero spaces, accessibility labels.
    -   [ ] Subtask 4.3 Responsive snapshot: no overflow or wrapping issues on small screens.

## Technical Notes

-   Framework: Next.js App Router; components using hooks must be client components (`'use client'`).
-   UI library: HeroUI v2.8.7 atoms; use `onPress` (not `onClick`); prefer compound anatomy per `_bmad-output/ux/component-inventory.md`.
-   Placement: shared header; ensure chip + progress text fit mobile portrait. Consider ellipsis for long labels.
-   State: mock-only; do not call backend. Keep state in one provider to avoid divergence across routes.
-   Accessibility: AA contrast, aria-label with human-readable sentence, `role="status"` if treated as live region; otherwise static text with clear labels.
-   Dependencies: avoid adding new libs; reuse existing feature-flag pattern only if needed for mock toggle.
-   Testing: Vitest + React Testing Library. Target selectors and rendered text; simulate state toggle to assert live updates.

## Data/State Model

```ts
type Space = {
    id: string;
    name: string;
    status: "not-started" | "in-progress" | "done";
    itemCount: number;
};
type ProgressState = {
    spaces: Space[];
    totalItems: number; // derived from sum of itemCount if desired
};
// Selectors
completedSpaces = spaces.filter((s) => s.status === "done").length;
totalSpaces = spaces.length;
totalItems = totalItems ?? sum(spaces.map((s) => s.itemCount));
```

## Risks & Mitigations

-   Risk: Layout crowding on small screens. Mitigation: compact chip, abbreviated copy (`Items 12 · 3/7`).
-   Risk: Divergent mock state across routes. Mitigation: single provider, shared default data.
-   Risk: Accessibility gaps. Mitigation: explicit aria-label, verify AA contrast, ensure text nodes readable.

## Testing Strategy

-   Unit/component: counts render correctly for given state; updates when state changes; zero/empty state handled.
-   Integration: toggling a space completion updates chip text immediately in header.
-   Responsive: no horizontal scroll/overflow on small widths.
-   Accessibility: aria-label present; text readable by screen readers; contrast validated.

## References

-   Epic/story source: `_bmad-output/planning-artifacts/epics.md` (Epic 1, Story 1.4 ACs).
-   PRD: `_bmad-output/planning-artifacts/prd.md` (progress visibility, accessibility).
-   Architecture: `_bmad-output/architecture/solution-architecture.md` (Next.js frontend, HeroUI v2.8.7, onPress).
-   UX flows & IA: `_bmad-output/ux/flows.md`, `_bmad-output/ux/wireframes.md`, `_bmad-output/ux/ia.md` (header chip/progress, mobile-first).
-   Component inventory: `_bmad-output/ux/component-inventory.md` (HeroUI atoms, onPress, compound anatomy).

## Dev Agent Record

-   Agent Model Used: gpt-5.1-codex-max
-   Debug Log References: n/a (story authoring)

## File List

-   `surveyor-frontend/components/ProgressHeader.tsx` (new component)
-   `surveyor-frontend/context/ProgressContext.tsx` or mock store (new)
-   `surveyor-frontend/app/s/[token]/layout.tsx` (or shared layout) for header mount
-   `surveyor-frontend/__tests__/components/progress-header.spec.tsx` (new tests)

## Change Log

-   2026-01-03: Story updated via validation to include structured ACs, tasks with checkboxes, dev notes, references, file list, and a11y/UX/architecture alignment.
