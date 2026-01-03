# Story 1.3: Start session (frontend call + mock)

**Status:** ready-for-dev  
**Epic:** 1 - Access Link & Session Management  
**Story ID:** 1.3  
**File:** `1-3-start-session-frontend-call-mock.md`

---

## Story

As a homeowner,  
I want the app to request a session from the backend,  
So that my progress can be tracked.

---

## Acceptance Criteria

1. **Given** I am on the Welcome screen with a valid token in state  
   **When** I press "Get started"  
   **Then** the app calls a redeem/start-session endpoint (mocked if backend unavailable) and stores a `sessionId` in client state

2. **Given** the endpoint returns an error  
   **When** I press "Get started"  
   **Then** I see an error banner with retry and the app does not crash

3. **And** loading states are visible during the request

---

## Context & Background

### Epic Context
This story is part of **Epic 1: Access Link & Session Management**, which enables homeowners to start a survey via secure link and complete it with reliable session lifecycle. This story specifically handles the session initiation after the homeowner has already arrived via the link (Story 1.2).

### Position in Flow
- **Prerequisite:** Story 1.2 (Link redemption) is complete - the `linkToken` is already stored in `LinkTokenContext`
- **Current scope:** Call backend to redeem token and receive `sessionId`
- **Next story:** Story 1.4 will use the `sessionId` to display progress information

### Business Value
Session tracking is fundamental to:
- Preventing duplicate surveys from the same link
- Persisting homeowner progress across network interruptions
- Associating captured photos/items with the correct survey
- Enabling backend completion workflows (PDF generation, email delivery)

---

## Requirements Mapping

- **FR2:** System can initiate a new survey session when homeowner clicks link
- **FR5:** Handling error states cleanly supports resilience goals
- **FR6:** System can generate unique session identifiers for each survey
- **NFR1:** Time to Interactive (TTI) < 3s from link click to survey start
- **NFR58:** System can handle network interruptions gracefully without data loss

---

## Technical Requirements

### 1. API Client Implementation

**Module Location:** `surveyor-frontend/lib/api-client.ts` (new file)

**Function Signature:**
```typescript
export async function startSession(params: {
  token: string;
}): Promise<{ sessionId: string }>;
```

**Implementation Requirements:**
- Use native `fetch` API (no external HTTP client needed for POC)
- Base URL from environment variable `NEXT_PUBLIC_API_BASE_URL` (default: `http://localhost:3000`)
- Endpoint: `POST /api/sessions/start`
- Request headers:
  - `Content-Type: application/json`
- Request body: `{ token: string }`
- Response handling:
  - **200 OK:** Parse `{ sessionId: string }` from response body
  - **400 Bad Request:** Throw error with `INVALID_TOKEN` code
  - **410 Gone:** Throw error with `TOKEN_EXPIRED` code  
  - **429 Too Many Requests:** Throw error with `RATE_LIMITED` code
  - **5xx Server Error:** Throw error with `SERVER_ERROR` code
- Timeout: 10 seconds (configurable via `API_TIMEOUT_MS` env var)
- Error structure:
  ```typescript
  interface ApiError extends Error {
    code: 'INVALID_TOKEN' | 'TOKEN_EXPIRED' | 'RATE_LIMITED' | 'SERVER_ERROR' | 'NETWORK_ERROR';
    status?: number;
  }
  ```

### 2. Mock Mode Implementation

**Feature Flag:** `feature.mockSessionStart` (boolean, default: `false`)

**Mock Behavior:**
- When enabled, bypass network call entirely
- Generate pseudo-UUID using `crypto.randomUUID()` (available in modern browsers)
- Simulate realistic delay: 300-800ms random (use `setTimeout`)
- Return `{ sessionId: <generated-uuid> }`
- Log to console in development: `[MOCK] Session started with sessionId: ${id}`
- Never log tokens in production

**Configuration Location:** `surveyor-frontend/lib/feature-flags.ts` (extend existing)

### 3. Session State Management

**Context Location:** `surveyor-frontend/context/SessionContext.tsx` (new file)

**State Shape:**
```typescript
interface SessionState {
  sessionId: string | null;
  sessionStatus: 'idle' | 'loading' | 'ready' | 'error';
  sessionErrorCode?: string;
}
```

