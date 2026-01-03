---
stepsCompleted: [1, 2]
inputDocuments:
    - _bmad-output/planning-artifacts/prd.md
    - _bmad-output/architecture/solution-architecture.md
    - _bmad-output/ux/flows.md
    - _bmad-output/ux/wireframes.md
    - _bmad-output/ux/ia.md
    - _bmad-output/ux/component-inventory.md
    - _bmad-output/ux/personas.md
    - docs/api.md
    - docs/events.md
    - docs/security.md
---

# surveyor - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for surveyor, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Homeowner can access a survey session via unique link without authentication
FR2: System can initiate a new survey session when homeowner clicks link
FR3: System can track survey progress across multiple rooms
FR4: Homeowner can see which rooms have been completed and which remain
FR5: System can expire inactive sessions after defined timeout period
FR6: System can generate unique session identifiers for each survey
FR7: Homeowner can communicate with AI guide via voice input
FR8: AI guide can provide voice instructions and guidance throughout survey
FR9: Homeowner can interrupt AI guide to ask clarification questions
FR10: AI guide can respond to homeowner questions in real-time
FR11: System can display text captions of AI voice instructions for accessibility
FR12: Homeowner can manually switch to text-only mode at any time
FR13: System can detect when voice streaming is unavailable and automatically switch to text mode
FR14: System can request microphone permissions from homeowner's browser
FR15: Homeowner can capture photos using device camera through browser
FR16: System can access native device camera API for photo capture
FR17: AI can analyze photos in real-time to identify items and estimate properties
FR18: AI can detect photo quality issues (poor lighting, unclear angles, blurriness)
FR19: AI can request retake of photos that don't meet quality standards
FR20: AI can identify furniture, appliances, boxes, and household items from photos
FR21: AI can estimate item dimensions (width, depth, height) from photos
FR22: AI can estimate item weight based on visual analysis
FR23: AI can identify item material properties (wood, metal, fabric, etc.)
FR24: AI can calculate cubic feet (CFT) per item using 400N moving tariff standards
FR25: AI can perform Satisfactory Check validation before advancing to next room
FR26: AI can determine confidence level for each identified item
FR27: AI can prevent progression to next room until current room meets confidence threshold
FR28: AI can flag items with low confidence and add caveat notes
FR29: AI can prompt homeowner for additional photos when completeness is uncertain
FR30: AI can verify all major furniture items have been captured before room completion
FR31: Homeowner can review complete captured inventory before submission
FR32: Homeowner can add items that were missed during photo capture
FR33: Homeowner can remove items that were incorrectly identified
FR34: Homeowner can edit item details (name, quantity, description)
FR35: System can organize inventory by room/space for clarity
FR36: System can display item metadata (dimensions, weight, material, CFT) to homeowner during review
FR37: Homeowner can explicitly confirm submission to moving company
FR38: System can show end-of-session summary with item count and room count
FR39: System can generate professional PDF inventory document from captured survey data
FR40: System can overlay sequential ID numbers on photos using Supervision library
FR41: PDF can display numbered items with corresponding photos for visual verification
FR42: PDF can organize inventory by room/space with clear section headers
FR43: PDF can include detailed metadata per item (dimensions, weight, material, CFT, AI notes)
FR44: PDF can display total CFT calculations and summary statistics
FR45: PDF can include AI caveat notes for items flagged with low confidence
FR46: System can email completed PDF to moving company upon survey submission
FR47: Moving company staff can receive email notification when survey is completed
FR48: Moving company staff can access PDF inventory document via email
FR49: Moving company can provide unique survey links to their customers
FR50: System can associate survey session with specific moving company for delivery
FR51: Interface can display clearly on mobile devices (smartphones and tablets)
FR52: Interface can adapt to portrait and landscape orientations
FR53: Interface can meet WCAG 2.1 Level AA compliance standards
FR54: Homeowner can complete survey using keyboard navigation (no mouse required)
FR55: Screen readers can access all survey content and instructions
FR56: Interface can display with sufficient color contrast for visual accessibility
FR57: System can track session start vs. completion for abandonment analysis
FR58: System can handle network interruptions gracefully without data loss
FR59: System can detect and report Gemini API failures
FR60: System can monitor and log WebRTC connection quality metrics
FR61: AI can proactively prompt for commonly missed spaces (garage, attic, basement, storage shed, outdoor items) at end of survey
FR62: AI can verbally confirm no additional items exist in commonly overlooked areas before survey completion

### NonFunctional Requirements

