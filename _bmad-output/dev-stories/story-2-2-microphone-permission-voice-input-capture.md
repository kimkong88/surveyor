# Story 2.2: Microphone permission + voice input capture

Status: ready-for-dev

## Story

As a homeowner,
I want to grant microphone access and speak to the assistant,
so that I can interact hands-free.

## Acceptance Criteria

1. **Given** no mic permission yet  
   **When** I press "Enable voice"  
   **Then** the browser permission prompt appears and the app handles allow/deny with clear messaging

2. **Given** permission is granted  
   **When** I speak  
   **Then** the input stream is captured and routed to the conversation engine; errors are surfaced gracefully with retry

## Context & Business Value

**Epic 2: Conversational Guidance (Voice/Text) with Accessibility**

This story enables the **hands-free voice input** capability that is core to the surveyor value proposition. While Story 2.1 handled AI voice *output*, this story completes the bidirectional voice loop by capturing user speech input.

**Why this matters:**
- Homeowners capturing photos need hands-free interaction (holding phone/camera)
- Voice input enables natural interruptions and clarifications during the survey
- Graceful permission handling prevents user frustration and abandonment
- Error recovery ensures poor connectivity doesn't block voice features

**User Journey Context:**
- User has already seen permission guidance on Welcome screen (Story 1.1)
- Voice toggle from Story 2.1 controls both input and output
- This story focuses on the *input* side: requesting permissions and capturing audio

## Tasks / Subtasks