**Required Hooks:**
```typescript
// Get current session state
export function useSession(): SessionState;

// Trigger session start
export function useStartSession(): {
  startSession: (token: string) => Promise<void>;
  reset: () => void;
};
```

**Persistence Requirements:**
- Store `sessionId` in `sessionStorage` to survive page refreshes (follow Story 1.2 pattern)
- Key: `surveyor:sessionId`
- Clear on explicit reset only (not on page navigation)
- Load from storage on context mount

**Integration:** Add `SessionProvider` to `surveyor-frontend/app/Providers.tsx` (alongside existing `LinkTokenProvider`)

### 4. Welcome Screen Integration

**File to Modify:** `surveyor-frontend/app/welcome/page.tsx`

**Implementation Steps:**
1. Import hooks: `useLinkToken()`, `useSession()`, `useStartSession()`
2. Modify "Get started" button:
   - **Disabled state:** When `sessionStatus === 'loading'`
   - **Loading indicator:** Show spinner/loading text when loading
   - **Click handler:** Call `startSession(linkToken)` with token from context
3. Success handling:
   - On successful session start, optionally navigate to `/conversation` (configurable via `NEXT_PUBLIC_START_SESSION_NAVIGATE` env var, default: `true`)
   - Navigation should use Next.js router (`useRouter().push('/conversation')`)
4. Error handling:
   - Render error banner when `sessionStatus === 'error'`
   - Banner requirements:
     - `role="alert"` for screen reader announcement
     - Display user-friendly error message based on `sessionErrorCode`:
       - `INVALID_TOKEN`: "This link is invalid. Please check your link and try again."
       - `TOKEN_EXPIRED`: "This link has expired. Please request a new survey link."
       - `RATE_LIMITED`: "Too many attempts. Please wait a moment and try again."
       - `SERVER_ERROR` / `NETWORK_ERROR`: "Unable to connect. Please check your connection and try again."
     - Include "Retry" button that calls `startSession()` again
     - Include "Go Home" button as secondary action
   - Error banner should receive focus when it appears

**Accessibility Requirements:**
- Button must have `aria-busy="true"` when loading
- Loading state must be announced (update button text to "Starting session..." or use `aria-live`)
- Error banner must be focusable and announced immediately
- Maintain logical focus flow: button → error banner → retry button

### 5. Telemetry Events

**File to Modify:** `surveyor-frontend/lib/telemetry.ts` (extend existing)

**New Events:**
```typescript
// 1. Session start request
emitEvent('session_start_request', {
  token_preview: maskToken(token), // Use existing maskToken function
  timestamp: Date.now()
});

// 2. Session start success
emitEvent('session_start_success', {
  sessionId_length: sessionId.length, // Length only, never log full ID
  duration_ms: duration,
  timestamp: Date.now()
});

// 3. Session start failure
emitEvent('session_start_failure', {
  error_code: errorCode,
  error_message: sanitizedMessage, // Remove PII/tokens
  duration_ms: duration,
  timestamp: Date.now()
});
```

**PII Masking Rules:**
- Never log full `sessionId` - only length or first 6 chars + length
- Use existing `maskToken()` function from Story 1.2 for token preview
- Sanitize error messages to remove tokens/IDs before logging

---

## Architecture Compliance

### 1. Follow Established Patterns from Stories 1.1 & 1.2

**State Management:**
- Use React Context pattern (established in Story 1.2 with `LinkTokenContext`)
- Provider wraps app in `Providers.tsx`
- Export typed hooks for consuming components
- Include sessionStorage persistence (established in Story 1.2 code review)

**Feature Flags:**
- Extend existing `surveyor-frontend/lib/feature-flags.ts`
- Add `mockSessionStart: boolean`
- Support `window.__FEATURE_FLAGS__` override for testing (established in Story 1.2)

**Telemetry:**
- Extend existing `surveyor-frontend/lib/telemetry.ts`
- Use existing `maskToken()` helper for PII masking
- Follow same event structure as `link_opened` from Story 1.2

**Error Handling:**
- Follow Story 1.2 pattern for friendly error UI
- Include primary and secondary actions ("Retry" + "Go Home")
- Maintain accessibility with `role="alert"` and focus management

### 2. Next.js App Router Conventions

