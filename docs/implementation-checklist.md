Implementation Checklist (High-Level, No Code)

Scope: Aligns with API, security, and events docs. Ownership can be split across teams; sequence can be parallelized where possible.

Backend (NestJS)
- Links
  - Create endpoint to issue time-limited survey links (absolute TTL, single-use flag).
  - Implement redeem endpoint behavior and error taxonomy (200/410/404/401).
  - Persist link lifecycle metrics and logs.
- Sessions (Realtime)
  - Establish WS namespace and heartbeat policy (30–60s).
  - Apply inactivity timeout and close codes (idle/revoked).
  - Record session lifecycle metrics and errors.
- Surveys
  - Photo upload endpoint accepting multipart and basic validations.
  - Completion endpoint that enqueues internal processing.
  - Optional status endpoint for polling.
- Jobs & Pipeline (Redis/BullMQ)
  - Define queues: survey.completed → pdf.generate → email.send.
  - Implement idempotency, retries/backoff, DLQ, and basic metrics.
  - Emit end-to-end latency metrics and queue depth gauges.
- Email Delivery
  - Configure provider and sender identity.
  - Log delivery outcomes and correlate with survey IDs.
- Storage & Media
  - Define storage layout for originals, overlays, and PDFs.
  - Enforce EXIF stripping and signed URL access.
- Observability
  - Centralize request IDs/correlation IDs across HTTP/WS/jobs.
  - Metrics: link/session/photo/jobs/pdf/email as per docs.
  - Alerts for DLQ growth and degraded latencies.
- Security & Governance
  - Token signing and verification for links.
  - Rate limiting per endpoint category.
  - Data retention policy switch (default retain) and lifecycle rules.

Frontend (Next.js)
- Routes & Flows
  - Deep-link entry: /survey/:token.
  - Call redeem on load; handle 200/410/404/401 states.
  - Establish WS connection using returned info; implement heartbeat timer.
  - Photo capture UX and upload flow (multipart); display quality feedback.
  - Completion confirmation and post-submit feedback screen.
- UX & Accessibility
  - Mobile-first layout and large touch targets.
  - WCAG AA: captions for voice guidance, keyboard navigation, contrast.
  - Graceful error states (redeem failure, network issues).
- Configuration
  - Single source for API and WS base URLs via env.
  - Basic feature flags for optional polling page.

Testing & CI (POC Level)
- Unit: link time math, error mapping, idempotency responses.
- Integration: redeem happy/expired/invalid/tampered; photo upload; complete→queue enqueue.
- E2E smoke: create link → redeem → upload photo → complete → status delivered.
- Coverage gates per PRD addendum.

Rollout & Readiness
- Pilot toggles for partner companies.
- Runbook for common operational issues (expired links, idle timeouts).
- Metrics dashboard for POC KPIs (completion, accuracy feedback, unit economics).


