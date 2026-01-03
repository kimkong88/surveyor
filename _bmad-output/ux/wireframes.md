---
title: Low-Fidelity Wireframes (Conversational-First Outline) - surveyor
date: 2026-01-03
---

Mobile portrait first. Conversation is primary; capture and inventory are invoked inline.

## 1) Welcome & Permissions
- Header: Logo/Title
- Body: Friendly intro; explain voice + camera usage
- Primary CTA: “Get started” → microphone + camera prompt
- Secondary: “Continue with text only”

## 2) Conversation Workspace (Primary Screen)
- Layout:
  - Top bar: Session chip (items count), progress bar (N/X spaces), Tips button, connectivity, Help
  - Main: Conversation Pane (messages with captions; input field + voice toggle)
  - Inline: AI can insert action cards (e.g., “Open camera”, “See items”)
  - Access: “Items” button (chip with count) to open Live Inventory Drawer

## 3) Capture Pane (Inline Panel)
- Triggered by AI or user command
- Instruction banner: short, specific prompt
- Camera viewport: native integration (grid overlay)
- Controls:
  - Capture (primary)
  - Retake
  - Add item manually
  - Voice on/off, Text input toggle
- Feedback: Skeleton/Spinner while analyzing; conversational updates posted to chat
- Satisfactory Check banner for current space appears as inline notice

## 4) Live Inventory Drawer
- Mobile: Bottom sheet; Desktop: Right panel
- Header: “Live inventory • N items”
- Content:
  - Tabs: Items | Spaces
  - Items: Group by space (current space first)
  - Spaces (Space Planner): suggested list, status (not started/in progress/done), add/edit/reorder
  - Item cards: thumbnail, label, meta (dims/material/weight), confidence, caveats
  - Actions: Edit, Remove, Add
- Footer: Summary (items/rooms), “Submit survey” quick action (enabled when AI deems ready)

## 5) Completion Summary
- Success Card: Checkmark, stats (N items across M spaces)
- Text: “Your mover will review and send your estimate”
- CTA: “Done”

## PDF Trust Elements (for implementation alignment)
- Numbered overlays on photos (match item list order)
- Room/space headers and summaries
- Caveat badges (e.g., “Angle unclear—verify”)