- Use server components by default, client components only when needed
- Mark interactive components with `'use client'` directive
- Context providers must be client components
- Page components can remain server components if they don't use hooks directly
- Follow existing file structure: `app/`, `components/`, `lib/`, `context/`

### 3. TypeScript Strict Mode

- All functions must have explicit return types
- No `any` types - use proper interfaces or `unknown`
- Props interfaces must be exported for reusability
- Error types must be properly typed (extend `Error` interface)

### 4. Backend API Contract (from Architecture)

Per `docs/api.md` (referenced in architecture):
- **Endpoint:** `POST /api/sessions/start`
- **NestJS Module:** `SessionModule` (controller + service)
- **Expected in future:** Backend validates token signature, checks expiry, marks token as redeemed
- **POC behavior:** In POC phase, backend may not exist yet - mock mode is critical

---

## Project Structure Requirements

### New Files to Create

```
surveyor-frontend/
├── lib/
│   └── api-client.ts           # NEW: HTTP client for session start
├── context/
│   └── SessionContext.tsx      # NEW: Session state management
└── __tests__/
    ├── api-client.spec.ts      # NEW: API client tests
    ├── session-context.spec.tsx # NEW: Context tests
    └── session-start.spec.tsx   # NEW: Integration tests
```

### Files to Modify

```
surveyor-frontend/
├── app/
│   ├── Providers.tsx           # ADD: SessionProvider wrapper
│   └── welcome/
│       └── page.tsx            # MODIFY: Wire session start button
├── lib/
│   ├── feature-flags.ts        # ADD: mockSessionStart flag
│   └── telemetry.ts            # ADD: Session telemetry events
└── __tests__/
    └── routes.spec.tsx         # UPDATE: Add session mocks
```

---

## Testing Requirements

### Unit Tests

**File:** `surveyor-frontend/__tests__/api-client.spec.ts`

Test cases:
1. `startSession()` success path returns `sessionId`
2. `startSession()` maps 400 → `INVALID_TOKEN` error
3. `startSession()` maps 410 → `TOKEN_EXPIRED` error
4. `startSession()` maps 429 → `RATE_LIMITED` error
5. `startSession()` maps 5xx → `SERVER_ERROR` error
6. `startSession()` handles network errors → `NETWORK_ERROR`
7. `startSession()` times out after configured duration
8. Mock mode bypasses network and returns pseudo UUID
9. Mock mode respects delay range

**File:** `surveyor-frontend/__tests__/session-context.spec.tsx`

Test cases:
1. `useSession()` returns initial idle state
2. `startSession()` transitions to loading → ready on success
3. `startSession()` transitions to loading → error on failure
4. `sessionId` persists to sessionStorage on success
5. `sessionId` loads from sessionStorage on mount
6. `reset()` clears state and sessionStorage
7. Multiple calls to `startSession()` are prevented during loading

### Integration Tests

**File:** `surveyor-frontend/__tests__/session-start.spec.tsx`

Test cases:
1. Welcome CTA triggers session start with token from context
2. Button shows loading state during request (disabled + spinner)
3. Success navigates to `/conversation` and stores `sessionId`
4. Failure shows error banner with appropriate message
5. Retry button in error banner re-attempts session start
6. Error banner receives focus when displayed
7. Navigation skipped when `NEXT_PUBLIC_START_SESSION_NAVIGATE=false`
8. Mock mode/feature flag removed for MVP; only real API path is validated

### Accessibility Tests

Within integration tests, verify:
1. Button has `aria-busy="true"` during loading
2. Loading state is announced (button text or aria-live)
3. Error banner has `role="alert"`
4. Error banner receives focus on appearance
5. Retry button is keyboard accessible
6. Focus flow: button → error (if shown) → retry/actions

---

## Environment Variables

Add to `.env.local` (document in README):

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
API_TIMEOUT_MS=10000

