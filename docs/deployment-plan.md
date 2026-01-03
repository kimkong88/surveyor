Deployment Plan (High-Level, No Code)

Service Topology
- Frontend (Next.js)
  - Host on Vercel (or equivalent). Uses env for API base URL.
- Backend (NestJS)
  - Host on Railway/Fly/Render/AWS. Requires sticky WS and background job scheduling.
- Redis
  - Managed Redis (Upstash/Redis Cloud) for BullMQ and rate limiting.
- Database (future)
  - Managed Postgres (Neon/Supabase) when persistence is added.
- Storage
  - S3/R2 for originals, overlays, PDFs with CDN in front (when enabled).
- Email
  - SendGrid for delivery.

Environments
- dev: developer machines; local Redis optional.
- staging: pre-prod validation; feature flags and realistic limits.
- prod: POC pilot; minimal blast radius and observability enabled.

Networking & DNS
- Frontend domain (e.g., app.surveyor.*) served via platform.
- Backend subdomain (api.surveyor.*) with TLS termination.
- CORS configured to allow frontend origin(s).

Secrets & Configuration
- Use platform secret stores for env vars (see configuration matrix).
- Rotations: quarterly or as required by providers.

Observability
- Metrics: link/session/photo/jobs/pdf/email.
- Logs with correlation IDs.
- Alerts:
  - Redis connectivity and queue DLQ growth.
  - Elevated 4xx/5xx rates on key endpoints.
  - WS disconnect spikes or idle timeouts beyond threshold.

Release Process
- CI: lint/test/build on PR; coverage gates per PRD addendum.
- Staging deploy on main branch merge; smoke tests.
- Manual approval to prod; rollback plan via previous build artifacts.

Risk & Mitigation
- Realtime instability: keep WS gateway near users; monitor RTT/packet loss.
- Provider outages (SendGrid/Redis): backoff/retry; DLQ visibility.
- Cost control: enforce rate limits; monitor per-survey unit economics.