NFR1: Time to Interactive (TTI) < 3s from link click to survey start
NFR2: Voice interaction latency < 500ms round-trip
NFR3: Photo upload time < 5s per photo on 4G mobile
NFR4: AI photo analysis/feedback completes within 2s per photo
NFR5: PDF generation completes within 30s for ≤200 items
NFR6: Session recovery restores state within 1s
NFR7: Platform uptime 99.999% excluding infra provider SLO
NFR8: Gracefully handle Gemini API failures without crashing sessions
NFR9: Detect/handle WebRTC/WebSocket failures without data loss
NFR10: Persist session state continuously to prevent loss during interruptions
NFR11: Log all errors with sufficient context for debugging/monitoring
NFR12: Persist session state to handle interruptions and allow seamless resume
NFR13: Monitor Gemini API health and response times
NFR14: Implement retries for transient Gemini failures (3 retries, exponential backoff)
NFR15: If Gemini unavailable >30s, display clear error with retry option
NFR16: Architecture supports fallback to alternative LLM providers
NFR17: All communication must use HTTPS
NFR18: Session IDs must be cryptographically secure (UUID v4 or equivalent)
NFR19: Photos/voice data retained indefinitely for ML and analysis (POC scope)
NFR20: No auth for POC; session URLs must be single-use or time-limited (24–48h)
NFR21: Rate limit API endpoints (e.g., 100 req/min/IP)
NFR22: Do not log/store unnecessary PII
NFR23: Strip EXIF data before PDF generation
NFR24: Validate moving company email addresses before sending PDFs
NFR25: Support 5 concurrent voice sessions (POC)
NFR26: Handle 100 survey sessions per week (POC)
NFR27: Photo storage for up to 50,000 photos during POC
NFR28: Scale to 100 concurrent voice sessions via infra changes only
NFR29: Handle 10× traffic increase with <10% performance degradation via horizontal scaling
NFR30: DB schema supports multi-tenancy without major restructuring (Phase 2)
NFR31: Separate survey engine from delivery mechanisms for future channels
NFR32: Store inventory data in structured format separate from PDF rendering
NFR33: Data model includes items/rooms/dimensions/weights/CFT mapped to CRM schemas
NFR34: Maintain separation between capture, storage, and presentation layers
NFR35: Internal APIs use consistent data models to enable export/integration
NFR36: Support adding export endpoints without refactoring core engine
NFR37: Future CRM integrations additive (<2 weeks), not a rebuild
NFR38: Meet WCAG 2.1 Level AA standards
NFR39: Color contrast ≥ 4.5:1 for text; ≥ 3:1 for UI components
NFR40: Full keyboard navigation for all functionality
NFR41: Screen readers can access all survey content and instructions
NFR42: Voice instructions have real-time text captions
NFR43: Text-only fallback provides equivalent experience
NFR44: Track/log key metrics: starts, completions, abandonment, average duration
NFR45: Monitor Gemini API costs per survey in real time
NFR46: Track WebRTC connection quality (latency, packet loss, disconnections)
NFR47: Log AI confidence scores and Satisfactory Check results
NFR48: Dashboard displays POC metrics (completion, accuracy, cost per survey)

### Additional Requirements

-   Frontend: Next.js (mobile-first) with conversational-first UI and Live Inventory Drawer
-   Backend: NestJS with HTTP controllers, WebSocket gateway, and BullMQ job processors
-   AI Orchestrator: LangChain v2026 orchestrates Gemini 1.5/2.0 (Conversational Clerk and Vision-to-Inventory chains) for Satisfactory Check, item extraction, dimensions/weight/material estimation, and CFT compute
-   Storage: Object storage (S3/R2) for originals and overlays; EXIF stripped before PDF
-   Data: Postgres for surveys, rooms, photos, items, PDFs, links, sessions, deliveries
-   Queues: Redis (BullMQ) for background jobs, retries, scheduling, DLQ, metrics
-   Integrations: Gemini for vision/voice, Supervision + PDF generator, SendGrid for email
-   Realtime: Heartbeats and inactivity timeouts; link TTL is redemption-only; active sessions not cut off at TTL
-   Observability: Metrics/logging for links, sessions, WS health, model latency/cost, jobs, PDF/email outcomes
-   Security: HTTPS everywhere; signed tokens/URLs; revocation and inactivity enforcement; privacy via EXIF stripping
-   Deployment: Next.js on Vercel; API/WS/jobs on Railway/Fly/Render/AWS; Redis Cloud/Upstash; Neon/Supabase; R2/S3 + CDN; SendGrid
-   References: Follow API contract (docs/api.md), events (docs/events.md), and security (docs/security.md)
-   UX flows: Welcome & Permissions → Conversation Workspace → Capture Pane → Live Inventory Drawer → Submit & Confirmation
-   Navigation: AI-driven primary flow with quick action chips; persistent header/footer with status, progress, connectivity, tips
-   Accessibility & resilience: Always-on captions; full keyboard operation; AA contrast; offline-friendly drawer; graceful fallback to text-only
-   UI components: HeroUI v2.8.7 atoms/molecules/organisms; use onPress; compound subcomponents; modals must trap focus
-   Content model: Session, Space, Item, Photo, Message entities with defined fields for implementation

### FR Coverage Map

### FR Coverage Map