# Behavior Configuration
NEXT_PUBLIC_START_SESSION_NAVIGATE=true
```

**Note:** Prefix with `NEXT_PUBLIC_` for client-side access in Next.js. Feature flags were removed for MVP; no flag-related env vars are required.

---

## Definition of Done

- [ ] All acceptance criteria pass locally with and without mock mode
- [ ] API client implemented with proper error mapping
- [ ] Session context provides `sessionId` and status to consumers
- [ ] Welcome screen wires "Get started" button correctly
- [ ] Error banner displays user-friendly messages with retry
- [ ] Loading states visible and accessible (aria-busy, focus)
- [ ] Telemetry events fire with masked tokens and safe payloads
- [ ] All unit tests passing (API client + context)
- [ ] All integration tests passing (Welcome flow)
- [ ] Accessibility checks pass (roles, focus, announcements)
- [ ] Code follows TypeScript strict mode (no `any`, explicit types)
- [ ] sessionStorage persistence working (survives refresh)
- [ ] Code reviewed and merged

---

## Tasks / Subtasks

- [x] **Task 1:** Implement API client (AC: #1, #2, #3)
  - [x] Create `lib/api-client.ts` with `startSession()` function
  - [x] Implement error mapping for all response codes
  - [x] Add timeout handling
  - [x] Write unit tests for success/error paths

- [x] **Task 2:** Implement mock mode (AC: #1)
  - [x] Add `mockSessionStart` feature flag to `lib/feature-flags.ts`
  - [x] Implement pseudo-UUID generation with delay
  - [x] Add development logging (no production logs)
  - [x] Write unit tests for mock behavior

- [x] **Task 3:** Create session context (AC: #1, #3)
  - [x] Create `context/SessionContext.tsx`
  - [x] Implement state shape: `sessionId`, `sessionStatus`, `errorCode`
  - [x] Implement `useSession()` and `useStartSession()` hooks
  - [x] Add sessionStorage persistence (load on mount, save on success)
  - [x] Write unit tests for state transitions and persistence

- [x] **Task 4:** Wire Welcome screen (AC: #1, #2, #3)
  - [x] Modify `app/welcome/page.tsx` to use session hooks
  - [x] Update "Get started" button: loading state, disabled state, click handler
  - [x] Implement success navigation (configurable)
  - [x] Implement error banner with retry and "Go Home"
  - [x] Add accessibility attributes (aria-busy, role="alert", focus)

- [x] **Task 5:** Add telemetry events (AC: #1, #2)
  - [x] Extend `lib/telemetry.ts` with session events
  - [x] Emit `session_start_request` with masked token
  - [x] Emit `session_start_success` with sessionId length only
  - [x] Emit `session_start_failure` with sanitized error
  - [x] Write unit tests for event emission and PII masking

- [x] **Task 6:** Write integration tests (AC: #1, #2, #3)
  - [x] Create `__tests__/session-start.spec.tsx`
  - [x] Test loading → success → navigation flow
  - [x] Test loading → error → retry flow
  - [x] Test mock mode (no network calls)
  - [x] Test accessibility (focus, roles, announcements)
  - [x] Update existing route tests with session mocks

- [x] **Task 7:** Integration and polish
  - [x] Add `SessionProvider` to `app/Providers.tsx`
  - [x] Update existing tests to provide session context mocks
  - [x] Test feature flag toggle (mock on/off)
  - [x] Verify sessionStorage behavior across refresh
  - [x] Document environment variables in README

---

## Dev Notes

### Architecture Patterns Established

**From Story 1.1:**
- Next.js App Router with `/app` directory structure
- Shared `AppLayout` component with header/footer
- Mobile-first responsive design
- Vitest + React Testing Library for testing

**From Story 1.2:**
- React Context for global state (no Redux/Zustand needed)
- sessionStorage persistence pattern (survive refresh)
- `useRef` guard to prevent duplicate effects (race condition fix)
- Feature flag system with `window.__FEATURE_FLAGS__` override
- Telemetry with PII masking (`maskToken` utility)
- Friendly error UI with primary/secondary actions
- Token validation: 8-256 chars, alphanumeric + dashes/underscores

### Key Implementation Notes

1. **Mock Mode is Critical:** Backend may not exist during initial POC development. Mock mode must work flawlessly to unblock frontend progress.

2. **sessionStorage Pattern:** Follow Story 1.2's approach - load on mount, save on success, use consistent key format (`surveyor:sessionId`).

3. **Error Taxonomy:** Match backend error codes exactly:
   - `400` → `INVALID_TOKEN`
   - `410` → `TOKEN_EXPIRED`
   - `429` → `RATE_LIMITED`
   - `5xx` → `SERVER_ERROR`
   - Network failure → `NETWORK_ERROR`

4. **No Retry Logic in API Client:** Keep API client simple. Retry is user-initiated via UI button, not automatic. This prevents unwanted duplicate session creation.

5. **Navigation is Configurable:** Not all deployments may want auto-navigation to `/conversation`. Make it configurable via env var.

6. **Loading State Must Be Obvious:** Disable button, show spinner, change text. Loading should be unmistakable to prevent user confusion/double-clicks.

7. **Token Security:** Never log full tokens or sessionIds. Always mask in telemetry and console output.

### Integration with Story 1.2

Story 1.2 provides the `linkToken` via `LinkTokenContext`. This story consumes that token:

```typescript
const { token } = useLinkToken();
const { startSession } = useStartSession();