- [ ] Implement microphone permission request flow (AC #1)
  - [ ] Create `useMicrophonePermission` hook with permission state management
  - [ ] Handle browser permission API (`navigator.mediaDevices.getUserMedia`)
  - [ ] Store permission state (granted/denied/prompt) in session context
  - [ ] Display clear messaging for each permission state

- [ ] Build voice input capture pipeline (AC #2)
  - [ ] Initialize MediaStream when permission granted
  - [ ] Capture audio chunks using MediaRecorder or Web Audio API
  - [ ] Route audio data to conversation engine (WebSocket/WebRTC)
  - [ ] Implement graceful error handling with retry logic

- [ ] Add UI controls and feedback
  - [ ] "Enable voice" button (keyboard accessible, labeled)
  - [ ] Visual indicator when microphone is active (recording state)
  - [ ] Error banners for permission denied or capture failures
  - [ ] Retry affordance for transient errors

- [ ] Accessibility compliance
  - [ ] Ensure all controls are keyboard-navigable
  - [ ] Provide ARIA labels for permission states
  - [ ] Screen reader announcements for state changes

## Dev Notes

### Architecture Alignment

**Frontend Stack (from Story 1.1):**
- Next.js 16.1.1 with React 19.2.3
- HeroUI v2.8.7 for UI components (use `onPress`, not `onClick`)
- Tailwind CSS v4 for styling
- Mobile-first responsive design

**Voice Architecture (from PRD & Architecture):**
- **Primary**: WebRTC for low-latency bidirectional audio
- **Fallback**: WebSocket for audio streaming if WebRTC unavailable
- **AI Integration**: Gemini 2.5/3 Flash handles speech recognition
- **Backend**: NestJS WebSocket gateway at `/realtime/sessions/:sessionId`

**Browser API Requirements:**
- `navigator.mediaDevices.getUserMedia({ audio: true })`
- HTTPS required for microphone access (already enforced)
- Target browsers: Chrome, Safari (iOS critical), Firefox, Edge
- No legacy browser support (IE11, Safari <14)

### Technical Implementation Details

**Permission Flow:**
1. User presses "Enable voice" button
2. Call `navigator.mediaDevices.getUserMedia({ audio: true })`
3. Browser shows native permission prompt
4. Handle three outcomes:
   - **Granted**: Store permission state, initialize MediaStream
   - **Denied**: Show clear message, offer text-only mode
   - **Error**: Catch and display specific error (NotAllowedError, NotFoundError, etc.)

**Audio Capture Strategy:**
```typescript
// Recommended approach for POC
const stream = await navigator.mediaDevices.getUserMedia({ 
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  }
});

// Use MediaRecorder for simplicity in POC
const mediaRecorder = new MediaRecorder(stream, {
  mimeType: 'audio/webm' // or 'audio/mp4' for Safari
});

mediaRecorder.ondataavailable = (event) => {
  // Send chunks to WebSocket/WebRTC
  sendAudioChunk(event.data);
};
```

**WebSocket Message Format (from docs/api.md):**
```typescript
// Client → Server
{
  type: "speech_in",
  chunkId: string,
  audioBase64: string // or binary depending on WS implementation
}

// Server → Client (errors)
{
  type: "error",
  code: string,
  message: string
}
```

**State Management:**
- Store in session context (existing pattern from Story 1.1)
- Permission state: `'prompt' | 'granted' | 'denied' | 'error'`
- Recording state: `'idle' | 'recording' | 'paused' | 'error'`
- Persist voice toggle state across route changes (session-scoped)

**Error Handling Taxonomy:**
- `NotAllowedError`: User denied permission → Show friendly message
- `NotFoundError`: No microphone detected → Offer text-only mode
- `NotReadableError`: Hardware busy → Suggest closing other apps
- `OverconstrainedError`: Constraints not met → Fallback to basic config
- Network errors: WebSocket disconnection → Auto-reconnect with backoff

### File Structure Requirements

Based on existing codebase structure:

```
surveyor-frontend/
├── components/
│   ├── VoiceInputButton.tsx          # NEW: "Enable voice" control
│   ├── MicrophoneIndicator.tsx       # NEW: Visual recording state
│   └── ui/
│       └── Button.tsx                 # EXISTING: Reuse for voice button
├── hooks/
│   ├── useMicrophonePermission.ts    # NEW: Permission management
│   └── useVoiceInput.ts              # NEW: Audio capture logic
├── context/
│   └── VoiceContext.tsx              # NEW: Voice state management
├── lib/
│   └── audioCapture.ts               # NEW: MediaRecorder utilities
└── app/
    └── conversation/
        └── page.tsx                   # UPDATE: Add voice input controls
```

**Integration Points:**
- `app/conversation/page.tsx`: Add VoiceInputButton to conversation UI
- `components/AppLayout.tsx`: May need voice indicator in header/footer
- Story 2.1 voice toggle: Extend to control both input and output

### Testing Requirements

**Unit Tests:**
- `useMicrophonePermission` hook: permission state transitions
- `useVoiceInput` hook: audio capture lifecycle
- Mock `navigator.mediaDevices.getUserMedia` for different scenarios

**Integration Tests:**
- Permission request flow with mocked browser API
- Audio chunk capture and WebSocket message formatting
- Error handling for each permission/capture error type

**Accessibility Tests:**
- Keyboard navigation to "Enable voice" button
- ARIA labels for permission states
- Screen reader announcements for state changes

**Manual Testing Checklist:**
- [ ] Permission prompt appears on first "Enable voice" press
- [ ] Permission denied shows clear message and text-only option
- [ ] Microphone indicator shows when recording
- [ ] Audio chunks sent to WebSocket (verify in network tab)
- [ ] Error recovery works for transient failures
- [ ] Works on iOS Safari (critical for mobile users)

### Previous Story Intelligence

**From Story 1.1 (Frontend shell scaffold):**
- AppLayout established with header/footer placeholders
- Conversation page exists at `/conversation`
- Right-side panel pattern for Capture/Inventory (may need voice controls here)
- Accessibility baseline: keyboard navigation, ARIA labels, focus management
- Testing setup: Vitest + RTL + jest-dom configured

**From Story 2.1 (AI voice output):**
- Voice toggle control exists (persists for session)
- VoiceContext or similar state management for `voiceEnabled`
- Caption rendering alongside audio (text fallback pattern)
- Graceful degradation: if TTS fails, fall back without blocking

**Key Learnings to Apply:**
- Follow existing state management pattern (likely React Context)
- Reuse HeroUI components with `onPress` semantics
- Maintain separation: voice input logic should be modular
- Test with mocked browser APIs (don't require real microphone in tests)

### Latest Technical Information

**Browser API Compatibility (2026):**
- `getUserMedia` widely supported in target browsers
- Safari iOS requires HTTPS (already enforced)
- MediaRecorder support: Chrome/Edge (webm), Safari (mp4)
- Recommend feature detection and graceful fallback

**WebRTC vs WebSocket for Audio:**
- **WebRTC**: Lower latency (~50-100ms), better for real-time conversation
- **WebSocket**: Simpler implementation, easier debugging, sufficient for POC
- **Recommendation**: Start with WebSocket for POC, migrate to WebRTC in Phase 2

**Security Considerations:**
- HTTPS required for microphone access (already in place)
- Permission persists per origin (user won't be prompted repeatedly)
- MediaStream tracks must be stopped when not in use (prevent battery drain)

**Performance Optimization:**
- Audio chunk size: 100-500ms chunks for balance of latency and overhead
- Bandwidth: ~50-100 kbps for voice (from PRD)
- Monitor connection quality and degrade to text if needed (Story 2.3)

### References

**Source Documents:**
- [Epic 2 Story 2.2](_bmad-output/planning-artifacts/epics.md#Story-2.2)
- [PRD: Real-Time Conversational Architecture](_bmad-output/planning-artifacts/prd.md#Real-Time-Conversational-Architecture)
- [Architecture: WebSocket Protocol](docs/api.md#WS-realtime-sessions)
- [Security: Session Management](docs/security.md#Sessions-Realtime)

**Related Stories:**
- Story 1.1: Frontend shell scaffold (baseline UI structure)
- Story 2.1: AI voice output with captions (voice toggle, state management)
- Story 2.3: Text-only mode and auto-fallback (graceful degradation)
- Story 2.4: Interrupt-and-ask (bidirectional conversation flow)

**Technical References:**
- [MDN: getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [MDN: MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [MDN: Permissions API](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API)

## Definition of Done

- [ ] All acceptance criteria pass
- [ ] "Enable voice" button triggers browser permission prompt
- [ ] Permission granted → audio capture starts
- [ ] Permission denied → clear error message, text-only option
- [ ] Audio chunks sent to WebSocket in correct format
- [ ] Visual indicator shows recording state
- [ ] Error handling with retry for transient failures
- [ ] Keyboard accessible and screen reader compatible
- [ ] Unit tests pass for permission and capture hooks
- [ ] Integration tests cover permission flow and error states
- [ ] Manual testing on Chrome, Safari (iOS), Firefox
- [ ] Code reviewed and merged
- [ ] Story marked as 'done' in sprint-status.yaml

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (Cursor)

### Completion Notes

- Ultimate context engine analysis completed
- Comprehensive developer guide created with architecture alignment
- Previous story learnings incorporated (Story 1.1, 2.1)
- Latest browser API compatibility verified
- WebSocket message format from API contract included
- Error taxonomy and recovery strategies documented
- Mobile-first and accessibility requirements emphasized

### File List

**New Files:**
- `surveyor-frontend/components/VoiceInputButton.tsx`
- `surveyor-frontend/components/MicrophoneIndicator.tsx`
- `surveyor-frontend/hooks/useMicrophonePermission.ts`
- `surveyor-frontend/hooks/useVoiceInput.ts`
- `surveyor-frontend/context/VoiceContext.tsx`
- `surveyor-frontend/lib/audioCapture.ts`

**Modified Files:**
- `surveyor-frontend/app/conversation/page.tsx` (add voice input controls)
- `surveyor-frontend/components/AppLayout.tsx` (optional: voice indicator in header)

**Test Files:**
- `surveyor-frontend/__tests__/useMicrophonePermission.spec.ts` (new)
- `surveyor-frontend/__tests__/useVoiceInput.spec.ts` (new)
- `surveyor-frontend/__tests__/VoiceInputButton.spec.tsx` (new)

