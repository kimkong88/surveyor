# Dev Story: 1.7 UI Shell Enhancement – HeroUI Drawer Integration

## Context

Epic 1: Access Link & Session Management. Replace the custom `RightPanel` with a framework-provided drawer for better motion, accessibility, and consistency.

## Problem Statement

Our hand-rolled right-side panel lacks nuanced animation and built-in a11y affordances. A standard drawer will improve usability and reduce maintenance.

## In Scope

-   Install and configure HeroUI v2.8.7 (requires Tailwind v4).
-   Replace `components/RightPanel` with HeroUI `Drawer` (or equivalent).
-   Preserve existing conversation + inline panel UX and focus management.

## Out of Scope

-   New features beyond parity with current panel.
-   Non-related styling refactors.

## Acceptance Criteria

-   ✅ Conversation page opens and closes the right-side panel using HeroUI `Drawer`.
-   ✅ Focus returns to the chat region on close and works via Escape and close button.
-   ✅ No regressions to a11y landmarks and controls validated in Story 1.1 tests.

## Technical Notes

-   Follow HeroUI v2.8.7 setup. Confirm compatibility with Tailwind v4.
-   Ensure `aria-` attributes and keyboard handling match current behavior or improve it.

## Dependencies

-   Tailwind v4 configuration (already present).
-   HeroUI v2.8.7 packages.

## Definition of Done

-   ✅ Drawer integrated with functional parity and improved UX.
-   ✅ Unit/integration tests updated and passing.
-   ✅ Code reviewed and merged.

## Status

completed

## Dev Agent Record

### File List

-   `surveyor-frontend/package.json` (added @heroui/react@^2.8.7, framer-motion@^12.23.26)
-   `surveyor-frontend/app/hero.ts` (HeroUI Tailwind plugin config)
-   `surveyor-frontend/components/HeroUIProviderWrapper.tsx` (client-side wrapper for HeroUIProvider)
-   `surveyor-frontend/app/Providers.tsx` (wraps children with HeroUIProvider)
-   `surveyor-frontend/components/ui/Drawer.tsx` (reusable drawer component wrapping HeroUI Drawer)
-   `surveyor-frontend/components/CapturePanel.tsx` (uses Drawer component)
-   `surveyor-frontend/components/InventoryPanel.tsx` (uses Drawer component)
-   `surveyor-frontend/components/CapturePanelOpenerButton.tsx` (uses useDisclosure hook)
-   `surveyor-frontend/components/InventoryPanelOpenerButton.tsx` (uses useDisclosure hook, button label corrected to "Open Inventory")
-   `surveyor-frontend/components/ui/Button.tsx` (wrapper for HeroUI Button with onPress support)
-   Removed: `surveyor-frontend/components/RightPanel.tsx` (replaced by HeroUI Drawer)

### Change Log

-   Installed and configured HeroUI v2.8.7 with Tailwind v4 compatibility confirmed.
-   Created `HeroUIProviderWrapper` as a client component to wrap `HeroUIProvider` (required for Next.js App Router).
-   Integrated `Providers.tsx` into root layout to provide HeroUI context tree-wide.
-   Created reusable `Drawer` component that wraps HeroUI `Drawer`, `DrawerContent`, `DrawerHeader`, and `DrawerBody`.
-   Refactored `CapturePanel` and `InventoryPanel` to use the new `Drawer` component instead of custom `RightPanel`.
-   Updated panel opener buttons to use `useDisclosure` hook from HeroUI for open/close state management.
-   Created `Button` wrapper component to use HeroUI `Button` with proper `onPress` event handler (not `onClick`).
-   Implemented focus return to chat region via `chatRegionRef` passed to opener buttons.
-   Added close button (✕) in drawer header with proper aria-label for accessibility.
-   Corrected button label in `InventoryPanelOpenerButton` from "Open Capture" to "Open Inventory".
-   All existing tests continue to pass with no regressions to a11y landmarks.

### SM Notification

-   Story 1.7 completed successfully. HeroUI Drawer integration complete with improved animations, accessibility, and consistent UX.
-   Old custom `RightPanel` component removed and replaced with framework-standard drawer.
-   Focus management and keyboard handling (Escape key) working as expected.
-   No breaking changes to existing routes or test suite.