const handleStart = async () => {
  if (!token) return; // Should never happen due to Welcome protection
  await startSession(token);
};
```

### Session Lifecycle

```
1. User opens /s/{token} (Story 1.2)
   ↓
2. Token stored in LinkTokenContext + sessionStorage
   ↓
3. Navigate to /welcome
   ↓
4. User clicks "Get started" (Story 1.3 starts here)
   ↓
5. Call POST /api/sessions/start with token
   ↓
6. Backend validates token, creates session, returns sessionId
   ↓
7. Store sessionId in SessionContext + sessionStorage
   ↓
8. Emit telemetry: session_start_success
   ↓
9. Navigate to /conversation (Story 1.4+)
```

### Expected Backend Behavior (Future)

Per architecture:
- Backend validates token signature
- Checks token not expired (based on `validUntil` timestamp)
- Marks token as redeemed (prevents reuse)
- Creates session record in Postgres
- Returns `sessionId` (UUID v4)
- Logs event for observability

**POC Limitation:** Backend may not exist yet. Mock mode enables frontend development to proceed independently.

### Testing Strategy

**Red-Green-Refactor (TDD):**
1. Write failing test for API client success case
2. Implement minimal code to pass
3. Refactor for clarity
4. Repeat for error cases
5. Repeat for context, integration tests

**Test Execution Order:**
1. Unit tests (API client) - no dependencies
2. Unit tests (SessionContext) - isolated context
3. Integration tests (Welcome flow) - full component stack
4. Accessibility tests - within integration suite

**Mock Strategy:**
- Mock `fetch` globally for API client tests
- Mock `LinkTokenContext` and `SessionContext` for integration tests
- Use `window.__FEATURE_FLAGS__` override to test both mock modes

---

## Risks & Mitigations

### Risk: Token mismatch between state and endpoint
**Impact:** User clicks "Get started" but wrong token sent to backend  
**Mitigation:**
- Read token from single source of truth (`LinkTokenContext`)
- Block call if token is missing/null (defensive check)
- Add validation in Welcome page (token must exist to render button)

### Risk: Flaky backend during POC
**Impact:** Frontend blocked waiting for backend implementation  
**Mitigation:**
- Mock mode is default during early POC phase
- Feature flag enables easy toggle between mock/real
- Mock behavior matches expected API contract exactly
- Clear logging shows which mode is active

### Risk: Race condition on multiple button clicks
**Impact:** User double-clicks, multiple session creation requests  
**Mitigation:**
- Disable button immediately when clicked (before async call)
- Check `sessionStatus === 'loading'` before allowing new request
- Use `useRef` guard if needed (pattern from Story 1.2)

### Risk: sessionStorage cleared by user/browser
**Impact:** sessionId lost, user can't progress  
**Mitigation:**
- Not a critical issue - user can restart from link
- Document behavior: session loss is acceptable failure mode in POC
- Future enhancement: backend session recovery API

### Risk: Network timeout during request
**Impact:** User waits indefinitely with no feedback  
**Mitigation:**
- 10-second timeout on fetch request
- Timeout error treated as `NETWORK_ERROR`
- User sees error banner with retry option

### Risk: Token valid on frontend but backend rejects
**Impact:** User stuck on Welcome screen  
**Mitigation:**
- Display backend error code in user-friendly message
- Provide "Go Home" escape hatch
- Log full error details for debugging (masked)

---

## API Contract (Frontend Expectation)

### Request

```http
POST /api/sessions/start HTTP/1.1
Host: {API_BASE_URL}
Content-Type: application/json

