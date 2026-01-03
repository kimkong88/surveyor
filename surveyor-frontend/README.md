Surveyor Frontend (Next.js App Router)

Overview
- Next.js starter app for the homeowner survey experience (mobile-first).
- Backend is a separate NestJS service. Frontend talks to it via HTTP and WebSocket.

Prereqs
- Node 18+

Setup
1) Install deps:
   npm install
2) Env:
   - NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

Run
- npm run dev
- App runs on http://localhost:3000

Integration Plan (per API contract)
- Redeem survey link (called when user visits /survey/:token):
  POST {API}/api/links/:token/redeem → { sessionId, surveyId, wsUrl }
- Realtime voice WS:
  Connect to wsUrl and send periodic heartbeats; handle prompts/guidance.
- Photo upload:
  POST {API}/api/surveys/:id/photos (multipart with file, roomId)
- Complete survey:
  POST {API}/api/surveys/:id/complete (queues PDF→email internally)

Docs
- API: ../docs/api.md
- Security/session policy: ../docs/security.md
- Jobs/events: ../docs/events.md
