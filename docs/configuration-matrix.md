Configuration Matrix (High-Level)

Frontend (Next.js)
- NEXT_PUBLIC_API_BASE_URL
  - Example: http://localhost:3001
  - Purpose: Base URL for REST endpoints.
- NEXT_PUBLIC_WS_BASE_URL (optional)
  - Example: ws://localhost:3001/realtime/sessions
  - Purpose: Explicit WS base if not supplied by redeem response.

Backend (NestJS)
- PORT
  - Example: 3001
  - Purpose: HTTP/WS port.
- PUBLIC_SURVEY_BASE_URL
  - Example: http://localhost:3000
  - Purpose: Used to construct link URLs for homeowners.
- PUBLIC_WS_BASE_URL
  - Example: ws://localhost:3001/realtime/sessions
  - Purpose: Provided to clients on redeem (if desired).
- REDIS_URL
  - Example: redis://localhost:6379
  - Purpose: BullMQ queues and rate limit storage.
- SENDGRID_API_KEY
  - Purpose: Email provider key.
- SENDGRID_FROM
  - Example: no-reply@surveyor
  - Purpose: From address for emails.

Storage (if using S3/R2 later)
- STORAGE_BUCKET
- STORAGE_ENDPOINT
- STORAGE_REGION
- STORAGE_ACCESS_KEY_ID
- STORAGE_SECRET_ACCESS_KEY

Security & Governance
- TOKEN_SIGNING_KEY (if using signed link tokens)
- RATE_LIMITS_* (optional granular limits per endpoint)
- RETENTION_POLICY_DAYS (optional; default uses PRD “retain” policy)