{
  "token": "abc123-def456-ghi789"
}
```

### Responses

**Success (200 OK):**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Invalid Token (400 Bad Request):**
```json
{
  "code": "INVALID_TOKEN",
  "message": "Token format is invalid or signature verification failed"
}
```

**Token Expired (410 Gone):**
```json
{
  "code": "TOKEN_EXPIRED",
  "message": "This survey link has expired"
}
```

**Rate Limited (429 Too Many Requests):**
```json
{
  "code": "RATE_LIMITED",
  "message": "Too many requests from this client"
}
```

**Server Error (5xx):**
```json
{
  "code": "SERVER_ERROR",
  "message": "An unexpected error occurred"
}
```

---

## Data/State Model

### API Client Types

```typescript
// lib/api-client.ts
export interface StartSessionParams {
  token: string;
}

export interface StartSessionResponse {
  sessionId: string;
}

export interface ApiError extends Error {
  code: 'INVALID_TOKEN' | 'TOKEN_EXPIRED' | 'RATE_LIMITED' | 'SERVER_ERROR' | 'NETWORK_ERROR';
  status?: number;
}
```

### Session Context Types

```typescript
// context/SessionContext.tsx
export interface SessionState {
  sessionId: string | null;
  sessionStatus: 'idle' | 'loading' | 'ready' | 'error';
  sessionErrorCode?: string;
}

export interface SessionContextValue extends SessionState {
  startSession: (token: string) => Promise<void>;
  reset: () => void;
}
```

### Telemetry Event Types

```typescript
// lib/telemetry.ts
export interface SessionStartRequestEvent {
  event: 'session_start_request';
  token_preview: string;
  timestamp: number;
}

export interface SessionStartSuccessEvent {
  event: 'session_start_success';
  sessionId_length: number;
  duration_ms: number;
  timestamp: number;
}

