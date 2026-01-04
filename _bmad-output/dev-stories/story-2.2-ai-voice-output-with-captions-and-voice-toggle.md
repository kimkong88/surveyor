# Story 2.2: AI voice output with captions and voice toggle

Status: ready-for-dev

## Story

As a homeowner,
I want AI voice responses with captions and a voice toggle,
so that I can follow guidance in my preferred modality.

## Context
Epic 2: Conversational Guidance (Voice/Text) with Accessibility. This story adds voice output capability to the text chat interface from Story 2.1.

## In Scope
- Voice toggle control (persists for session)
- TTS (text-to-speech) playback for AI responses
- Real-time captions alongside audio
- Caption-only mode when voice disabled

## Out of Scope
- Voice input/microphone (Story 2.3)
- Advanced TTS features (voice selection, speed control)

## Acceptance Criteria

- [ ] **AC1**: Given the assistant produces a response, when voice is enabled, then audio plays and real-time captions render in the Conversation Pane.

- [ ] **AC2**: Given I toggle voice off, when the next message arrives, then only captions/text render; audio is suppressed and the toggle state persists for the session.

## Recommended Approach

- Add voice toggle control (button/switch) that persists state for session (sessionStorage or context)
- Use Web Speech API (`speechSynthesis`) for TTS playback
- Render captions alongside audio when voice enabled
- Render captions only (no audio) when voice disabled
- Ensure toggle state persists across route changes


