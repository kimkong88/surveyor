### Surveyor API Contract (POC)

Purpose: minimal, reliable surface to support link redemption, realtime session, photo uploads, and completion-triggered PDF and email. Public surface avoids direct “generate/send” endpoints; those occur via internal jobs after completion.

1) Authentication & Transport
- HTTPS only.
- Link token redemption bootstraps a short-lived session for WS.
- Optional Idempotency-Key header for safe retries on POST endpoints.

2) Endpoints

- POST /api/links
  - Purpose: Create time-limited survey link from mover’s “Get quote”.
  - Request (JSON):
    - companyId: string
    - expiresInHours?: number (default 24; min 1, max 168)
    - singleUse?: boolean (default true)
  - 201 Response (JSON):
    - linkId: string
    - linkUrl: string
    - expiresAt: string (ISO8601)
    - singleUse: boolean
  - Errors: 400 invalid, 401 unauthorized (if admin surface), 429 rate-limited.
  - Notes: absolute TTL; no sliding window.

- POST /api/links/:token/redeem
  - Purpose: Called by the survey page when homeowner opens the link.
  - Behavior: Idempotent for active link; repeated calls return same session.
  - 200 Response (JSON):
    - sessionId: string
    - surveyId: string
    - wsUrl: string
    - inactivityTimeoutSec: number
  - Errors:
    - 410 Gone { code: "link_expired", expiresAt }
    - 404 Not Found { code: "not_found" }
    - 401 Unauthorized { code: "invalid_signature" }

- WS /realtime/sessions/:sessionId
  - Purpose: Bidirectional audio/chat guidance and heartbeats.
  - Protocol (message “type” examples):
    - client → server:
      - heartbeat { type: "heartbeat", ts }
      - speech_in { type: "speech_in", chunkId, audioBase64 }
      - event { type: "user_action", action: "room_next"|"room_retry"|... }
    - server → client:
      - tts_out { type: "tts_out", chunkId, audioBase64 }
      - prompt { type: "prompt", text }
      - photo_request { type: "photo_request", roomId, instructions }
      - room_status { type: "room_status", roomId, satisfactoryScore, blockingReasons }
      - error { type: "error", code, message }
  - Heartbeat: client sends every 30–60s; server resets lastActivityAt.
  - Close codes: 4000 (idle timeout), 4001 (revoked), 4002 (server shutdown).

- POST /api/surveys/:id/photos
  - Purpose: Mid-session photo upload.
  - Content-Type: multipart/form-data
    - file: image/* (1–5MB typical)
    - roomId: string
  - 200 Response (JSON):
    - photoId: string
    - qualityFeedback: { lighting: "ok"|"low", blur: "ok"|"high", angleHint?: string }
    - nextPrompt: string
    - optional: detections?: Array<{ itemId, name, confidence }>
  - Errors: 400 invalid, 401/403 not authorized for survey, 413 payload too large, 429 rate-limited, 5xx transient.
  - Notes: may switch to presigned PUT in Phase 2; keep POST for POC simplicity.

- POST /api/surveys/:id/complete
  - Purpose: User confirms submission; triggers internal pipeline (PDF → email).
  - 202 Response (JSON):
    - jobId: string
    - state: "queued"
  - Idempotent: subsequent calls return the original jobId/state if already queued.
  - Side effects (internal): enqueue generate_pdf and send_email tasks; update status.

- GET /api/surveys/:id/status (optional but recommended)
  - Purpose: Polling endpoint for UI/ops.
  - 200 Response (JSON):
    - state: "active"|"processing"|"completed"|"failed"
    - summary?: { rooms, items, totalCft }
    - pdfUrl?: string (signed)
    - lastUpdatedAt: string

3) Error Taxonomy
- Standard HTTP mapping with machine-readable codes:
  - 400 bad_request
  - 401 unauthorized
  - 403 forbidden
  - 404 not_found
  - 410 link_expired
  - 413 payload_too_large
  - 429 rate_limited
  - 500 internal_error
  - 503 service_unavailable

4) Rate Limits (POC baselines)
- /api/links: 30/min per companyId, burst 10.
- /redeem: 60/min per IP, burst 20.
- /photos: 300/min per session, burst 50; per-file size cap 10MB.
- /complete: 10/min per survey.

5) Idempotency
- Header: Idempotency-Key (UUID). Server stores request hash/response for 24h for POSTs (links, photos, complete).

6) Schemas (high level)
- Item:
  - { id, surveyId, roomId, name, dimensions: { wIn, dIn, hIn }, weightLbs, material, cft, confidence, notes }
- Photo:
  - { id, surveyId, roomId, storageKeyOriginal, storageKeyOverlay?, qualityScore, analyzedAt }
- PdfDocument:
  - { id, surveyId, storageKeyPdf, generatedAt, pageCount, summaryCft }

7) Security Notes
- HTTPS; signed URLs for media access.
- Link tokens are signed; redemption creates session with rolling inactivity timeout.
- Strip EXIF on server before any PDF use.