export interface SessionStartFailureEvent {
  event: 'session_start_failure';
  error_code: string;
  error_message: string;
  duration_ms: number;
  timestamp: number;
}
```

---

## UX Notes

### Button States

1. **Idle (default):**
   - Text: "Get started"
   - Enabled, ready to click
   - Primary button styling (HeroUI Button variant)

2. **Loading:**
   - Text: "Starting session..." (or show spinner icon)
   - Disabled (`disabled={true}`)
   - `aria-busy="true"`
   - Visual spinner/loading indicator
   - Cursor: `not-allowed` or `wait`

3. **Error (after failure):**
   - Button returns to "Get started" state
   - Error banner appears below with retry option

### Error Banner Design

**Layout:**
```
┌─────────────────────────────────────────┐
│ ⚠️ Unable to connect                    │
│ Please check your connection and try    │
│ again.                                  │
│                                         │
│ [Retry]  [Go Home]                      │
└─────────────────────────────────────────┘
```

**Accessibility:**
- `role="alert"` on container
- `tabindex="0"` to make banner focusable
- Auto-focus banner when it appears
- Buttons are keyboard accessible (Tab key)
- Error icon has `aria-hidden="true"` (decorative)

**Responsive:**
- Full width on mobile
- Stack buttons vertically on small screens
- Adequate padding for touch targets (44x44px minimum)

---

## Telemetry & Logging

### Development Logging

**Console output when mock mode enabled:**
```
[FEATURE FLAG] mockSessionStart: true
[MOCK] Session started with sessionId: 550e8400-e29b-41d4-a716-446655440000
```

**Console output on error:**
```
[ERROR] Session start failed: INVALID_TOKEN
Error details: Token format is invalid...
```

**Production Behavior:**
- Suppress all console.log statements
- Use `process.env.NODE_ENV === 'development'` guard
- Telemetry events go to analytics service (future integration)

### Analytics Events Summary

| Event | When | Payload |
|-------|------|---------|
| `session_start_request` | User clicks "Get started" | `token_preview`, `timestamp` |
| `session_start_success` | Session created successfully | `sessionId_length`, `duration_ms`, `timestamp` |
| `session_start_failure` | Request fails | `error_code`, `error_message`, `duration_ms`, `timestamp` |

**PII Masking:**
- Token: first 6 chars + length (e.g., "abc123...(32)")
- SessionId: length only (e.g., 36)
- Error messages: sanitize to remove tokens/IDs

---

## Estimate

**Effort:** 0.5–1 day

**Breakdown:**
- API client + tests: 2 hours
- Session context + tests: 2 hours
- Welcome integration + tests: 2 hours
- Telemetry + feature flags: 1 hour
- Integration testing + polish: 1 hour

**Total:** 8 hours (1 development day)

---

## Follow-up Stories

### Story 1.4: Progress header chip and room counter (UI only)
- **Depends on:** 1.3 (needs `sessionId` available)
- **Scope:** Display `N/X` spaces completed in header
- **Status:** ready-for-dev

### Future Enhancements (Not in POC)
- Exponential backoff retry (automatic, not user-initiated)
- Session recovery API (resume from partial state)
- Offline queue (store request, retry when online)
- Multi-step progress indicator during session start
- Backend health check before attempting session start

---

## References

### Source Documents
- **PRD:** `_bmad-output/planning-artifacts/prd.md` (FR2, FR5, FR6, NFR1, NFR58)
- **Architecture:** `_bmad-output/architecture/solution-architecture.md` (NestJS SessionModule, API contract)
- **Epics:** `_bmad-output/planning-artifacts/epics.md` (Epic 1, Story 1.3)
- **API Contract:** `docs/api.md` (POST /api/sessions/start endpoint spec)
- **Security:** `docs/security.md` (Token validation, session lifecycle)

### Related Stories
- **Story 1.1:** Frontend shell scaffold - established app structure, routing patterns
- **Story 1.2:** Link redemption - established state management, telemetry, error handling patterns
- **Story 1.4:** Progress header (next) - will consume `sessionId` from this story

### Architecture References
- NestJS SessionModule (controller/service/repo structure)
- Next.js App Router conventions (client components, server components)
- React Context pattern for state management
- sessionStorage for persistence (established in 1.2)
- Feature flag system (established in 1.2)

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 via Cursor Dev Agent (Story 1.3)

### Debug Log References

- API client timeout test: Fixed DOMException handling for AbortError
- SessionContext error handling: Removed error re-throw to avoid unhandled rejections
- Integration tests: Simplified mocking pattern using existing test patterns

### Completion Notes List

✅ **All 7 tasks completed successfully:**

1. **API Client** - Implemented with comprehensive error mapping, timeout handling, and mock mode support
2. **Mock Mode** - Feature flag system extended, pseudo-UUID generation with realistic delays
3. **SessionContext** - Full state management with sessionStorage persistence, concurrent request prevention
4. **Welcome Screen** - Loading states, error banner with retry, configurable navigation, accessibility
5. **Telemetry** - Session events with PII masking integrated into SessionContext
6. **Integration Tests** - 11 integration tests covering success, error, retry, and accessibility
7. **Polish** - All 68 tests passing, SessionProvider integrated, existing tests updated

**Test Coverage:**
- 13 API client tests (100% pass)
- 9 SessionContext tests (100% pass)
- 11 integration tests (100% pass)
- All existing tests updated and passing

### File List

**New Files:**
- `surveyor-frontend/lib/api-client.ts`
- `surveyor-frontend/context/SessionContext.tsx`
- `surveyor-frontend/__tests__/api-client.spec.ts`
- `surveyor-frontend/__tests__/session-context.spec.tsx`
- `surveyor-frontend/__tests__/session-start.spec.tsx`

**Modified Files:**
- `surveyor-frontend/app/Providers.tsx`
- `surveyor-frontend/app/welcome/page.tsx`
- `surveyor-frontend/lib/feature-flags.ts`
- `surveyor-frontend/lib/telemetry.ts`
- `surveyor-frontend/__tests__/routes.spec.tsx`
- `surveyor-frontend/__tests__/welcome-protection.spec.tsx`

---

## Change Log

- **2026-01-03:** Initial comprehensive story created by SM workflow (YOLO mode). Story 1.3 converted from simplified format to full BMAD dev story structure. All developer context, guardrails, and requirements extracted from Epic 1 context, Stories 1.1 & 1.2 learnings, and architecture docs.
- **2026-01-03:** Story implemented by Dev Agent - All 7 tasks completed using TDD (red-green-refactor). API client, SessionContext, Welcome screen integration, telemetry, and comprehensive test suite (68 tests total) all passing.

---

**✅ Story Status:** review  
**Next Action:** Run code-review workflow using fresh context and different LLM for peer review.

