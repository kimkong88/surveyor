# Story Format Guide - AC-Only Approach

## Purpose

This guide defines the simplified story format used for all dev stories starting from Story 1.6. Stories focus on **Acceptance Criteria (AC) only** and provide **Function Stubs** for implementation guidance, without prescriptive technical details.

## Why This Format?

- **Flexibility**: Developers can choose the simplest implementation that meets AC
- **Efficiency**: No over-engineering or unnecessary abstractions
- **Clarity**: Clear checklist of what must work, not how to build it
- **Workflow**: Write stub functions first, then implement to meet AC

## Story Structure

### Required Sections

1. **Story** - User story format (As a..., I want..., so that...)
2. **Context** - Brief epic/feature context
3. **In Scope** - What this story covers
4. **Out of Scope** - What this story explicitly does NOT cover
5. **Acceptance Criteria** - Checkbox list of AC (numbered AC1, AC2, etc.)
6. **Recommended Approach** - High-level guidance (not prescriptive implementation)

### Removed Sections

- ❌ Technical Plan (prescriptive implementation details)
- ❌ Tasks/Subtasks (detailed step-by-step tasks)
- ❌ Testing Strategy (unless critical for AC)
- ❌ Definition of Done (use your judgment)
- ❌ Risks & Mitigations (unless blocking)
- ❌ Data/State Model (unless critical for understanding)

## Acceptance Criteria Format

```markdown
## Acceptance Criteria

- [ ] **AC1**: Given [condition], when [action], then [expected result]

- [ ] **AC2**: Given [condition], when [action], then [expected result]
```

- Each AC is a checkbox for tracking completion
- Use clear Given/When/Then format
- Number them (AC1, AC2, etc.) for easy reference

## Recommended Approach Format

```markdown
## Recommended Approach

- High-level guidance on how to approach the problem
- Key technologies/APIs to consider
- Important constraints or requirements
- Integration points if relevant
```

**Purpose:**
- Provides high-level guidance without prescribing implementation
- Suggests technologies/approaches without mandating them
- Gives context for developer to make informed decisions
- Developer creates function stubs themselves, then asks dev agent to implement

## Example Story Structure

```markdown
# Story X.Y: [Title]

Status: ready-for-dev

## Story
As a [role],
I want [action],
so that [benefit].

## Context
[Brief context about epic/feature]

## In Scope
- [What this story covers]

## Out of Scope
- [What this story explicitly does NOT cover]

## Acceptance Criteria

- [ ] **AC1**: [Given/When/Then]

- [ ] **AC2**: [Given/When/Then]

## Recommended Approach

- [High-level guidance]
- [Key technologies/APIs]
- [Important constraints]
```

## Workflow

1. **Read AC** - Understand what must work
2. **Read Recommended Approach** - Get high-level guidance
3. **Create Stubs** - You write empty function stubs in the right order
4. **Ask Dev Agent** - Request dev agent to implement stubs and verify AC are met
5. **Verify AC** - Check off AC when they pass
6. **Done** - Story complete when all AC checked

## For Story Creation (2.4+)

When creating new stories:

1. Extract AC from epics/PRD
2. Add brief context and scope
3. Add "Recommended Approach" with high-level guidance (not prescriptive)
4. **DO NOT** add Technical Plan, Tasks, Testing Strategy, Function Stubs, etc.

## Key Principles

- ✅ **AC defines WHAT must work** - not how
- ✅ **Recommended Approach provides guidance** - not prescription
- ✅ **Developer creates stubs** - you decide what functions/modules are needed
- ✅ **Dev agent implements** - fills in stubs to meet AC
- ✅ **Developer chooses HOW** - simplest approach that meets AC
- ✅ **No over-engineering** - avoid unnecessary abstractions
- ✅ **Flexibility first** - don't lock into patterns prematurely

