# Story 2.1: Text Chat Interface Foundation

Status: backlog

## Story

As a homeowner,
I want to type messages to the AI guide and see our conversation history,
so that I can communicate when voice is unavailable or I prefer text.

## Acceptance Criteria

1. Given I'm on the Conversation page, when the interface loads, then I see a message history area and a text input field with a send button.
2. Given I type a message and press Send (or Enter), when the message is sent, then my message appears in the conversation history and the AI response follows.
3. Given the conversation progresses, when multiple messages are exchanged, then all messages display in chronological order with clear sender identification (User vs. AI).
4. Given long conversations, when many messages accumulate, then the message area scrolls and auto-scrolls to the latest message.
5. Given I'm using keyboard only, when I navigate the chat interface, then the input field is focusable and Enter sends the message (Shift+Enter for newline).

## Tasks / Subtasks

- [ ] Design message display component
  - [ ] User message style (right-aligned, distinct color)
  - [ ] AI message style (left-aligned, distinct color)
  - [ ] Timestamp display (optional for POC)
- [ ] Implement text input field with send button
  - [ ] Auto-focus on mount
  - [ ] Enter to send, Shift+Enter for newline
  - [ ] Clear input after send
- [ ] Build message history container
  - [ ] Scrollable area with auto-scroll to bottom
  - [ ] Handle empty state ("Start conversation...")
- [ ] Wire up send/receive flow
  - [ ] Client state management for messages
  - [ ] Mock AI response initially (can be "Echo: [user message]")
  - [ ] Loading indicator while waiting for AI response
- [ ] Accessibility checks
  - [ ] Proper ARIA labels for input and send button
  - [ ] Screen reader announcements for new messages
  - [ ] Keyboard navigation (Tab to send button, Enter to submit)

## Dev Notes

- UI framework: Next.js mobile-first; use HeroUI components where applicable.
- Message state: Use React Context or local state (decide based on architecture).
- This is the foundation for both text-only mode (Story 2.4) and voice interactions (Stories 2.2, 2.3).
- Keep message rendering modular to support future enhancements (typing indicators, message actions).
- AI response can be mocked for this story; real integration happens in later stories.

### Project Structure Notes

- Place message components in `components/conversation/` or similar.
- Keep text input and message history as separate components for reusability.
- Ensure chat container fits within mobile viewport without overflow.

### References

- Source: Epic 2 foundation requirement (discovered during implementation planning)
- Related: Story 2.4 (Text-only mode) and Story 2.5 (Interrupt-and-ask) depend on this
- Accessibility: WCAG 2.1 AA compliance notes in epics (Epic 2 context)

## Dev Agent Record

### Agent Model Used

(To be filled during implementation)

### Completion Notes List

(To be filled during implementation)

### File List

- Conversation message components
- Text input component
- Message state management

## Dependencies

- Story 1.1 (Conversation route must exist)
- Story 1.7 (HeroUI setup complete)

## Blocked By

None

## Blocks

- Story 2.4 (Text-only mode and auto-fallback) - requires working text interface
- Story 2.5 (Interrupt-and-ask) - requires both voice and text interfaces

