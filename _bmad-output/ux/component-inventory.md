---
title: Component Inventory (HeroUI v2.8.7) - surveyor
date: 2026-01-03
---

Scope: Map Atoms directly to HeroUI v2.8.7. Build Molecules and Organisms from these atoms. Keep interactions onPress (not onClick) and prefer compound subcomponents (e.g., Card.Header/Card.Body).

## Atoms (mapped to HeroUI v2.8.7)

-   Button → Button (variants: solid, bordered, ghost, light; sizes: sm/md/lg)
-   Input (text, email, number) → Input
-   TextArea → Textarea
-   Select → Select
-   Switch → Switch
-   Checkbox → Checkbox
-   Radio → RadioGroup + Radio
-   QR Code (rendered via library/canvas; displayed as Image component)
-   Chip/Pill → Chip
-   Badge (counts/labels) → Badge
-   Progress indicator → Progress
-   Spinner (loading) → Spinner
-   Skeleton (loading placeholders) → Skeleton
-   Tooltip → Tooltip
-   Divider/Separator → Divider
-   Link (navigational) → Link
-   Modal primitive → Modal (used as molecule wrapper with header/body/footer)
-   Popover (inline hint) → Popover
-   Tabs (if needed) → Tabs
-   Scroll shadows for carousels/lists → ScrollShadow
-   Surface/Container → Card (use Card.Header, Card.Body, Card.Footer), or Surface if minimal chrome is needed

Notes:

-   Icons: HeroUI doesn’t ship an icon pack; standardize on `lucide-react` for icons embedded via Button.startContent / Chip content.
-   File/Camera: Use native `<input type="file" accept="image/*" capture="environment">` styled as Button; camera viewport uses HTML5 APIs (not a UI atom).

## Molecules (composed)

-   Lead Form Card: Card + Inputs (phone, email, name) + Checkbox (consent) + Button (Submit) + helper Text for validation
-   QR Handoff Card: Card + QR Code (Image) + Link/Button to copy/open survey link + Text instructions
-   Permission Card: Card + Text + List + Button (primary) + Button (secondary)
-   Tips Card: Card + Image placeholder + Caption (Text) + Button
-   Room List Item: List container (ListBox or simple stack) + Room name (Text) + Status Chip + Chevron Icon + Pressable row (Button or Link)
-   Capture Controls: Primary Capture Button + Retake Button (light) + Add Item Button (bordered) + Voice Toggle (Switch) + Text Mode (Switch)
-   Satisfactory Check Banner: Alert (Card variant) + Chip (status) + small Button (“Review remaining”)
-   Item Card (Review): Card + Thumbnail + Title + Meta Chips (material/confidence) + Edit IconButton + Remove IconButton
-   Confirmation Dialog: Modal + Header + Body + Footer with primary/secondary Buttons
-   Progress Header: Text + Progress + Chip for count

### Conversational Molecules

-   Message Bubble (AI/User): Card (light) + Avatar (if used) + Timestamp (Text) + optional Image attachment thumbnail
-   Message List: ScrollShadow vertical + stacked Message Bubbles
-   Composer Bar: Input (multiline or single) + Button (Send) + Switch (Voice on/off) + Tooltip for shortcuts
-   Inline Action Card: Card with title, short description, primary Button (e.g., “Open camera”), secondary Button (“See items”)

## Organisms (per screen in wireframes)

0.  Lead Capture & Handoff
    -   Lead Form: Card (title, inputs, consent), Button primary “Text me the link”
    -   Confirmation: Card with QR (desktop), Button “Copy link”, Link “Open on phone”, helper text
1.  Welcome & Permissions
    -   Card (intro), List of permissions (Text + Divider), Button primary “Get started”, Button secondary “Continue with text only”
    -   Tooltip or Popover for permission rationale
2.  Conversation Workspace (Primary)
    -   Header: Chip (items count), connectivity indicator (Chip/Badge), Help (Link/Button)
    -   Main: Message List + Composer Bar
    -   Inline Action Cards surfaced by AI
    -   Inventory access: Button/Chip opens Live Inventory Drawer
3.  Capture Pane (Inline)
    -   Instruction Banner (Card/Alert) with prompt text
    -   Camera area (custom HTML5 getUserMedia / input file) within Surface/Card
    -   Capture Controls molecule
    -   Skeleton + Spinner during analysis
    -   Satisfactory Check Banner when pending items remain
4.  Live Inventory Drawer
    -   Modal with placement bottom (mobile bottom sheet) or right (desktop) using Modal
    -   Tabs (Items | Spaces) using Tabs component
    -   Grouped Item Cards by space; Edit/Remove/Add actions
    -   Footer: Summary + “Submit survey” (when eligible)
5.  Completion Summary
    -   Success Card (Card + icon + Text)
    -   Stats Chips (items/rooms), Link/Button “Done”

## Screen-to-Atom mapping (quick reference)

-   Primary actions: Button (solid)
-   Secondary/tertiary: Button (light/bordered/ghost)
-   Toggles: Switch
-   Status/counts: Chip, Badge
-   Loading: Spinner, Skeleton
-   Guidance: Tooltip, Popover, Card (alert style)
-   Lists: ListBox (or Card stacks) with Chips
-   Sectioning: Divider
-   Dialogs: Modal
-   Progress: Progress

## Behavioral guidelines

-   Use onPress for all interactive HeroUI components.
-   Prefer compound anatomy:
    -   Card → Card.Header, Card.Body, Card.Footer
    -   Modal → Modal.Header, Modal.Body, Modal.Footer
    -   Accordion → Accordion.Item, Accordion.Trigger, Accordion.Content
-   Accessibility:
    -   Ensure Switch has visible label and aria- attributes.
    -   Modal must trap focus; provide descriptive titles.
    -   All Buttons with icons require accessible names.
-   Conversational specifics:
    -   Ensure message list scrolls to newest with “Skip to latest” Link for accessibility.
    -   Provide caption text for all voice responses.
    -   Inline Action Cards must be reachable via keyboard and screen readers.

## Implementation notes (POC alignment)

-   Photo capture: Implement via file input (accept=image/\*, capture) and/or getUserMedia + canvas; wrap surrounding UI with Card; control actions via Button atoms.
-   Voice toggle: Switch + Tooltip “Enable/disable voice guidance”.
-   Text mode: Switch or Button that flips a UI state; reflect state in banner text.
-   List of rooms: Start with a suggested set; allow “Add space” via Modal form (Input for name).
-   Inventory Drawer: Implement with Modal as bottom sheet on mobile (fullWidth, placement=bottom) and as right-side panel on desktop (placement=right); ensure non-blocking backdrop or allow interaction with chat via dismissible patterns.
-   Space Planner: Use ListBox or Card stack with Button controls for add/edit and simple up/down reordering (drag-and-drop optional later).
-   Tips entry point: Button in header opens Popover/Modal with tip cards; also expose quick-reply chips in chat.

## Open questions

-   Toast/notifications: HeroUI v2 does not include a native Toast; approve a minimal custom Snackbar or use Modal/Popover patterns.
-   Carousel: Prefer ScrollShadow horizontal with Cards; introduce a 3rd-party carousel only if needed.
