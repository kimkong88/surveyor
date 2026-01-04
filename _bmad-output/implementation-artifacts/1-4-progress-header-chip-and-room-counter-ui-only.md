# Story 1.4: Progress header chip and room counter (UI only)

Status: review  
Epic: 1 - Access Link & Session Management  
Story ID: 1.4  
File: `1-4-progress-header-chip-and-room-counter-ui-only.md`

## Story

As a homeowner,  
I want to see progress (N/X spaces),  
so that I know how far I’ve gotten.

## Acceptance Criteria

1. **Given** a mock list of spaces and completion states  
   **When** I view any primary route  
   **Then** the header chip shows `items count` and `N/X` spaces

2. **Given** I change a space status in mock state  
   **When** the UI updates  
   **Then** the header chip reflects the new counts immediately

3. **And** labels have accessible names for screen readers

## Tasks / Subtasks

- [x] Task 1 (AC: #1, #2) Define mock space + item state for header counts  
  - [x] Subtask 1.1 Create shared mock state shape `{ id, name, status, itemCount }` with computed `completed` vs `total`  
  - [x] Subtask 1.2 Provide updater utility or mock hook to toggle status and emit updated counts
- [x] Task 2 (AC: #1, #2) Build Progress Header chip UI  
  - [x] Subtask 2.1 Render item count chip + N/X spaces in header bar using HeroUI atoms (Chip/Badge/Progress)  
  - [x] Subtask 2.2 Ensure live recompute on state change (no remount required)
- [x] Task 3 (AC: #3) Accessibility + semantics  
  - [x] Subtask 3.1 Add `aria-label` for item count and progress values; expose text alternatives (e.g., "3 of 7 spaces complete")  
  - [x] Subtask 3.2 Validate keyboard focus order and readable text equivalents for screen readers
- [x] Task 4 (AC: #1, #2, #3) Tests and stories  
  - [x] Subtask 4.1 Add component test/storybook entry covering state changes and accessibility labels  
  - [x] Subtask 4.2 Snapshot basic and updated states; assert aria-label content

## Dev Notes

- UI-only: use mock data; do not call backend. Keep state colocated or via lightweight provider so future real data can swap in.  
- Components: prefer a reusable header component (e.g., `surveyor-frontend/components/ProgressHeader.tsx`) and wire into session layout (`app/s/[token]/layout.tsx` or shared header).  
- Counts: show both item count and `completedSpaces/totalSpaces`. For mock, derive `completed` where status ∈ {`done`, `complete`} and allow quick toggles for demos.  
- Accessibility: expose human-readable text (`aria-label="3 of 7 spaces complete, 12 items logged"`). Ensure contrast meets AA and chips are announced.  
- Styling: HeroUI v2.8.7 atoms; use `onPress` handlers; prefer compound anatomy (`Card`, `Chip`, `Progress`) per component inventory.  
- Responsiveness: header must fit mobile portrait; truncate long labels; keep chip tap target ≥44px.  
- Telemetry: none required for UI-only mock.  
- Reuse: align with existing contexts (`LinkTokenContext`, `SessionContext`) but avoid coupling to sessionId for mock.

### Project Structure Notes

- Next.js App Router; keep shared UI in `components/` and import into server layouts via client wrappers only when needed.  
- Follow established feature-flag pattern if a toggle is needed (`feature.mock*` in `lib/feature-flags.ts`), but default to mock-on for this UI.  
- Tests: Vitest + React Testing Library; place component tests under `surveyor-frontend/__tests__/components/`.

### References

- Epic/Story source: `_bmad-output/planning-artifacts/epics.md` (Story 1.4).  
- PRD context: `_bmad-output/planning-artifacts/prd.md`.  
- Architecture guardrails: `_bmad-output/architecture/solution-architecture.md`.  
- UX flows & IA: `_bmad-output/ux/flows.md`, `_bmad-output/ux/wireframes.md`, `_bmad-output/ux/ia.md`.  
- Component patterns: `_bmad-output/ux/component-inventory.md` (HeroUI v2.8.7 atoms, onPress, compound anatomy).

## Dev Agent Record

### Agent Model Used

gpt-5.1-codex-max

### Debug Log References

- n/a (story creation)

### Completion Notes List

- Story generated via SM create-story workflow (YOLO). No implementation performed yet.
- **Implementation Complete (2026-01-03):**
  - Created `ProgressContext` with mock space state management (7 default spaces)
  - Implemented `ProgressHeader` component using HeroUI Chip components
  - Integrated ProgressHeader into AppLayout header section
  - Added ProgressProvider to app Providers wrapper
  - All acceptance criteria satisfied:
    - AC #1: Header chip displays item count and N/X spaces format
    - AC #2: UI updates immediately when space status or item counts change
    - AC #3: Full accessibility support with aria-labels, keyboard navigation, and screen reader text
  - Comprehensive test coverage: 14 component tests + 6 context tests + 3 snapshots
  - All 82 tests passing (no regressions)
  - Fixed existing route tests by adding ProgressContext mock

### File List

- `surveyor-frontend/context/ProgressContext.tsx` (new)
- `surveyor-frontend/components/ProgressHeader.tsx` (new)  
- `surveyor-frontend/components/AppLayout.tsx` (modified - integrated ProgressHeader)
- `surveyor-frontend/app/Providers.tsx` (modified - added ProgressProvider)
- `surveyor-frontend/__tests__/progress-context.spec.tsx` (new)
- `surveyor-frontend/__tests__/components/progress-header.spec.tsx` (new)
- `surveyor-frontend/__tests__/routes.spec.tsx` (modified - added ProgressContext mock)

## Change Log

- 2026-01-03: Initial story generated for Progress header chip and room counter (UI only).
- 2026-01-03: Implementation complete - Progress header chip with mock state management, HeroUI Chip components, full accessibility support, comprehensive tests (14 component + 6 context + 3 snapshots), all 82 tests passing.

