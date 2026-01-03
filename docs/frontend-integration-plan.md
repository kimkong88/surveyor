Frontend Integration Plan (High-Level, No Code)

Goals
- Provide homeowners a frictionless, mobile-first survey experience that adheres to API/security/events docs.

Primary Routes
- / (entry/marketing placeholder or redirect)
- /survey/:token
  - On load: call redeem {API}/api/links/:token/redeem.
  - Handle responses:
    - 200: proceed to session initialization.
    - 410: show “Link expired” with contact guidance.
    - 404/401: show “Invalid link” with support guidance.
- /survey/:id/review (optional)
  - Summarize captured items and allow user confirmation before completion.
- /survey/:id/done
  - Confirmation after submitting completion.

Core Flow
1) Link Redemption
   - Fetch redeem.
   - Store sessionId, surveyId, wsUrl in client state.
2) Realtime Session
   - Connect to wsUrl.
   - Start heartbeat timer (e.g., every 30–60s).
   - Render prompts/instructions; display accessible captions.
3) Photo Capture & Upload
   - Use device camera via browser.
   - Upload multipart with file and roomId to {API}/api/surveys/:id/photos.
   - Present quality feedback and next prompt.
4) Completion
   - Confirm submission to {API}/api/surveys/:id/complete.
   - Show processing confirmation and move to done screen.
   - Optional polling: GET {API}/api/surveys/:id/status for PDF availability.

State & Error Handling
- Loading states: initial redeem, WS connect, photo upload.
- Errors: network failures, redeem errors, oversized images.
- Session: detect idle timeout messaging (if socket closed with idle code).
- Resilience: allow safe reload during active session where feasible.

Accessibility & Mobile
- WCAG 2.1 AA:
  - Captions for voice guidance prompts.
  - Keyboard navigation for all actions.
  - Contrast compliant color palette.
- Mobile-first:
  - One-handed controls, large targets, progressive hints.
  - Clear camera permission rationale and retry UX.

Configuration
- NEXT_PUBLIC_API_BASE_URL for HTTP endpoints.
- NEXT_PUBLIC_WS_BASE_URL (optional if wsUrl is returned from redeem).
- Feature flags for optional review page and status polling.

Analytics (POC)
- Track session start, completion, abandon points.
- Capture photo counts per room and retake prompts (anonymized).
- Report errors with minimal PII and correlation IDs from backend.