FR1: Epic 1 - Access via secure unique link  
FR2: Epic 1 - Initiate new session on link open  
FR3: Epic 1 - Track progress across spaces  
FR4: Epic 1 - Show completed vs remaining rooms  
FR5: Epic 1 - Inactivity timeout for sessions  
FR6: Epic 1 - Generate unique session identifiers  
FR7: Epic 2 - Voice input to AI guide  
FR8: Epic 2 - AI voice guidance output  
FR9: Epic 2 - User can interrupt with questions  
FR10: Epic 2 - Real-time AI responses  
FR11: Epic 2 - Captions for voice instructions  
FR12: Epic 2 - Manual switch to text-only mode  
FR13: Epic 2 - Auto-fallback to text mode  
FR14: Epic 2 - Request mic permissions  
FR15: Epic 3 - Capture photos in browser  
FR16: Epic 3 - Access device camera API  
FR17: Epic 3 - Real-time AI item analysis  
FR18: Epic 3 - Detect photo quality issues  
FR19: Epic 3 - Retake requests on poor quality  
FR20: Epic 3 - Identify household items  
FR21: Epic 3 - Estimate item dimensions  
FR22: Epic 3 - Estimate item weight  
FR23: Epic 3 - Identify material properties  
FR24: Epic 3 - Compute CFT per 400N  
FR25: Epic 4 - Satisfactory Check gates  
FR26: Epic 4 - Item confidence scoring  
FR27: Epic 4 - Block next room until threshold  
FR28: Epic 4 - Flag low-confidence items  
FR29: Epic 4 - Prompt for additional photos  
FR30: Epic 4 - Verify major items before complete  
FR31: Epic 5 - Review captured inventory  
FR32: Epic 5 - Add missed items  
FR33: Epic 5 - Remove incorrect items  
FR34: Epic 5 - Edit item details  
FR35: Epic 5 - Organize by room/space  
FR36: Epic 5 - Show item metadata in review  
FR37: Epic 5 - Submit inventory to mover  
FR38: Epic 5 - Show end-of-session summary  
FR39: Epic 6 - Generate professional PDF  
FR40: Epic 6 - Numbered overlays on photos  
FR41: Epic 6 - PDF shows numbered items/photos  
FR42: Epic 6 - Room-organized sections  
FR43: Epic 6 - Detailed metadata in PDF  
FR44: Epic 6 - Total CFT and summaries  
FR45: Epic 6 - Include AI caveat notes  
FR46: Epic 7 - Email completed PDF  
FR47: Epic 7 - Staff notification on completion  
FR48: Epic 7 - Staff access to PDF  
FR49: Epic 7 - Company-specific survey links  
FR50: Epic 7 - Associate session with company  
FR51: Epic 2 - Mobile display clarity  
FR52: Epic 2 - Portrait/landscape support  
FR53: Epic 2 - WCAG 2.1 AA compliance  
FR54: Epic 2 - Full keyboard navigation  
FR55: Epic 2 - Screen reader support  
FR56: Epic 2 - Adequate color contrast  
FR57: Epic 8 - Track starts/completions (abandonment)  
FR58: Epic 8 - Graceful network interruption handling  
FR59: Epic 8 - Detect/report Gemini failures  
FR60: Epic 8 - Monitor WebRTC connection quality  
FR61: Epic 4 - Prompt for commonly missed spaces  
FR62: Epic 4 - Verbal confirmation for overlooked areas
FR63: Epic 9 - Company distribution link for customers  
FR64: Epic 9 - Lead form collects phone, email, name with validation  
FR65: Epic 9 - Generate unique survey link on submit  
FR66: Epic 9 - Send survey link via SMS (email fallback)  
FR67: Epic 9 - Show QR code on desktop confirmation for mobile handoff  
FR68: Epic 9 - Open survey link on mobile with contact pre-associated  
FR69: Epic 9 - Rate limiting and CAPTCHA on lead form  
FR70: Epic 9 - Country-aware phone validation with friendly errors  
FR71: Epic 9 - Consent/terms notice for messaging  
FR72: Epic 9 - Company-level SMS template/branding and QR config
FR73: Epic 3 - LangChain orchestrates all Gemini calls
FR74: Epic 3 - Vision-to-Inventory chain processes photo analysis
FR75: Epic 2 - Conversational Clerk chain manages dialog/interrupts
FR76: Epic 8 - Chain configuration via environment/config
FR77: Epic 8 - Chain telemetry: latency, token/cost, retries

## Epic List

### Epic 1: Access Link & Session Management

Homeowners can start a survey via secure link and complete it with reliable session lifecycle.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6

### Epic 2: Conversational Guidance (Voice/Text) with Accessibility

Voice-first guidance with captions and text fallback; fully accessible interaction model.
**FRs covered:** FR7, FR8, FR9, FR10, FR11, FR12, FR13, FR14, FR51, FR52, FR53, FR54, FR55, FR56

### Epic 3: Photo Capture & AI Item Analysis

Capture photos; AI extracts items, dimensions, weight, material, and CFT.
**FRs covered:** FR15, FR16, FR17, FR18, FR19, FR20, FR21, FR22, FR23, FR24

