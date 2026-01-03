### Security & Session Policy (POC)

Scope: Link token issuance and redemption, session lifecycle, media access, and retention aligned to PRD NFRs.

1) Link Tokens
- Generation:
  - Absolute TTL; default 24h, configurable 1h–7d.
  - Signed token (e.g., compact JWT or MAC’d blob) with claims:
    - sid (link id), cid (company id), exp (epoch), su (singleUse flag)
  - Store SessionLink: { id, companyId, tokenSig, expiresAt, singleUse, redeemedAt?, revokedAt?, createdAt }
- Redemption:
  - Validate signature and exp.
  - 410 if now > expiresAt; 404 if not found; 401 if signature invalid.
  - Idempotent while active; first valid redemption sets redeemedAt if singleUse.
  - Returns session (see Sessions).
- Revocation:
  - Admin/system may revoke; propagate ≤60s; further redemptions 401/404.

2) Sessions (Realtime)
- Creation:
  - On redeem, create Session: { id, surveyId, status: "active", lastActivityAt: now, inactivityTimeoutSec }
  - Return wsUrl derived from session id (opaque), not the link token.
- Activity & Timeout:
  - Client heartbeats every 30–60s; server updates lastActivityAt atomically.
  - Inactivity expiry: now - lastActivityAt > timeout + grace → status "expired"; WS closed with 4000.
  - Active engagement must not be interrupted by link TTL expiration.
- Revocation:
  - Admin/system revocation ends session immediately; WS close 4001.

3) Media Access & Privacy
- Uploads:
  - Auth by session for /photos; enforce survey ownership.
  - Max size 10MB; validate content-type; scan if required.
- Storage:
  - Server-side encryption; signed URLs for reads.
  - Strip EXIF on ingest before further processing or PDF.
  - Separate keys for originals vs. overlays; overlay watermark optional.
- Retention:
  - Default: retain indefinitely per PRD (NFR-S3) for ML/analysis.
  - Configurable retention policy hook for future changes; lifecycle to colder storage after N days.

4) API Security
- HTTPS-only; HSTS recommended.
- Rate limiting per endpoint as specified in API doc.
- Idempotency-Key supported on POSTs; 24h dedupe window.
- Input validation with explicit allowlists; reject unexpected fields.
- Error responses avoid sensitive details; include machine code and correlationId.

5) Observability & Audit
- Metrics:
  - link_created/consumed/expired/revoked
  - session_started/expired/revoked; ws_disconnects by code
  - photo_upload_attempts/success/fail; pdf_generated; email_sent/failed
- Logs:
  - CorrelationId across redeem→session→jobs→email.
  - Minimal PII; redact emails in logs except domain if needed.
- Alerts:
  - Spike in invalid_signature or link_expired.
  - WS idle timeouts above threshold; sustained job DLQ growth.


