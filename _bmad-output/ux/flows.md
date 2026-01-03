---
title: Core User Flows (Conversational-First) - surveyor
date: 2026-01-03
---

## Flow 1 — Homeowner Survey (Conversational, Mobile-first)

## Flow 0 — Company Link Lead Capture & Mobile Handoff

```mermaid
flowchart TD
  A[Company distribution link /{companySlug}] --> B[Lead Form (phone, email, name)]
  B --> C{Validation}
  C -- valid --> D[Create lead + generate survey link]
  D --> E[SMS: Send survey link to phone]
  D --> F[Email (fallback/optional)]
  E --> G[Desktop confirmation screen]
  F --> G
  G --> H{Device?}
  H -- Desktop --> I[Show QR code to survey link]
  H -- Mobile --> J[Open survey start link directly]
```

Notes:
- Company-specific public link routes to a lightweight lead form.
- On submit, a unique survey link is generated; SMS is primary delivery; email optional.
- If accessed on desktop, show QR code to handoff the survey to the phone.

```mermaid
flowchart TD
  A[Open link (SMS/Email)] --> B[Welcome + Mic/Camera permission]
  B --> C[Conversation starts (voice + captions)]
  C --> C1[AI proposes spaces; user confirms/edits list]
  C1 --> C2[Progress initialized (0/X); visible in header chip/bar]
  C2 --> D{Prompt type}
  D -- "Guide to next space" --> E[Capture pane opens]
  D -- "Clarify / Q&A" --> C
  E --> F[User captures photo(s)]
  F --> G[AI analyzes + gives feedback]
  G --> H{Satisfactory Check for current space}
  H -- Pass --> I[AI suggests next best step; progress updates (N/X)]
  H -- Needs more --> E
  C --> J[Live Inventory Drawer (view/edit items | Spaces)]
  J --> C
  I --> K[Submit when user says 'done']
  K --> L[Completion summary]
```

Principles:
- Conversation is the primary driver; UI elements (capture, drawers) are summoned by AI prompts or user commands.
- Live Inventory Drawer is accessible at any time to view/edit logged items and manage Spaces (room list) during the session.
- Satisfactory Check runs continuously per space; conversation informs what’s missing in natural language.
- Tips are available via a persistent “Tips” button and inline tip cards on demand.

## Flow 2 — Moving Coordinator Review-to-Quote

```mermaid
flowchart TD
  A[Email: New Survey Complete] --> B[Open PDF]
  B --> C[Room-organized inventory w/ numbered overlays]
  C --> D[Verify high-impact items (furniture/appliances)]
  D --> E[Confirm CFT totals + caveats]
  E --> F[Generate quote (<10 min)]
  F --> G[Send quote to customer]
```

Trust boosters:
- Numbered photo overlays map items to visual evidence.
- Caveats/confidence notes surface uncertainty explicitly.

## Edge Cases & Recovery
- Connectivity degradation: switch to text-first chat; keep Live Inventory Drawer usable offline, sync when online.
- Permission denied: conversational coaching to re-try permissions or proceed with upload-only fallback.
- Long sessions: AI encouragement, explicit progress recap in conversation, inventory count surfaced in drawer chip.