### Epic 4: Satisfactory Check & Completeness Assurance

Per-space confidence gates ensure completeness before progressing; missed spaces addressed.
**FRs covered:** FR25, FR26, FR27, FR28, FR29, FR30, FR61, FR62

### Epic 5: Inventory Review & Submission

Users review and edit inventory, then submit with a clear completion summary.
**FRs covered:** FR31, FR32, FR33, FR34, FR35, FR36, FR37, FR38

### Epic 6: PDF Generation with Numbered Overlays

Professional, room-organized PDF with numbered overlays and rich metadata.
**FRs covered:** FR39, FR40, FR41, FR42, FR43, FR44, FR45

### Epic 7: Delivery to Moving Company

Email delivery of the PDF; company association and staff access/notifications.
**FRs covered:** FR46, FR47, FR48, FR49, FR50

### Epic 8: Reliability & Observability

Operational resilience and visibility for the POC phase and beyond.
**FRs covered:** FR57, FR58, FR59, FR60

### Epic 9: Lead Capture & Mobile Handoff

Company public link collects contact info and delivers the survey link via SMS; desktop shows QR for phone handoff.
**FRs covered:** FR63, FR64, FR65, FR66, FR67, FR68, FR69, FR70, FR71, FR72

<!-- Repeat for each epic in epics_list (N = 1, 2, 3...) -->

## Epic {{N}}: {{epic_title_N}}

{{epic_goal_N}}

<!-- Repeat for each story (M = 1, 2, 3...) within epic N -->

### Story {{N}}.{{M}}: {{story_title_N_M}}

As a {{user_type}},
I want {{capability}},
So that {{value_benefit}}.

**Acceptance Criteria:**

<!-- for each AC on this story -->

**Given** {{precondition}}
**When** {{action}}
**Then** {{expected_outcome}}
**And** {{additional_criteria}}

<!-- End story repeat -->

## Epic 1: Access Link & Session Management

Homeowners can start a survey via secure link and complete it with a reliable session lifecycle.

### Story 1.1: Frontend shell scaffold (routes + screens)

As a homeowner,
I want a basic app shell with routes for Welcome, Conversation, Capture, Inventory, and Submit,
So that I can navigate the survey flow.

**Acceptance Criteria:**

**Given** the app runs locally  
**When** I navigate to `/welcome`  
**Then** I see a Welcome screen with a primary CTA and permission guidance

**Given** I visit `/conversation`, `/capture`, `/inventory`, or `/submit`  
**When** those routes load  
**Then** the corresponding skeleton screen renders with header/footer placeholders

**Given** a mobile viewport  
**When** I navigate between routes  
**Then** the header shows status placeholders and the footer shows voice/text controls placeholders with basic accessibility (labels, focus order)

### Story 1.2: Link redemption (stub against API)

As a homeowner,
I want to open a unique link and see the Welcome screen,
So that I can start a survey session.

**Acceptance Criteria:**

**Given** I open a URL like `/s/{token}`  
**When** the page loads  
**Then** I see the Welcome screen and the token is available in client state

**Given** an invalid token format  
**When** I open `/s/invalid_token!`  
**Then** I see a friendly error state with a way to retry or contact support

**And** an instrumentation event "link_opened" is recorded in client telemetry

### Story 1.3: Start session (frontend call + mock)

As a homeowner,
I want the app to request a session from the backend,
So that my progress can be tracked.

**Acceptance Criteria:**

**Given** I am on the Welcome screen with a valid token in state  
**When** I press "Get started"  
**Then** the app calls a redeem/start-session endpoint (mocked if backend unavailable) and stores a `sessionId` in client state

**Given** the endpoint returns an error  
**When** I press "Get started"  
**Then** I see an error banner with retry and the app does not crash

**And** loading states are visible during the request

### Story 1.4: Progress header chip and room counter (UI only)

As a homeowner,
I want to see progress (N/X spaces),
So that I know how far I’ve gotten.

**Acceptance Criteria:**

**Given** a mock list of spaces and completion states  
**When** I view any primary route  
**Then** the header chip shows `items count` and `N/X` spaces

**Given** I change a space status in mock state  
**When** the UI updates  
**Then** the header chip reflects the new counts immediately

**And** labels have accessible names for screen readers

### Story 1.5: Inactivity timeout messaging (UI behavior)

As a homeowner,
I want clear messaging if I’m idle,
So that I’m not surprised if the session expires.

**Acceptance Criteria:**

**Given** an idle timer is configured client-side (e.g., 5 minutes for demo)  
**When** there is no interaction for the threshold  
**Then** a banner appears explaining that inactivity may end the session, with a "Continue" action

**Given** I press "Continue"  
**When** the banner is shown  
**Then** the banner dismisses and the idle timer resets

## Epic 9: Lead Capture & Mobile Handoff

Company public link collects contact info and delivers the survey link via SMS; desktop shows QR for phone handoff.

### Story 9.1: Company distribution link route + Lead Form (UI)

