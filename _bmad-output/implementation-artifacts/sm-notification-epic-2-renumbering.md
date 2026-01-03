# SM Notification: Epic 2 Story Renumbering

**Date:** 2026-01-03  
**Reported By:** Product Manager (John)  
**Type:** Story Structure Change  
**Severity:** Medium (Requires SM Approval)

---

## Summary

During implementation planning review, we discovered a **missing foundation story** in Epic 2 (Conversational Guidance). All Epic 2 stories have been renumbered to accommodate the new Story 2.1.

**Impact:** No work has been lost. Existing `ready-for-dev` stories (2.1 and 2.2) are now numbered 2.2 and 2.3, with updated references.

---

## What Changed

### New Story Added

**Story 2.1: Text Chat Interface Foundation** (NEW)
- **Status:** `backlog`
- **Scope:** Text input field, message history, send/receive flow, keyboard navigation
- **Why Added:** Stories 2.3 (text fallback) and 2.5 (interrupt-and-ask) assumed a text chat interface existed, but it was never explicitly built in Epic 1. This story provides the foundation for both text-only mode and voice features.

### Stories Renumbered

| Old Number | New Number | Story Title | Status | Notes |
|------------|------------|-------------|--------|-------|
| - | **2.1** | Text Chat Interface Foundation | `backlog` | NEW - foundation story |
| 2.1 | **2.2** | AI voice output with captions and voice toggle | `ready-for-dev` | File renamed, dependencies updated |
| 2.2 | **2.3** | Microphone permission + voice input capture | `ready-for-dev` | File renamed, dependencies updated |
| 2.3 | **2.4** | Text-only mode and auto-fallback | `backlog` | Updated in epics.md |
| 2.4 | **2.5** | Interrupt-and-ask with real-time responses | `backlog` | Updated in epics.md |
| 2.5 | **2.6** | Accessibility compliance (WCAG AA) | `backlog` | Updated in epics.md |
| 2.6 | **2.7** | Mobile clarity and orientation support | `backlog` | Updated in epics.md |

---

## Files Modified

### Story Files
- ✅ **Created:** `_bmad-output/dev-stories/story-2.1-text-chat-interface-foundation.md`
- ✅ **Renamed:** `story-2.1-...` → `story-2.2-ai-voice-output-with-captions-and-voice-toggle.md`
- ✅ **Renamed:** `story-2-2-...` → `story-2.3-microphone-permission-voice-input-capture.md`
- ✅ **Updated:** Internal references to new story numbers in renamed files

### Planning Documents
- ✅ **Updated:** `_bmad-output/planning-artifacts/epics.md`
  - Inserted Story 2.1 with full acceptance criteria
  - Renumbered all subsequent Epic 2 stories

### Implementation Tracking
- ✅ **Updated:** `_bmad-output/implementation-artifacts/sprint-status.yaml`
  - Added: `2-1-text-chat-interface-foundation: backlog`
  - Updated: All Epic 2 story keys with new numbering
  - Maintained existing statuses

---

## Rationale

### Why Story 2.1 Was Missing

**Original Epic 2 assumption:**
- Story 1.1 created a "conversation route skeleton"
- Stories 2.1 and 2.2 would add voice capabilities
- Stories 2.3 and 2.4 referenced "text mode" and "text input"

**Problem discovered:**
- Story 1.1 created routes and layout scaffolding only
- No actual text chat interface was built (input field, message history, send/receive)
- Stories 2.3 ("switch to text-only") and 2.5 ("ask via voice or text") assumed text chat existed

**Solution:**
- Add Story 2.1 as the text chat foundation
- Voice stories (2.2, 2.3) build on top of this foundation
- Text fallback (2.4) and interrupt-and-ask (2.5) now have proper dependencies

### Why Renumbering vs. Alternative Approaches

**Considered Options:**
1. ❌ **Story "2.0"** - Breaks numbering convention, confusing for future reference
2. ❌ **Story 1.8** - Epic 1 is "Access Link & Session Management", not UI foundation
3. ✅ **Full renumber** - Clean, logical, follows dependency order

**Selected:** Full renumber (Option 3) for long-term clarity and proper dependency tracking.

---

## Impact Assessment

### Development Impact
- **Low disruption:** No work has started on Epic 2 stories yet (all are `backlog` or `ready-for-dev`)
- **Clear dependencies:** Story 2.1 must be completed before 2.2 and 2.3
- **No code impact:** Existing code (Epic 1) is unaffected

### Sprint Planning Impact
- **Epic 2 scope unchanged:** Same total work, just reorganized
- **New story is small:** Estimated 1-2 days (text input + message display)
- **Recommended sequence:** 2.1 → 2.2 → 2.3 → 2.4 → 2.5

### Documentation Impact
- **All references updated:** epics.md, sprint-status.yaml, story files
- **No broken links:** Story files use descriptive names, not just numbers
- **SM tracking:** This notification serves as the audit trail

---

## Recommended Actions

### For Scrum Master
1. **Review and approve** this renumbering change
2. **Update any external tracking** (if Epic 2 stories were referenced elsewhere)
3. **Communicate to team:** Epic 2 story numbers have shifted; use new numbering going forward
4. **Sprint planning:** Ensure Story 2.1 is scheduled before 2.2/2.3 in upcoming sprints

### For Development Team
1. **Reference new story numbers** in commit messages and PRs
2. **Check dependencies:** Story 2.1 blocks 2.2, 2.3, 2.4, and 2.5
3. **No action needed** if currently working on Epic 1 stories

### For Product Manager
1. ✅ **Completed:** All documentation updated
2. ✅ **Completed:** Story 2.1 dev story document created
3. **Next:** Monitor Epic 1 completion to determine Epic 2 start timing

---

## Questions for SM

1. **Approval:** Do you approve this renumbering approach?
2. **Communication:** Should we notify the team via Slack/email, or is this notification sufficient?
3. **External tracking:** Are Epic 2 stories referenced in any external systems that need updating?
4. **Sprint planning:** Any concerns about adding Story 2.1 to the backlog at this stage?

---

## Acceptance

**SM Approval Required:**
- [ ] Renumbering approach approved
- [ ] Team communication plan confirmed
- [ ] External tracking systems updated (if applicable)
- [ ] Sprint planning notes updated

**Signed:**  
- **SM:** ________________________  Date: __________
- **PM (John):** Submitted  Date: 2026-01-03

---

## Appendix: Full Epic 2 Story List (Current)

1. **2.1** - Text Chat Interface Foundation (`backlog`) 🆕
2. **2.2** - AI voice output with captions and voice toggle (`ready-for-dev`)
3. **2.3** - Microphone permission + voice input capture (`ready-for-dev`)
4. **2.4** - Text-only mode and auto-fallback (`backlog`)
5. **2.5** - Interrupt-and-ask with real-time responses (`backlog`)
6. **2.6** - Accessibility compliance (WCAG AA) (`backlog`)
7. **2.7** - Mobile clarity and orientation support (`backlog`)

**Total Epic 2 Stories:** 7 (was 6, added 1 foundation story)

---

**End of Notification**

