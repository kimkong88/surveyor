---
title: Information Architecture & Navigation (Conversational-First) - surveyor
date: 2026-01-03
---

## Top-Level Structure

-   Entry: Company Link Lead Form (phone, email, name) → Confirmation
-   Desktop QR Handoff (if not on mobile)
-   Welcome & Permissions
-   Conversation Workspace (primary surface)
    -   Conversation Pane (voice-led with live captions; text input fallback)
    -   Capture Pane (opens inline on prompt: camera/upload with guidance)
    -   Live Inventory Drawer (view/edit items + manage Spaces anytime)
-   Submit & Confirmation

## Navigation Model

-   Primary: Conversation-first. The AI suggests next best actions; user can also type/speak commands.
-   Secondary: Quick actions surfaced as chips/buttons inside the Conversation Pane (e.g., “Open camera”, “See items”, “Retake photo”).
-   Persistent UI:
    -   Header: Session status chip (items count), progress bar (N/X spaces), connectivity state, Tips button, help.
    -   Footer: Voice toggle, text input, send.
    -   Live Inventory Drawer toggle:
        -   Mobile: Bottom sheet (swipe-up + button)
        -   Desktop: Right-side panel

Entry Routes:

-   `/{companySlug}` → Lead Form
-   `/{companySlug}/thanks` → Confirmation (shows QR on desktop, link/copied on mobile)

## Live Inventory Drawer

-   Contents:
    -   Tabs: Items | Spaces
    -   Items tab: Item list grouped by current/previous spaces
    -   Each item: thumbnail, label, meta (dims/material/weight), confidence, caveats
    -   Inline actions: Edit, Remove, Add item
    -   Spaces tab (Space Planner): suggested list, status (not started/in progress/done), add/edit/reorder
-   Summary: Item count, room count, Satisfactory Check status for current space
-   Interaction: Does not block conversation; updates in real-time as AI logs items

## Content Model (Key Entities)

-   Lead: companyId, phone, email, name, createdAt, surveyLink, deliveryStatus
-   Session: id, status, startAt, expiresAt, connectivity
-   Space: name, status, items[]
-   Item: id, label, estimatedDimensions, weight, material, confidence, caveats, photoRefs[]
-   Photo: url, overlayIndex, qualityScore, capturedAt
-   Message: role (ai|user|system), modality (voice|text), attachments (photoRefs)

## Labels & Microcopy

-   Lead consent: “By submitting, you agree to receive a text message with your survey link.”
-   Conversational: “Great shot of the sofa—let’s grab the entertainment center next.”
-   Drawer microcopy: “Live inventory • 12 items • Living Room (complete)”
-   Satisfactory hints: “I’m still missing a coffee table. Want to add it now?”
-   Confirmation: “Survey complete. Your mover will review and send your estimate.”
-   Tips entry: “Tips” button opens quick tip cards (lighting, angles, coverage checklist)

## Accessibility & Resilience

-   Lead form is fully keyboard and screen-reader accessible; phone/email validation messages are announced
-   QR code has accessible text alternative containing the survey URL
-   Always-on captions for voice output; full keyboard operation
-   Graceful degradation to text-only; drawer remains usable offline and syncs on reconnect
-   AA contrast, visible focus, semantic regions (chat main, drawer complementary)