As a prospective customer,
I want to open a moving company’s public link and see a simple lead form,
So that I can receive a survey link on my phone.

**Acceptance Criteria:**

**Given** I visit `/[companySlug]`  
**When** the page loads  
**Then** I see inputs for phone (required), email (optional/fallback), and name (required), a consent checkbox, and a primary submit button

**Given** invalid input formats  
**When** I attempt to submit  
**Then** inline validation errors appear and the form does not submit

**And** consent text is visible: “By submitting, you agree to receive a text message with your survey link.”

### Story 9.2: Lead submit API + Lead entity + survey link generation

As the system,
I want to accept lead submissions and generate a one-time survey link,
So that customers receive a unique link associated to their company.

**Acceptance Criteria:**

**Given** a valid lead form payload (companySlug, phone, name, optional email)  
**When** POST `/api/leads` is called  
**Then** a Lead is created, a unique survey link is generated, associated to the company, and the link is returned in the response

**Given** abuse patterns  
**When** many requests arrive  
**Then** rate limiting applies and CAPTCHA hooks are available (config flag)

**And** no PII is logged; telemetry masks sensitive fields

### Story 9.3: SMS send integration + delivery logging

As the system,
I want to send the survey link via SMS and track its status,
So that customers reliably receive the link on their phones.

**Acceptance Criteria:**

**Given** a generated survey link and phone number  
**When** the lead is accepted  
**Then** an `sms.send` job is enqueued and processed; provider status is recorded (queued/sent/delivered/failed) with retries/backoff

**Given** SMS sending fails  
**When** retries exhaust  
**Then** the failure is logged (masked), surfaced in metrics, and a fallback path is available (see 9.6)

### Story 9.4: Desktop confirmation page with QR code

As a prospective customer on desktop,
I want to see a QR code after submitting the form,
So that I can quickly open the survey link on my phone.

**Acceptance Criteria:**

**Given** I submitted the lead form on desktop  
**When** I land on `/[companySlug]/thanks`  
**Then** I see a QR code encoding the survey link, a “Copy link” button, and a “Open on phone” link

**And** the QR has an accessible text alternative with the URL

### Story 9.5: Validation + abuse protection

As the system,
I want country-aware validation and protections,
So that abuse is minimized and users get clear guidance.

**Acceptance Criteria:**

**Given** a US phone by default  
**When** number format is invalid  
**Then** the form shows a friendly validation message and blocks submit

**Given** repeated submissions  
**When** thresholds are exceeded  
**Then** rate limiting and (if enabled) CAPTCHA challenge apply

### Story 9.6: Email fallback if SMS fails (optional)

As a prospective customer who provided email,
I want to receive the survey link by email if SMS fails,
So that I can still proceed with the survey.

**Acceptance Criteria:**

**Given** SMS delivery fails after retries and email is present  
**When** fallback is enabled  
**Then** the system sends the survey link by email and records the outcome

## Epic 2: Conversational Guidance (Voice/Text) with Accessibility

Voice-first guidance with captions and text fallback; fully accessible interaction model.

### Story 2.1: Text Chat Interface Foundation

As a homeowner,  
I want to type messages to the AI guide and see our conversation history,  
So that I can communicate when voice is unavailable or I prefer text.

**Acceptance Criteria:**

**Given** I'm on the Conversation page  
**When** the interface loads  
**Then** I see a message history area and a text input field with a send button

**Given** I type a message and press Send (or Enter)  
**When** the message is sent  
**Then** my message appears in the conversation history and the AI response follows

**Given** the conversation progresses  
**When** multiple messages are exchanged  
**Then** all messages display in chronological order with clear sender identification (User vs. AI)

**Given** long conversations  
**When** many messages accumulate  
**Then** the message area scrolls and auto-scrolls to the latest message

**Given** I'm using keyboard only  
**When** I navigate the chat interface  
**Then** the input field is focusable and Enter sends the message (Shift+Enter for newline)

### Story 2.2: AI voice output with captions and voice toggle

As a homeowner,  
I want AI voice responses with captions and a voice toggle,  
So that I can follow guidance in my preferred modality.

**Acceptance Criteria:**

**Given** the assistant produces a response  
**When** voice is enabled  
**Then** audio plays and real-time captions render in the Conversation Pane

**Given** I toggle voice off  
**When** the next message arrives  
**Then** only captions/text render; audio is suppressed and the toggle state persists for the session

### Story 2.3: Microphone permission + voice input capture

As a homeowner,  
I want to grant microphone access and speak to the assistant,  
So that I can interact hands-free.

**Acceptance Criteria:**

**Given** no mic permission yet  
**When** I press "Enable voice"  
**Then** the browser permission prompt appears and the app handles allow/deny with clear messaging

**Given** permission is granted  
**When** I speak  
**Then** the input stream is captured and routed to the conversation engine; errors are surfaced gracefully with retry

### Story 2.4: Text-only mode and auto-fallback

