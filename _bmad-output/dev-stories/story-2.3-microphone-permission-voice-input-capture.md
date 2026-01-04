# Story 2.3: Microphone permission + voice input capture

Status: ready-for-dev

## Story

As a homeowner,
I want to grant microphone access and speak to the assistant,
so that I can interact hands-free.

## Context
Epic 2: Conversational Guidance (Voice/Text) with Accessibility. This story enables hands-free voice input capability. Story 2.2 handled AI voice output; this completes the bidirectional voice loop by capturing user speech input.

## In Scope
- Microphone permission request flow
- Audio capture from microphone
- Routing audio to conversation engine (WebSocket/WebRTC)
- Error handling with retry

## Out of Scope
- Advanced audio processing (noise cancellation, etc.)
- Multiple microphone selection
- Audio quality optimization

## Acceptance Criteria

- [ ] **AC1**: Given no mic permission yet, when I press "Enable voice", then the browser permission prompt appears and the app handles allow/deny with clear messaging

- [ ] **AC2**: Given permission is granted, when I speak, then the input stream is captured and routed to the conversation engine; errors are surfaced gracefully with retry

## Recommended Approach

- Request microphone permission via `navigator.mediaDevices.getUserMedia({ audio: true })`
- Handle permission states: granted, denied, error (show clear messaging for each)
- Use MediaRecorder to capture audio chunks when permission granted
- Route audio chunks to WebSocket (format: `{ type: "speech_in", chunkId: string, audioBase64: string }`)
- Handle errors gracefully with retry (NotAllowedError, NotFoundError, etc.)
- Show visual indicator when microphone is active/recording
- Ensure keyboard accessibility for all controls

## Dependencies

- Story 2.1 (Text Chat Interface) - must exist as foundation
- Story 2.2 (AI voice output) - voice toggle mechanism should exist
