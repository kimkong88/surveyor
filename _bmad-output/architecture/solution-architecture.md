### Surveyor — Solution Architecture (POC)

This document summarizes the POC architecture and references detailed API, events, and security docs.

1) Components
- Next.js web app (mobile-first): survey UI, voice guidance surface, photo capture, review/submit.
- NestJS backend:
  - HTTP API controllers (links, redeem, photos, complete, status).
  - WebSocket gateway for realtime sessions (heartbeats, close codes).
  - Job processors using Redis (BullMQ) for complete→PDF→email pipeline.
  - Integrations: LangChain v2026 (AI orchestration), Gemini (AI), Supervision+PDF generator, SendGrid (email), SMS provider (survey link delivery).
- AI Orchestrator (via LangChain): Vision-to-Inventory chain; Conversational Clerk chain; Satisfactory Check; item extraction; dimension/weight/material estimates; CFT compute.
- Media & Processing: Object storage (S3/R2) for originals/overlays; server-side PDF service (Supervision + PDF generator).
- Data: Postgres (surveys, rooms, photos, items, PDFs, links, sessions, deliveries, leads).
- Delivery: Email via SendGrid.
- Queues: Redis (BullMQ) for background jobs and scheduling.

2) Core Flows
- Company distribution link (lead capture): customer opens company-specific URL → fills lead form (phone, email, name) → submit → backend creates lead + generates one-time survey link → SMS sent to phone; desktop confirmation shows QR code for mobile handoff.
- Link creation: mover backend calls POST /api/links to generate tokenized URL (absolute TTL).
- Redemption: homeowner opens URL → app calls POST /api/links/:token/redeem → returns sessionId, wsUrl.
- Realtime: WS/WebRTC session via NestJS gateway; Conversational Clerk chain (LangChain) manages guidance/interrupts; inactivity timeout independent of link TTL.
- Photo pipeline: upload via POST /api/surveys/:id/photos → Vision-to-Inventory chain (LangChain) runs analysis → feedback/nextPrompt → overlays stored.
- Completion: POST /api/surveys/:id/complete → enqueue jobs in Redis (BullMQ) → generate PDF → send email via SendGrid → status updated.

3) Quality Control (Satisfactory Check)
- Per-room thresholds on coverage and critical items; prompts retakes/angles; blocks next room until threshold met.
- Confidence/caveat notes stored for transparency in PDF.

4) Non-Functional
- Targets per PRD: TTI <3s, voice RTT <500ms, photo <5s, AI feedback <2s/photo, PDF <30s (≤200 items).
- Reliability: 99.999% app target excluding model downtime; retries/backoff to Gemini; graceful degradations.
- Observability: metrics/logging across links, sessions, WS health, model latency/cost, jobs, PDF/email outcomes, SMS delivery (queued/sent/delivered/failed).

5) Security & Privacy
- HTTPS, signed tokens/URLs, EXIF stripped.
- Link TTL redemption-only; active sessions unaffected by TTL; revocation and inactivity timeouts enforced.
- Retention default: indefinite for ML/analysis; configurable policy hook; encrypted storage.
- Lead form consent language for messaging (TCPA/CTIA where applicable), rate limiting and bot protection on lead submission, and PII masking in logs/telemetry.

6) Deployment Topology
- Next.js on Vercel (UI only).
- NestJS (API/WS/jobs) on Railway/Fly/Render/AWS (sticky WS, schedulers).
- Redis (Upstash/Redis Cloud) for BullMQ queues and rate-limiting counters.
- Postgres (Neon/Supabase); Object Storage (R2/S3) with CDN.
- Email via SendGrid; SMS via provider (e.g., Twilio/MessageBird); DNS/TLS via Vercel/Cloudflare.

7) References
- API contract: ../../docs/api.md
- Background jobs/events: ../../docs/events.md
- Security & sessions: ../../docs/security.md

8) NestJS Module Layout (POC)
- AppModule: composition root, configuration, health endpoints.
- SecurityModule: token signing/verification, guards, rate limiting.
- LinkModule: controller/service/repo for POST /api/links and redeem.
- SessionModule: WebSocket gateway, heartbeats, inactivity/close codes.
- SurveyModule: controllers for photos and complete; status polling.
- MediaModule: uploads, storage client (S3/R2), EXIF stripping.
- AiOrchestratorModule: LangChain v2026 chains (Conversational Clerk, Vision-to-Inventory), Satisfactory Check, item extraction.
- PdfModule: Supervision overlays and PDF assembly.
- EmailModule: SendGrid client and delivery logging.
- SmsModule: SMS provider client and delivery logging.
- LeadModule: controller/service/repo for company distribution link + lead capture + link generation.
- JobsModule: BullMQ queues (survey.completed, pdf.generate, email.send, sms.send) and processors; retries/DLQ; metrics.