As a homeowner,  
I want to switch to text-only or auto-fallback when voice is unavailable,  
So that I can continue without interruption.

**Acceptance Criteria:**

**Given** I manually select text-only mode  
**When** I continue the survey  
**Then** the UI indicates text-only mode and no voice is attempted until I switch back

**Given** voice infrastructure is unavailable  
**When** a response would play  
**Then** the system automatically falls back to text-only and shows a banner; I can revert when voice recovers

### Story 2.5: Interrupt-and-ask with real-time responses

As a homeowner,  
I want to interrupt guidance to ask a question,  
So that I can clarify and resume smoothly.

**Acceptance Criteria:**

**Given** the assistant is guiding  
**When** I ask a question via voice or text  
**Then** the assistant answers promptly; the guidance resumes (or is rescheduled) without losing context

**And** the Conversational Clerk chain (LangChain v2026) processes interruptions and responses

### Story 2.6: Accessibility compliance (WCAG AA)

As an accessibility-focused user,  
I want the conversation UI to meet WCAG 2.1 AA,  
So that I can use it with assistive tech.

**Acceptance Criteria:**

**Given** keyboard-only navigation  
**When** I operate the app  
**Then** all functions are reachable; focus order is logical; visible focus is present

**Given** a screen reader  
**When** I navigate content  
**Then** roles/labels are accurate; captions are exposed to AT; color contrast meets AA

### Story 2.7: Mobile clarity and orientation support

As a homeowner on mobile,  
I want layouts that work in portrait and landscape,  
So that I can comfortably use the app on my phone.

**Acceptance Criteria:**

**Given** small screens  
**When** I rotate the device  
**Then** content remains usable; touch targets meet minimum sizes; no layout overflow blocks content

## Epic 3: Photo Capture & AI Item Analysis

Capture photos; AI extracts items, dimensions, weight, material, and CFT.

### Story 3.1: Camera access and capture UI (with file fallback)

As a homeowner,  
I want to capture photos of my items,  
So that the AI can analyze them for the inventory.

**Acceptance Criteria:**

**Given** a supported mobile device  
**When** I open the Capture Pane  
**Then** the app requests camera access via getUserMedia and shows a live preview with a capture control

**Given** an unsupported browser or denied permission  
**When** I open the Capture Pane  
**Then** I can use a file input fallback (`accept=image/*` with `capture=environment`) to upload a photo

**And** after capture/upload, I see a thumbnail preview and can retake before upload

### Story 3.2: Upload API and storage of originals

As the system,  
I want to upload photos to storage,  
So that originals are preserved for analysis and overlays.

**Acceptance Criteria:**

**Given** a captured photo  
**When** I press “Upload”  
**Then** the app calls `POST /api/surveys/:id/photos` and receives an id/storage URL; progress, cancel, and retry are supported

**And** EXIF data is stripped server-side; large files are handled within configured limits with clear error states

### Story 3.3: AI analysis: item detection and properties

As the system,  
I want to analyze uploaded photos,  
So that I can extract items and their properties.

**Acceptance Criteria:**

**Given** an uploaded photo id  
**When** analysis runs  
**Then** the result includes items with labels, estimated dimensions, weight, and material; results are stored and associated to the survey/session

**And** transient errors use retries/backoff; failures surface a non-blocking error with a retry affordance; analysis is implemented via the Vision-to-Inventory chain (LangChain v2026)

### Story 3.4: Photo quality scoring and retake prompts

As a homeowner,  
I want guidance when a photo is low quality,  
So that I can retake and proceed confidently.

**Acceptance Criteria:**

**Given** a captured/uploaded photo  
**When** quality score is below the threshold  
**Then** the UI shows actionable tips (lighting, angle, distance) and a “Retake” action; retake replaces the prior image

**And** when quality meets threshold, I can accept and move forward

### Story 3.5: CFT calculation per 400N tariff

As the system,  
I want to compute CFT for each identified item,  
So that the PDF and quote reflect standard moving tariffs.

**Acceptance Criteria:**

**Given** item dimensions (width, depth, height)  
**When** CFT is computed  
**Then** each item has a CFT value and totals are available; calculations are auditable and unit-tested for common furniture examples

## Epic 4: Satisfactory Check & Completeness Assurance

Per-space confidence gates ensure completeness before progressing; missed spaces addressed.

### Story 4.1: Per-space Satisfactory thresholds and rules

As the system,  
I want configurable per-space thresholds,  
So that completeness is measured consistently.

**Acceptance Criteria:**

**Given** default POC thresholds  
**When** a space is evaluated  
**Then** coverage and critical-item rules are applied and persisted with the space state

**And** thresholds are configurable via server config and surfaced in telemetry

### Story 4.2: Confidence scoring and caveat notes per item

As the system,  
I want confidence scores and caveat notes,  
So that uncertainty is transparent to users and reviewers.

**Acceptance Criteria:**

**Given** analyzed items  
**When** results are stored  
**Then** each item includes a confidence value and optional caveat notes; low-confidence items are flagged

