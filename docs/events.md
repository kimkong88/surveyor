### Background Jobs & Events (POC)

Overview: Completion enqueues a deterministic pipeline that generates the PDF (with numbered overlays) and delivers it via email. Jobs are idempotent, retry-safe, and observable.

1) Queues
- queue: survey.completed
  - Triggered by POST /api/surveys/:id/complete
  - Payload:
    - type: "survey.completed"
    - surveyId: string
    - correlationId: string
    - requestedAt: string (ISO8601)
- queue: pdf.generate
  - Produced by consumer of survey.completed
  - Payload:
    - type: "pdf.generate"
    - surveyId: string
    - correlationId: string
- queue: email.send
  - Produced after successful PDF generation
  - Payload:
    - type: "email.send"
    - surveyId: string
    - pdfDocumentId: string
    - to: string (moving company)
    - correlationId: string

2) Job Flow (successful path)
survey.completed → pdf.generate → email.send

3) Idempotency & Deduplication
- Each job carries an idempotencyKey derived from (type, surveyId[, pdfDocumentId]).
- Consumers must upsert a job ledger row before processing; if exists with success, short-circuit.
- Retries use exponential backoff (e.g., 1m, 5m, 20m, 1h) with a max attempt cap (e.g., 10).
- Failures land in DLQ with alerts after cap.

4) PDF Generation Steps
- Read survey, rooms, photos, and items.
- For each photo:
  - Render numbered overlays using Supervision into storageKeyOverlay.
- Assemble PDF:
  - Sections per room with photos+overlays and item tables (dimensions, weight, material, CFT, notes).
  - Summary with total CFT and counts.
- Persist PdfDocument and emit pdf.generate → success.

5) Email Delivery Steps
- Compose email:
  - Subject: "New Survey Complete — {customerName?} — {companyName}"
  - Body summary: room/item counts, total CFT, link to PDF.
  - Attachment optional; prefer signed URL link to storage.
- Send via provider (SES/SendGrid); store DeliveryLog with providerId, status.
- Emit metrics for sent/failed; retry on 4xx retryable/5xx errors.

6) Metrics & Observability
- Counters:
  - jobs_enqueued, jobs_processed, jobs_succeeded, jobs_failed by type.
  - retries_attempted, dlq_depth.
- Durations:
  - end-to-end from complete to email sent (P50/95/99).
  - pdf_generation_duration, email_send_duration.
- Gauges:
  - queue_depths for each queue.
- Alerts:
  - DLQ depth > threshold.
  - end-to-end latency > target for sustained period.

7) Storage & Access
- All generated artifacts (overlays, PDF) are stored with signed-read access and server-side encryption.
- Retain originals and generated artifacts per retention policy (see security doc).


