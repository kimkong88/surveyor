# Story 2.1: Text Chat Interface Foundation

Status: backlog

## Story

As a homeowner,
I want to type messages to the AI guide and see our conversation history,
so that I can communicate when voice is unavailable or I prefer text.

## Context
Epic 2: Conversational Guidance (Voice/Text) with Accessibility. This story establishes the text chat interface foundation that supports both text-only mode and voice interactions.

## In Scope
- Message history display area
- Text input field with send button
- Message state management
- Basic AI response handling (can be mocked)

## Out of Scope
- Real AI integration (handled in later stories)
- Voice input/output (Stories 2.2, 2.3)
- Advanced features (typing indicators, message actions)

## Acceptance Criteria

- [ ] **AC1**: Given I'm on the Conversation page, when the interface loads, then I see a message history area and a text input field with a send button.

- [ ] **AC2**: Given I type a message and press Send (or Enter), when the message is sent, then my message appears in the conversation history and the AI response follows.

- [ ] **AC3**: Given the conversation progresses, when multiple messages are exchanged, then all messages display in chronological order with clear sender identification (User vs. AI).

- [ ] **AC4**: Given long conversations, when many messages accumulate, then the message area scrolls and auto-scrolls to the latest message.

- [ ] **AC5**: Given I'm using keyboard only, when I navigate the chat interface, then the input field is focusable and Enter sends the message (Shift+Enter for newline).

## Recommended Approach

- Create message history area and text input field on Conversation page
- Use React state (Context or local) to manage message list
- Mock AI responses for now (e.g., echo user message back)
- Auto-scroll message area to bottom when new messages arrive
- Handle Enter to send, Shift+Enter for newline in text input
- Ensure keyboard accessibility (input focusable, Enter submits)