**And** these flags are visible in review and available for the PDF later

### Story 4.3: Block next-space until threshold met

As a homeowner,  
I want to be prevented from advancing when a space is incomplete,  
So that I don’t skip important items.

**Acceptance Criteria:**

**Given** a space below threshold  
**When** I try to continue  
**Then** the UI blocks progression and shows an unmet-requirements checklist

**And** no override is provided in the POC

### Story 4.4: Retake/additional-photo prompts with actionable tips

As a homeowner,  
I want clear prompts when more photos are needed,  
So that I can fix issues quickly.

**Acceptance Criteria:**

**Given** quality or completeness gaps  
**When** guidance is presented  
**Then** I see specific tips (lighting/angle/distance) and can “Retake” or “Add photo”; replacing updates state immediately

### Story 4.5: Verify major items captured before completion

As the system,  
I want to verify critical items per room,  
So that high-impact misses are avoided.

**Acceptance Criteria:**

**Given** a room-specific critical list (e.g., sofa/bed/fridge)  
**When** the space approaches completion  
**Then** missing critical items are flagged and I’m prompted to add them quickly

### Story 4.6: Missed spaces prompts and verbal confirmation at end

As a homeowner,  
I want a final check for commonly missed spaces,  
So that I can confirm everything was captured.

**Acceptance Criteria:**

**Given** I reach end-of-survey  
**When** finalization starts  
**Then** I’m prompted for garage/attic/basement/outdoor/storage and asked to verbally confirm no additional items

## Epic 5: Inventory Review & Submission

Users review and edit inventory, then submit with a clear completion summary.

### Story 5.1: Review screen lists items by space with metadata

As a homeowner,  
I want to review items grouped by space with key details,  
So that I can verify accuracy before submitting.

**Acceptance Criteria:**

**Given** captured items with metadata  
**When** I open the Review screen  
**Then** items are grouped by space and show dimensions, weight, material, CFT, confidence, and caveats; empty states are handled

### Story 5.2: Edit item details (inline or modal)

As a homeowner,  
I want to edit item details,  
So that I can correct mistakes before submission.

**Acceptance Criteria:**

**Given** an item in the review list  
**When** I choose Edit  
**Then** I can modify name, quantity, and notes with validation; changes reflect immediately in the list

### Story 5.3: Remove incorrect items with undo

As a homeowner,  
I want to remove incorrect items safely,  
So that I can fix errors without losing progress.

**Acceptance Criteria:**

**Given** an item marked incorrect  
**When** I choose Remove  
**Then** I see a confirmation/undo; on confirm the item is removed and persists across navigation

### Story 5.4: Add missed item manually

As a homeowner,  
I want to add a missed item,  
So that the inventory is complete.

**Acceptance Criteria:**

**Given** I’m on the Review screen  
**When** I choose Add item  
**Then** a form lets me add name, quantity, and optional notes; the item is inserted into the current space with accessible controls

### Story 5.5: Submission confirmation and send

As a homeowner,  
I want to explicitly submit my inventory,  
So that the mover receives my survey.

**Acceptance Criteria:**

**Given** I’m satisfied with the review  
**When** I press “Send to mover”  
**Then** submission is confirmed; on success I see a completion summary; on error I see retry guidance without losing data

### Story 5.6: Summary panel with totals

As a homeowner,  
I want to see overall totals,  
So that I understand what I’m submitting.

**Acceptance Criteria:**

**Given** items across spaces  
**When** I open the Summary panel  
**Then** it shows item count and room count and remains visible pre- and post-submit

## Epic 6: PDF Generation with Numbered Overlays

Professional, room-organized PDF with numbered overlays and rich metadata.

### Story 6.1: PDF assembly pipeline (baseline doc)

As the system,  
I want to assemble a single PDF from survey data,  
So that moving companies receive a professional document.

**Acceptance Criteria:**

**Given** completed survey data  
**When** PDF generation runs  
**Then** a single PDF is produced with a persistent storage URL/id; repeated runs are deterministic in ordering

### Story 6.2: Numbered overlays with Supervision

As the system,  
I want to overlay index annotations on photos,  
So that items map to visual evidence.

**Acceptance Criteria:**

**Given** photo assets and item indices  
**When** overlays are rendered  
**Then** numbered annotations align with the items list; if overlay fails, a fallback page renders without overlays and error is logged

### Story 6.3: Room-organized layout

As a moving coordinator,  
I want room-organized sections,  
So that I can review efficiently.

**Acceptance Criteria:**

**Given** items grouped by space  
**When** the PDF is rendered  
**Then** each room has a section with a header; optional table of contents is included; pagination is consistent across runs

### Story 6.4: Item metadata rendering

As a moving coordinator,  
I want detailed item metadata in the PDF,  
So that I can price accurately.

**Acceptance Criteria:**

**Given** item properties (dimensions, weight, material, CFT, confidence, caveats)  
**When** the PDF is rendered  
**Then** each item shows its metadata clearly next to its number

