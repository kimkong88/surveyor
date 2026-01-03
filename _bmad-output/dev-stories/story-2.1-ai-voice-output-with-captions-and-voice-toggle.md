# Story 2.1: AI voice output with captions and voice toggle

Status: ready-for-dev

## Story

As a homeowner,
I want AI voice responses with captions and a voice toggle,
so that I can follow guidance in my preferred modality.

## Acceptance Criteria

1. Given the assistant produces a response, when voice is enabled, then audio plays and real-time captions render in the Conversation Pane.
2. Given I toggle voice off, when the next message arrives, then only captions/text render; audio is suppressed and the toggle state persists for the session.

## Tasks / Subtasks

- [ ] Add voice toggle control (persists for session)
  - [ ] Store toggle state in client state (e.g., context/store)
- [ ] Integrate TTS playback pipeline
  - [ ] Render synchronized captions alongside audio
- [ ] Implement caption-only rendering when voice disabled
  - [ ] Ensure no audio initialization occurs in caption-only mode
- [ ] Accessibility checks
  - [ ] Toggle is keyboard-accessible and labeled
  - [ ] Captions exposed to assistive tech

## Dev Notes

- UI framework: Next.js mobile-first; use accessible components and onPress semantics.
- Maintain a single source of truth for voiceEnabled state; avoid race conditions between TTS and caption renderer.
- Ensure graceful degradation: if TTS fails, fall back to captions without blocking.
- Persist toggle across route changes; consider session-scoped persistence.

### Project Structure Notes

- Place UI control in Conversation Pane header/footer per IA.
- Keep audio/caption logic modular to support future input (Story 2.2) without refactor.

### References

- Source: _bmad-output/planning-artifacts/epics.md#Story-2.1
- Accessibility: WCAG 2.1 AA compliance notes in epics (Epic 2 context)

## Dev Agent Record

### Agent Model Used

GPT-5 (Cursor)

### Completion Notes List

- Ultimate context analysis complete; story set to ready-for-dev.

### File List

- Conversation UI components (toggle, captions)
- Audio playback module (TTS abstraction)


