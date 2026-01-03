Surveyor Backend (NestJS)

Overview
- NestJS app providing the API, WebSocket realtime guidance, and background jobs.
- Aligns with PRD and the API/events/security docs in ../docs.

Prereqs
- Node 18+
- Redis (local or managed)

Install
```bash
npm install
```

Environment
- PORT=3001
- PUBLIC_SURVEY_BASE_URL=http://localhost:3000
- PUBLIC_WS_BASE_URL=ws://localhost:3001/realtime/sessions
- REDIS_URL=redis://localhost:6379
- SENDGRID_API_KEY=your_key
- SENDGRID_FROM=no-reply@surveyor

Run
```bash
npm run start:dev
```

Planned Modules/Features
- Links
  - POST /api/links
  - POST /api/links/:token/redeem (returns sessionId, surveyId, wsUrl)
- Surveys
  - POST /api/surveys/:id/photos (multipart)
  - POST /api/surveys/:id/complete (queues internal jobs)
  - GET /api/surveys/:id/status (optional)
- Session Gateway
  - WS namespace: /realtime/sessions
  - Heartbeats (30–60s), inactivity timeout close codes (4000/4001)
- Queues (Redis/BullMQ)
  - survey.completed → pdf.generate → email.send
- Email
  - SendGrid provider for delivery and logging

Recommended Packages to Add
```bash
npm i @nestjs/websockets @nestjs/platform-socket.io
npm i bullmq ioredis
npm i @sendgrid/mail
npm i class-validator class-transformer
npm i multer @nestjs/platform-express
```

Docs
- API: ../docs/api.md
- Security/session policy: ../docs/security.md
- Jobs/events: ../docs/events.md