### Story 6.5: Totals and summaries

As a moving coordinator,  
I want totals and summaries,  
So that I see volume at a glance.

**Acceptance Criteria:**

**Given** computed CFT and counts  
**When** the PDF is rendered  
**Then** totals per room and overall CFT appear; a summary page shows counts and key notes

### Story 6.6: Visual QA and size optimization

As the system owner,  
I want visual QA and size targets,  
So that PDFs look good and remain small.

**Acceptance Criteria:**

**Given** generated PDFs  
**When** size thresholds are checked  
**Then** PDFs meet target size limits where practical; large surveys degrade gracefully (e.g., image compression) and margins/images are visually checked for alignment

## Epic 7: Delivery to Moving Company

Email delivery of the PDF; company association and staff access/notifications.

### Story 7.1: Email delivery pipeline

As the system,  
I want to email the generated PDF to the moving company,  
So that staff receives the survey output reliably.

**Acceptance Criteria:**

**Given** a completed survey with PDF URL  
**When** delivery runs  
**Then** an email is sent to the company recipient; a delivery record is stored with timestamp, recipient, and status; retries are idempotent

### Story 7.2: Notification template and branding (POC-level)

As the system owner,  
I want a basic email template with minimal branding,  
So that recipients get clear context.

**Acceptance Criteria:**

**Given** survey/customer metadata  
**When** the email is composed  
**Then** subject/body include customer name and survey stats and a link to the PDF; basic branding applied per POC scope

### Story 7.3: Secure PDF access link

As a moving coordinator,  
I want a secure link to open the PDF,  
So that access is easy and safe.

**Acceptance Criteria:**

**Given** a PDF in storage  
**When** a link is generated  
**Then** it is a signed URL with TTL; access is logged; when expired, a clear error is shown

### Story 7.4: Associate survey with company

As the system,  
I want surveys associated with a company,  
So that deliveries and queries are scoped correctly.

**Acceptance Criteria:**

**Given** survey creation  
**When** records are persisted  
**Then** survey rows include companyId; delivery rows reference companyId; queries filter by company

### Story 7.5: Company-provided customer links

As a moving company,  
I want to generate customer survey links,  
So that I can distribute them to clients.

**Acceptance Criteria:**

**Given** a company context  
**When** a link is requested  
**Then** a unique customer survey link is generated and recorded with an audit trail of issued links

### Story 7.6: Delivery failure handling and retries

As the system,  
I want robust delivery retries and monitoring,  
So that failures are visible and recoverable.

**Acceptance Criteria:**

**Given** transient email provider failures  
**When** delivery runs  
**Then** retries with backoff occur; final failures are surfaced in metrics/logs with operator notes; no duplicate emails on retried success

## Epic 8: Reliability & Observability

Operational resilience and visibility for the POC phase and beyond.

### Story 8.1: Session metrics (starts, completions, abandonment)

As an operator,  
I want visibility into session outcomes,  
So that I can track health and improve completion rates.

**Acceptance Criteria:**

**Given** survey sessions  
**When** users start, complete, or abandon  
**Then** counters/timers are emitted for starts, completions, and abandonment; a dashboard tile visualizes these metrics

### Story 8.2: Network interruption handling (retry/queue)

As a homeowner,  
I want the app to handle poor connectivity,  
So that my progress isn’t lost.

**Acceptance Criteria:**

**Given** transient connectivity drops  
**When** actions or uploads are pending  
**Then** the client queues work, retries with backoff, shows user-visible status, and prevents data loss on recovery

### Story 8.3: Gemini failure detection and user messaging

As a homeowner,  
I want clear messaging when AI is temporarily unavailable,  
So that I know what to do.

**Acceptance Criteria:**

**Given** provider errors from Gemini  
**When** failures occur  
**Then** errors are classified by taxonomy; retries are attempted; a fallback banner informs the user and events are logged for analysis

### Story 8.4: WebRTC/WebSocket health and reconnection

As the system,  
I want robust realtime connection management,  
So that the conversation remains stable.

**Acceptance Criteria:**

**Given** active sessions  
**When** heartbeats/close codes signal issues  
**Then** auto-reconnect is attempted; latency and packet loss are recorded; reconnection outcomes are logged

### Story 8.5: LangChain chain telemetry

As an operator,  
I want telemetry for LangChain chains,  
So that I can monitor cost and latency.

**Acceptance Criteria:**

**Given** Conversational Clerk and Vision-to-Inventory chains  
**When** they execute  
**Then** per-chain metrics (latency, token/cost, retries, errors) are emitted with configurable sampling and shown on the dashboard

### Story 8.6: Alerting thresholds

As an operator,  
I want actionable alerts,  
So that I can respond to issues quickly.

**Acceptance Criteria:**

**Given** thresholds for abandonment spike, reconnect failure rate, Gemini error surge, and chain latency/cost anomalies  
**When** thresholds are breached  
**Then** alerts trigger with clear descriptions and links to relevant dashboards
