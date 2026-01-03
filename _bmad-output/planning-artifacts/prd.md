---
stepsCompleted: [1, 2, 3, 4, 6, 7, 8, 9, 10, 11]
inputDocuments: []
workflowType: "prd"
lastStep: 11
briefCount: 0
researchCount: 0
brainstormingCount: 0
projectDocsCount: 0
workflowComplete: true
completedDate: 2026-01-03
---

# Product Requirements Document - surveyor

**Author:** Damian
**Date:** 2026-01-03

## Executive Summary

**surveyor** is an AI-powered moving survey tool that replaces the speed vs. accuracy dilemma with a guided photo audit, enabling moving companies to deliver accurate quotes in hours instead of days while maintaining 96%+ inventory precision.

### The Problem

Moving companies face a **speed vs. accuracy dilemma** that either costs them customers or crushes their margins.

**The Slow Path (In-Person Surveys):**

-   **Scheduling delays**: Coordinating availability between customer and surveyor (days to weeks)
-   **Travel time**: Surveyor drives to location, conducts 30-60 min walkthrough
-   **Manual processing**: Data entry, volume calculations, quote generation
-   **Total timeline**: 3-7 days from inquiry to delivered quote
-   **Result**: Accurate quotes, but customers have already booked with faster competitors

**The Fast Path (Phone Estimates):**

-   Customer describes their belongings over the phone
-   Estimator guesses volumes based on verbal descriptions ("a living room set", "some boxes")
-   Quote delivered same day or next day
-   **Result**: Win the customer, but systematic underestimation eats profit margins on moving day

**The core problem:** Homeowners researching movers contact multiple companies. Speed wins the booking, but inaccuracy kills profitability. Moving companies are forced to choose between losing customers or losing money.

**Capacity constraints compound the issue:** Companies can only quote as many jobs as surveyors can physically visit per day. During peak moving season (summer), this creates a quote backlog that leaves revenue on the table.

Existing AI solutions (e.g., Yembo) attempted video-based approaches, but video surveys suffer from a fundamental technical limitation: LLMs cannot process motion video effectively. Camera movement causes frame quality degradation, motion blur, and missed items - resulting in the same inaccuracy problem as phone estimates.

### The Solution

**surveyor** uses a **photo-based guided audit** approach that leverages the strengths of modern vision AI:

1. **Direct link delivery**: Customer receives a link (SMS/email), opens in browser
2. **AI-guided photography**: System directs user through each room with clear instructions
3. **Satisfactory Check loop**: Agent-based confidence validation - AI won't advance until it's confident all items are logged for that space
4. **Dimension & material estimation**: AI analyzes photos to estimate size, weight, and material properties for each item
5. **Professional PDF output**: Generated inventory with sequential ID numbers overlaid on photos, CFT calculations per 400N tariff standards

### Value Proposition

**For Moving Companies:**

-   **Speed to quote**: AI completes the inventory legwork; staff just reviews and prices
-   **Cost reduction**: ~$0.10 per AI survey vs $50-200 human visit
-   **Scale unlock**: Quote unlimited jobs without physical visit constraints
-   **Accuracy confidence**: 96%+ target accuracy through validation loops
-   **Margin protection**: Eliminate underestimation from phone quotes

**For Homeowners:**

-   **Free estimation**: No charge for survey (if moving company normally charges)
-   **Convenience**: No scheduling, no waiting, complete on their timeline
-   **Privacy**: No strangers walking through their home

### What Makes This Special

**Technical Architecture Advantage:**
Static photos provide high-resolution, stable images that modern vision models (Gemini 2.5/3 Flash) can analyze with precision. Unlike video, there's no motion blur, no frame rate issues, and no missed items due to camera movement speed.

**Agent-Based Quality Control:**
The "Satisfactory Check" system uses an AI agent to validate confidence levels before proceeding. If the AI detects low confidence (items obscured, unclear dimensions, incomplete coverage), it prompts for additional photos until the threshold is met. This builds quality control into the UX rather than catching errors downstream.

**Visual Audit Trail:**
Using Supervision for post-processing, the final PDF overlays sequential ID numbers on actual photos, giving moving companies and customers a visual reference for every logged item. This reduces disputes and builds trust.

**Industry Standards Compliance:**
CFT calculations follow 400N moving tariffs, ensuring quotes align with industry pricing standards and making integration with existing moving company workflows seamless.

## Project Classification

**Technical Type:** web_app  
**Domain:** general (logistics operations)  
**Complexity:** medium  
**Project Context:** Greenfield - new product (POC phase)

**Classification rationale:**

-   Browser-based link delivery and real-time AI processing → web_app
-   Moving industry domain with operational focus, no heavy regulatory constraints → general
-   AI vision integration, confidence validation loops, and industry standard calculations → medium complexity
-   POC-first approach validates core AI accuracy before building multi-tenant SaaS platform in future phases

**Future evolution:** This POC will validate the core AI survey engine. Phase 2 will evolve into a multi-tenant SaaS platform (saas_b2b) with company dashboards, custom branding, subscription + per-survey pricing, and CRM integrations.

## Success Criteria

### User Success

**For Homeowners (Photo-Takers):**

Success means completing the survey without friction or pressure:

-   **Avoiding pain**: No aggressive sales calls or phone pressure - just follow AI instructions, complete the audit, and submit
-   **Confidence at completion**: Receive end-of-session report showing what was captured, confirming "survey complete, moving company will receive your inventory"
-   **Outcome feeling**: Walk away confident they've provided sufficient information for an accurate estimate without having to explain anything over the phone

**Measurable indicators:**

-   Homeowner can complete survey **without needing phone support**
-   End-of-session confidence measured by:
    -   Number of modifications homeowner makes post-session (lower is better)
    -   Survey abandonment rate before submission (target: <10% abandonment)

**For Moving Company Staff (Reviewers):**

Success means trusting the AI output enough to quote from it:

-   **Opening the PDF**: See detailed, organized inventory split by room/space with rich metadata (estimated weight, volume, material, AI caveats/concerns)
-   **Visual proof**: Numbered items overlaid on photos provide reasoning/verification for each logged item
-   **Efficiency gain**: Drastically reduced phone time clarifying details with customers
-   **Quote generation**: Can review and generate quote **within 10 minutes** of receiving PDF

**Trust-building elements:**

-   Visual audit trail (numbered items on photos like Yembo)
-   AI reasoning transparency (notes, caveats, confidence levels)
-   Metadata richness (not just "dresser" but "6-drawer dresser, oak, ~150 lbs")

### Business Success

**POC Success Gate (3-Month Target):**

The POC proves market viability when:

-   **5 active moving companies** are using surveyor regularly
-   **Renewal signal**: Companies want to continue using it (willingness to pay when SaaS launches)
-   **Accuracy validation**: 96%+ overall accuracy maintained in real-world usage
-   **UX validation**: 90%+ homeowner completion rate (minimal abandonment)

**This combination proves both market demand and technical feasibility, justifying Phase 2 SaaS investment.**

**Kill Criteria:**

The POC fails if:

-   **Accuracy below target**: AI cannot maintain 96%+ overall accuracy or makes too many errors on high-impact items
-   **UX breaks down**: Homeowner completion rate falls below 90% or satisfaction drops significantly
-   **No market demand**: Unable to acquire 5 active moving companies within 3 months

### Technical Success

**Non-Negotiable Requirements:**

1. **AI Accuracy (Mission-Critical):**

    - **Overall accuracy**: 96%+ across all items
    - **High-impact items** (furniture, appliances, heavy items): ~99%+ accuracy - these drive CFT calculations and pricing, near-zero errors acceptable
    - **Miscellaneous items** (lamps, boxes, small decor): 90-95% accuracy acceptable - minor errors don't materially affect quotes
    - **Impact hierarchy**: Missing/misidentifying a dresser destroys margin; missing a lamp is acceptable noise

2. **Photo Quality Handling:**

    - AI actively requests better lighting or different angles when photo quality is insufficient
    - Target demographic: Modern smartphones (2026 standards) - not supporting outdated camera technology
    - System guides user to capture quality photos rather than accepting poor inputs

3. **Survey Length Tolerance:**

    - Must handle any house size (10 items or 200+ items across multiple rooms)
    - For lengthy surveys: AI provides encouragement, jokes, or comforting conversation to maintain engagement
    - No artificial upper bounds on inventory size

4. **System Reliability:**

    - **Uptime target**: 99.999% on surveyor platform (excluding Gemini API dependency)
    - Gemini API availability acknowledged as external dependency
    - PDF generation speed: Not a concern (typically very fast)

5. **Processing Pipeline:**
    - Link delivery → AI-guided photo audit → Satisfactory Check validation → PDF generation with numbered overlays & CFT calculations
    - Each room/space must complete Satisfactory Check before proceeding
    - Real-time feedback to user on quality and completeness

### Measurable Outcomes

**POC Success Metrics:**

| Metric                    | Target          | Measurement Method                                    |
| ------------------------- | --------------- | ----------------------------------------------------- |
| Homeowner completion rate | 90%+            | Sessions started vs. surveys submitted                |
| Overall AI accuracy       | 96%+            | Post-survey validation by moving companies            |
| High-impact item accuracy | 99%+            | Manual audit of furniture/appliance identification    |
| Active company adoption   | 5 companies     | Companies processing surveys regularly                |
| Review-to-quote time      | <10 minutes     | Moving company staff feedback (post-POC survey)       |
| Renewal intent            | Positive signal | Companies express willingness to pay for SaaS version |

**Validation Methods:**

-   **Accuracy**: Post-POC survey with moving companies on correction frequency
-   **Completion rate**: Analytics tracking session starts vs. successful submissions
-   **Homeowner confidence**: Track post-session modification rate and abandonment rate
-   **Staff efficiency**: Post-POC interviews/surveys with moving company staff

## Product Scope

### MVP - Minimum Viable Product (POC Phase)

**Core Flow (Must Work):**

1. **Link delivery**: Moving company sends link to homeowner (SMS/email)
2. **AI-guided photo audit**: Browser-based interface with room-by-room guidance
3. **Satisfactory Check loop**: AI validates confidence before advancing to next space
4. **Dimension & material estimation**: AI analyzes photos to estimate weight, volume, material properties
5. **PDF generation**: Professional inventory document with:
    - Sequential ID numbers overlaid on photos (Supervision post-processing)
    - Detailed item list organized by room/space
    - Metadata per item: weight, volume, material, AI notes/caveats
    - CFT calculations per 400N moving tariff standards
6. **End-of-session report**: Brief summary shown to homeowner confirming completion

**Technical Stack (POC):**

-   Gemini 2.5/3 Flash for vision and object detection
-   Supervision for visual markup (numbered overlays)
-   Browser-based web app (no native apps)
-   PDF generation engine
-   Simple link-based delivery (no auth/multi-tenancy yet)

**Out of Scope for POC:**

-   Multi-tenant platform
-   Moving company dashboards
-   Custom branding per company
-   Subscription/billing infrastructure
-   CRM integrations
-   User authentication (beyond simple link access)

**POC Assumption:** "If we can execute the core flow above, we've successfully built the engine and validated technical feasibility."

### Growth Features (Phase 2 - Post-POC SaaS)

**Multi-Tenant SaaS Platform:**

-   Moving company account management
-   Custom branding per tenant (colors, logo, domain)
-   Admin dashboards for moving companies:
    -   View all surveys submitted by their customers
    -   Audit inventory details (not just PDF, but interactive data)
    -   Review and modify AI-generated inventories
-   Subscription + per-survey pricing model
-   Usage analytics and reporting

**Integration & Operations:**

-   CRM integrations (sync customer data, survey results)
-   Scheduling system (coordinate survey timing with customer)
-   Inventory management tools
-   Quote generation workflow tools
-   API for third-party integrations

**Enhanced Features:**

-   Moving company staff can review/edit inventories in platform before generating final PDF
-   Customer management (track multiple surveys per customer, history)
-   Team collaboration (multiple staff reviewing same survey)

### Vision (Future State)

**Long-Term Possibilities:**

-   Elastic pricing/auto-quote generation (AI calculates quote automatically based on inventory + tariffs)
-   Further automation to eliminate admin work for moving companies
-   Additional integrations and workflow optimizations

**Note:** Vision details intentionally left undefined - too early in POC phase to commit to specific long-term features. Phase 2 SaaS scope should be informed by POC learnings and market feedback.

## User Journeys

### Journey 1: Sarah Chen - The Stressed Homeowner

Sarah is moving her family from Chicago to Denver in 6 weeks. She's juggling a new job start date, getting the kids enrolled in new schools, and coordinating the move logistics. She's contacted 4 moving companies through their websites, submitting quote request forms with her email and phone number.

Within an hour, the calls start. One company is particularly aggressive - calling three times in one day, pushing for an in-home visit "this week or we can't guarantee availability." Another offers a "quick phone estimate" but asks her to walk through every room while verbally describing furniture dimensions ("How tall is your dresser? What about your bookshelf?"). She feels overwhelmed and unprepared - how is she supposed to know these measurements off the top of her head?

Then she gets a text from MoveFast Co: "Thanks for your interest! Click this link to complete a quick photo survey and we'll have your estimate by tomorrow morning: [link]"

Sarah clicks the link during her lunch break. A friendly AI interface greets her: "Let's walk through your home together. We'll start with the living room - just follow my guidance and take photos of your furniture. I'll let you know when we have what we need."

The AI is patient and specific: "Great shot of the sofa! Now let's get the entertainment center - make sure I can see all the shelves." When lighting is poor, it gently asks for another angle. When she forgets to photograph the coffee table, it prompts: "I don't see a coffee table yet - is there one in this room?"

Twenty minutes later, she's photographed every room. The AI shows her a brief summary: "Survey complete! We've logged 47 items across 6 rooms including your 3-bedroom furniture, kitchen items, and garage storage. MoveFast Co will receive your detailed inventory and contact you with a quote within 24 hours."

Sarah feels relieved. No scheduling. No aggressive sales pitch. No trying to estimate furniture dimensions over the phone. She's confident she gave them accurate information, and now she can focus on the 50 other things on her moving checklist.

### Journey 2: Marcus Rodriguez - The Quote-Pressed Moving Coordinator

Marcus works as a moving coordinator for MoveFast Co. It's peak season (July), and he's drowning in quote requests. His typical day involves either:

-   **Option A**: Scheduling and completing 3-4 in-home visits, which means driving across town, 45-60 minutes per home, manually noting items, then returning to the office to calculate CFT and generate quotes. Total time: 6-8 hours for 3 quotes.
-   **Option B**: Phone estimates where customers guess their furniture sizes and Marcus hopes for the best. Fast quotes (30 min each), but last month they had 3 jobs where actual volume exceeded estimates by 30%+ - bleeding profit margin.

His boss just implemented this new AI survey tool. Marcus is skeptical - "How good can photos really be?"

At 2 PM, he receives an email: "New Survey Complete - Sarah Chen - Chicago to Denver move." He opens the PDF attachment.

The first thing he notices: **numbered items overlaid on actual photos**. Item #1 is a large sectional sofa with a clear tag: "L-shaped sectional, fabric, estimated 85 cubic feet, ~250 lbs, NOTE: Check for disassembly requirements."

He scrolls through the document. It's organized by room:

-   **Living Room**: 8 items with photos and metadata
-   **Master Bedroom**: 12 items including detailed dresser specs ("6-drawer oak dresser, 60"W x 18"D x 48"H, ~180 lbs")
-   **Kitchen**: Boxes and small appliances with AI notes ("Customer indicated 15 moving boxes")

Marcus cross-references a few items. Photo #15 shows a dining table - the AI identified it as "rectangular wood dining table, seats 6, estimated 40 CFT." Looking at the photo with the numbered overlay, Marcus can see the table dimensions look right. The legs are visible, finish is clear.

He spots one potential issue: Item #23 (a large armoire) has a note: "CAVEAT: Could not clearly see back panel - may require verification if structural integrity is concern." Smart - the AI is flagging uncertainty rather than guessing.

Eight minutes later, Marcus has reviewed the entire inventory, verified the CFT calculations (totaling 847 CFT), and generated a quote. He sends it to Sarah that afternoon.

No phone calls needed. No follow-up questions about "how big is your couch?" No margin risk from underestimation. Marcus realizes he just quoted a move in under 10 minutes with confidence he's never had from phone estimates.

### Journey Requirements Summary

**From Sarah's Journey (Homeowner Experience):**

-   Link-based access with no account creation friction
-   Room-by-room AI guidance with clear, specific instructions
-   Photo quality validation and re-request capability
-   Item completeness checking per room (Satisfactory Check loop)
-   End-of-session summary report for homeowner confidence
-   Mobile-optimized browser interface (lunch break use case)
-   Patient, conversational AI tone to reduce stress

**From Marcus's Journey (Moving Company Staff Experience):**

-   Professional PDF output with numbered photo overlays (Supervision post-processing)
-   Metadata per item: dimensions, weight, material, CFT calculation
-   AI caveat/confidence notes when certainty is low
-   Room-by-room organization in output document
-   CFT calculations following 400N tariff standards
-   Visual proof (photos) for verification/trust building
-   Email delivery of completed survey to moving company
-   Quick review workflow (<10 min target)

## Innovation & Novel Patterns

### Detected Innovation Areas

**surveyor** represents a **market democratization innovation** - leveraging modern LLM infrastructure to deliver enterprise-grade AI survey capabilities at a price point accessible to mid-market moving companies.

**Innovation Pattern: Infrastructure-Enabled Democratization**

Existing solutions like Yembo invested millions in proprietary computer vision R&D to serve enterprise moving companies. **surveyor** bypasses this R&D barrier by building on Gemini 2.5/3 Flash - a commodity LLM infrastructure with state-of-the-art vision capabilities.

**Key Innovation Aspects:**

1. **Cost Collapse Through Modern Infrastructure**

    - Yembo's economics: Subscription + per-survey fees (enterprise pricing, exact figures not public)
    - surveyor's target: $0.10 per survey baseline (flexible upward for quality requirements)
    - Cost advantage: Eliminating millions in proprietary R&D by using existing LLM infrastructure

2. **Market Expansion Through Accessibility**

    - Yembo serves: Large enterprise moving companies who can afford R&D-backed pricing
    - surveyor targets: Mid-market regional/local moving companies previously priced out of AI survey technology
    - Unlocking the "long tail" of moving companies who couldn't justify existing enterprise solutions

3. **Quality Parity Without Proprietary Tech**
    - Target: 96%+ accuracy matching enterprise solutions
    - Approach: Agent-based confidence validation (Satisfactory Check) + modern vision models
    - Economics flexibility: Willing to increase cost-per-survey (above $0.10) to maintain quality standards

**Technical Architecture as Enabler:**

The innovation isn't inventing AI moving surveys - it's recognizing that modern LLM infrastructure (Gemini 2.5/3) has reached sufficient capability to deliver enterprise-grade results without custom R&D investment. This enables a **new price point** that opens a **new market segment**.

### Market Context & Competitive Landscape

**Existing Enterprise Solution:**

-   **Yembo**: Established player serving large moving companies with proprietary video-based AI surveys
-   Pricing model: Subscription + per-survey fees (enterprise-oriented, not publicly disclosed)
-   Market position: Serves big players who can afford R&D-backed technology investment

**surveyor's Market Position:**

-   **Target segment**: Mid-market moving companies (regional/local operators)
-   **Value proposition**: Enterprise-grade AI survey accuracy at dramatically lower cost
-   **Competitive angle**: Not competing directly with Yembo for enterprise accounts - expanding the market downward to previously underserved segment

**Market Expansion Logic:**

The moving industry has a long tail of mid-size operators who face the same speed-vs-accuracy dilemma as enterprise companies but lack the budget for enterprise AI solutions. By collapsing the cost structure through modern LLM infrastructure, surveyor makes AI surveys economically viable for this underserved segment.

**Analogous Success Patterns:**

-   AWS democratized infrastructure (vs. building your own data centers)
-   Stripe democratized payment processing (vs. merchant accounts and custom integrations)
-   Twilio democratized communications (vs. telecom infrastructure)
-   **surveyor democratizes AI moving surveys** (vs. millions in proprietary CV R&D)

### Validation Approach

**Quality Validation (Mission-Critical):**

Since the innovation claims "quality parity at fraction of cost," accuracy validation is essential:

1. **POC Success Gate**: 96%+ overall accuracy, ~99%+ on high-impact items
2. **Comparison Benchmark**: If possible, run same-home comparisons (Yembo survey vs. surveyor survey vs. actual move)
3. **Moving Company Trust**: 5 active companies willing to renew signals quality meets real-world needs
4. **Cost-Quality Tradeoff**: Monitor actual cost-per-survey during POC - willing to increase above $0.10 baseline if needed for quality

**Market Validation:**

1. **Mid-market adoption**: Can we acquire 5 mid-market moving companies within 3 months?
2. **Price sensitivity**: Do mid-market movers value the lower cost enough to switch from phone estimates or forego enterprise solutions?
3. **Retention signal**: Do they want to keep using it (willingness to pay for SaaS)?

**Economic Validation:**

1. **Cost structure sustainability**: At what volume does $0.10-$0.50 per survey remain profitable?
2. **Gemini API dependency**: Monitor Gemini pricing stability and performance reliability
3. **Quality cost ceiling**: What's the maximum cost-per-survey where economics still work for mid-market?

### Risk Mitigation

**Innovation Risks & Mitigation Strategies:**

1. **Risk: Gemini performance doesn't match proprietary CV quality**

    - Mitigation: POC explicitly tests 96%+ accuracy target before scaling
    - Fallback: Increase cost-per-survey to use more expensive models or hybrid approaches
    - Validation: Post-POC accuracy audit with moving company feedback

2. **Risk: Yembo lowers pricing to defend against democratization**

    - Mitigation: surveyor's cost structure (no R&D debt) allows flexibility to compete on price
    - Market differentiation: Focus on mid-market segment Yembo doesn't prioritize
    - Speed advantage: Faster to market using existing infrastructure vs. building proprietary tech

3. **Risk: Gemini API pricing increases or availability issues**

    - Mitigation: Architecture designed to be model-agnostic (can swap to Claude, GPT-4V, etc.)
    - Monitoring: Track Gemini pricing and performance during POC
    - Contingency: Build multi-model fallback strategy before Phase 2 SaaS

4. **Risk: Mid-market movers don't adopt new technology**

    - Mitigation: POC validates adoption with 5 companies before committing to full SaaS build
    - Alternative: If mid-market doesn't adopt, pivot to smaller companies or adjacent markets (storage, warehouse management)

5. **Risk: Quality ceiling below enterprise parity**
    - Mitigation: Satisfactory Check loop actively improves input quality (vs. passive video capture)
    - Flexibility: Cost-per-survey can increase to 5x baseline ($0.50) and still be economically attractive vs. enterprise solutions
    - Reality check: POC kill criteria explicitly includes "accuracy below target"

## Web App Specific Requirements

### Project-Type Overview

**surveyor** is a **Next.js-based web application** delivering a conversational AI-guided photo survey experience. The architecture prioritizes real-time voice interaction while gracefully degrading to text-based guidance for users with poor network connectivity.

### Technical Architecture Considerations

**Application Architecture:**

-   **Framework**: Next.js (React-based)
    -   SPA capabilities for smooth room-to-room transitions
    -   Server-side rendering support for future landing page SEO (Phase 2)
    -   API routes for backend integration with Gemini and PDF generation
-   **Deployment**: Browser-based, link-accessed (no app store distribution)
-   **Session model**: Stateful survey sessions with progress persistence

**Browser Support Matrix:**

-   **Target**: Modern evergreen browsers (latest versions)
    -   Chrome/Chromium (desktop and mobile)
    -   Safari (desktop and iOS - critical for iPhone users)
    -   Firefox (desktop and mobile)
    -   Edge (desktop)
-   **Mobile-first priority**: Majority of homeowners will use smartphones
-   **No legacy browser support**: No IE11, no Safari <14

### Real-Time Conversational Architecture

**Voice Communication System:**

The core survey experience is a **real-time conversational interface** where AI guides the homeowner through the survey via voice with visual elements.

**Primary Voice Flow:**

1. **Session initiation**: AI introduces itself via voice
    - "Hi, I'm your moving survey assistant. Is this for a residential or office move?"
2. **Information gathering**: AI asks questions and provides instructions
    - "How many rooms do we need to survey?"
    - "Let's start with the living room. Here are examples of good photos..."
3. **Interactive guidance**: Homeowner can interrupt and ask clarifications
    - User: "Wait, should I include the garage?"
    - AI: "Yes, we'll get to the garage after the main rooms..."
4. **Photo feedback**: AI provides real-time feedback on captured photos
    - "Great shot of the sofa! Now let's get the entertainment center..."
    - "I can't see the back of that shelf - can you take another photo from a different angle?"

**Technical Implementation:**

**Real-Time Audio Streaming:**

-   **Primary**: WebRTC for low-latency bidirectional audio
-   **Fallback**: WebSocket for audio streaming if WebRTC unavailable
-   **Interrupt detection**: System detects when user starts speaking and pauses AI output
-   **Audio permissions**: Request microphone access at session start (critical UX moment)

**Multimodal AI Integration:**

-   **Gemini 2.5/3 Flash** handles both voice interaction AND photo analysis in same session
-   Voice input → Gemini speech recognition
-   AI responses → Gemini voice synthesis
-   Photo analysis → Gemini vision capabilities
-   Single model for consistency and context retention across modalities

**Network Resilience & Graceful Degradation:**

**Poor Connectivity Handling:**

Homeowners in rural areas or with poor mobile bandwidth may not sustain real-time voice streaming. The system must gracefully degrade:

1. **Connectivity Detection**: Monitor WebRTC/WebSocket connection quality
2. **Automatic Degradation**: If real-time audio cannot be sustained:
    - Automatically switch to text-only chat interface
    - Display clear warning: "Voice is unavailable due to connection. Proceeding with text guidance."
    - Maintain conversational flow with text-based Q&A
3. **User Override**: Allow users to manually switch to text mode if they prefer
4. **Completion Rate Protection**: Text fallback ensures poor connectivity doesn't block survey completion (90%+ target)

**Bandwidth Requirements:**

-   **Voice streaming**: ~50-100 kbps for audio
-   **Photo uploads**: Variable based on image size (1-5 MB per photo)
-   **Session state sync**: Minimal overhead (<10 KB)
-   **Total**: Monitor and optimize for users on 3G/4G mobile connections

### Responsive Design & Mobile Optimization

**Mobile-First Design:**

-   **Primary device**: Smartphones (homeowners surveying their homes)
-   **Orientation**: Portrait mode primary, landscape supported
-   **Photo capture**: Native browser camera API integration
-   **Touch interactions**: Large tap targets, swipe gestures for navigation
-   **Keyboard avoidance**: Minimal text input (voice-first approach reduces typing)

**Responsive Breakpoints:**

-   Mobile (320px - 767px): Primary focus
-   Tablet (768px - 1023px): Supported
-   Desktop (1024px+): Supported (less common use case)

### Performance Targets

**Key Performance Metrics:**

| Metric                    | Target     | Rationale                                      |
| ------------------------- | ---------- | ---------------------------------------------- |
| Time to Interactive (TTI) | <3 seconds | Users click link and expect immediate response |
| Voice latency             | <500ms     | Conversational feel requires low audio delay   |
| Photo upload time         | <5 seconds | Per photo on 4G connection                     |
| AI response time          | <2 seconds | Photo analysis + Satisfactory Check feedback   |
| Session recovery          | <1 second  | If user loses connection and returns           |

**Performance Optimizations:**

-   Progressive photo uploads (don't wait for all photos before processing)
-   Optimistic UI updates (show feedback while processing in background)
-   Connection state persistence (save progress locally, sync when online)

### SEO Strategy

**POC Scope:**

-   **Survey tool itself**: No SEO required (users arrive via direct link)
-   **Search indexing**: Survey session pages should NOT be indexed (use `noindex` meta tags)
-   **Link access**: SMS/email → direct URL → survey session

**Future (Phase 2 Landing Page):**

-   Marketing landing page will require SEO optimization
-   Out of scope for POC

### Accessibility Requirements

**WCAG 2.1 Level AA Compliance:**

**Voice Interface Accessibility:**

-   **Alternative input**: Text-based interface available for users who cannot use voice
-   **Captions**: Display text captions of AI voice instructions (deaf/hard-of-hearing users)
-   **Screen reader support**: Ensure text fallback mode works with screen readers
-   **Keyboard navigation**: All interactions possible without mouse/touch

**Visual Accessibility:**

-   **Color contrast**: Minimum 4.5:1 for text, 3:1 for UI components
-   **Focus indicators**: Clear keyboard focus states
-   **Semantic HTML**: Proper heading hierarchy, landmark regions
-   **Alt text**: Provide meaningful descriptions for visual examples

**Photo Capture Accessibility:**

-   **Camera permissions**: Clear explanation why camera access is needed
-   **Photo review**: Allow users to review and retake photos
-   **Descriptive feedback**: AI feedback must be clear in both voice and text

### Implementation Considerations

**Technical Stack:**

-   **Frontend**: Next.js 14+ (React, TypeScript)
-   **Styling**: Tailwind CSS or similar for responsive design
-   **State Management**: React Context or Zustand for session state
-   **Audio**: WebRTC via browser APIs, WebSocket fallback
-   **AI Integration**: Gemini 2.5/3 Flash API
-   **PDF Generation**: Server-side (Puppeteer, PDFKit, or similar)
-   **Image Processing**: Supervision library for numbered overlays
-   **Deployment**: Vercel, Netlify, or AWS (serverless-friendly)

**Security Considerations:**

-   **HTTPS only**: Required for camera and microphone access
-   **No authentication POC**: Simple link-based access (unique session IDs)
-   **Data privacy**: Temporary storage of photos and voice data (deletion after PDF generation)
-   **Rate limiting**: Prevent abuse of AI API endpoints

**Session Management:**

-   **Session persistence**: Save progress in case of interruption
-   **Resume capability**: Allow user to return to incomplete survey via link
-   **Timeout handling**: Define session expiration (24 hours? 7 days?)
-   **Abandonment tracking**: Monitor where users drop off for UX improvements

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach: Problem-Solving + Experience Hybrid**

The POC must simultaneously validate **two critical assumptions**:

1. **Technical feasibility**: Can Gemini 2.5/3-based AI achieve 96%+ accuracy matching enterprise solutions?
2. **Market adoption**: Will mid-market moving companies trust and adopt AI surveys at this price point?

These questions cannot be answered separately - accuracy without adoption proves nothing, and adoption without accuracy validation is premature. The MVP must deliver the complete end-to-end experience with quality controls intact.

**POC Success Criteria Recap:**

-   5 active mid-market moving companies using surveyor regularly
-   96%+ overall accuracy, ~99%+ on high-impact items
-   90%+ homeowner completion rate
-   Renewal signal (willingness to pay for SaaS version)

**Resource Requirements (POC):**

-   **Team size**: 2-3 engineers (full-stack with AI/ML experience)
-   **Timeline**: 8-12 weeks to functional POC
-   **Infrastructure**: Gemini API access, hosting (Vercel/AWS), PDF generation
-   **Validation**: 5 pilot moving companies (mid-market, regional/local)

### MVP Feature Set (Phase 1 - POC)

**Core User Journeys Supported:**

1. **Homeowner Journey (Sarah)**:

    - Receives link via SMS/email → clicks to start survey
    - Voice-guided AI conversation (real-time via WebRTC)
    - Room-by-room photo capture with AI guidance
    - Satisfactory Check loop per space (AI won't advance until confident)
    - **User audit/review** before submission (critical for trust)
    - End-of-session summary confirming completion
    - Survey submitted to moving company

2. **Moving Company Staff Journey (Marcus)**:
    - Receives email notification of completed survey
    - Opens PDF with numbered photo overlays (Supervision)
    - Reviews detailed inventory with metadata (dimensions, weight, material, CFT)
    - Verifies accuracy using visual proof (photos with overlays)
    - Generates quote in <10 minutes
    - Sends quote to homeowner

**Must-Have Capabilities (POC):**

**1. Real-Time Voice Interface:**

-   WebRTC bidirectional audio for conversational AI
-   Voice input → Gemini speech recognition
-   Voice output → Gemini speech synthesis
-   Interrupt detection (user can ask questions anytime)
-   Visual elements (examples, instructions) alongside voice

**2. AI-Guided Photo Audit:**

-   Native browser camera API integration (mobile-first)
-   Room-by-room guidance with clear instructions
-   Real-time photo quality validation
-   Satisfactory Check agent-based confidence validation
-   AI requests retakes for poor lighting, missing items, unclear angles

**3. Dimension & Material Estimation:**

-   Gemini vision analysis per photo
-   Item identification with confidence scoring
-   Estimated dimensions (W x D x H)
-   Estimated weight and material properties
-   CFT calculations per 400N moving tariffs
-   AI caveat notes when confidence is low

**4. User Audit & Review:**

-   Before submission: Show homeowner complete inventory captured
-   Allow review/edit/add/remove items
-   Confirm submission explicitly ("Send to MoveFast Co?")
-   **Critical for trust**: Users must see and approve what's being sent

**5. Professional PDF Generation:**

-   Server-side PDF generation with Supervision overlays
-   Numbered items on photos (visual proof)
-   Room-by-room organization
-   Detailed metadata per item
-   CFT totals and summaries
-   Email delivery to moving company

**6. Session Management:**

-   Unique session IDs per link
-   Progress tracking (which rooms completed)
-   Basic error handling and recovery
-   Session expiration (TBD: 24-48 hours?)

**Out of Scope for POC:**

-   ❌ Text fallback for poor connectivity (deferred to Phase 2 - **must implement before production launch**)
-   ❌ Session resume after interruption (users must complete in one sitting for POC)
-   ❌ Multi-tenant platform (single-instance deployment for POC)
-   ❌ Moving company dashboards (PDF email only for POC)
-   ❌ Custom branding per company (generic surveyor branding for POC)
-   ❌ Authentication/user accounts (link-based access only)
-   ❌ CRM integrations (manual process for POC)
-   ❌ Analytics dashboard (track metrics manually for POC)
-   ❌ Manual item editing by moving company staff (they work with PDF as-is for POC)

### Post-MVP Features

**Phase 2 (Production Launch - Post-POC):**

**Network Resilience (Critical for Production):**

-   Text fallback for poor connectivity (**must have**)
-   Automatic degradation with clear warnings
-   Session resume after interruption
-   Offline-first architecture with sync

**Multi-Tenant SaaS Platform:**

-   Company account management and onboarding
-   Custom branding per tenant (logo, colors, domain)
-   Admin dashboards for moving companies:
    -   View all customer surveys
    -   Audit and edit inventories before finalizing PDF
    -   Review analytics (completion rates, accuracy metrics)
-   Subscription + per-survey billing
-   Usage analytics and reporting

**Enhanced User Experience:**

-   Customer management (track multiple surveys per customer)
-   Survey history and comparison
-   Manual item adjustment by moving company staff
-   Quote generation workflow integration

**Integrations:**

-   CRM integrations (Salesforce, HubSpot, etc.)
-   Scheduling systems
-   Payment processing (if offering paid surveys)
-   Webhook APIs for third-party integrations

**Phase 3 (Expansion - Future Vision):**

**Automation & Intelligence:**

-   Elastic pricing/auto-quote generation (AI calculates quote automatically)
-   Predictive volume estimation based on historical data
-   Anomaly detection (flag unusual items or volumes)

**Market Expansion:**

-   Adjacent markets: storage facilities, warehouse inventory management
-   International expansion with multi-language support
-   Enterprise features for large moving companies (Yembo's territory)

**Advanced Features:**

-   3D room scanning (if device capabilities improve)
-   AR visualization of packed truck (show spatial optimization)
-   Integration with moving company operations (scheduling, dispatch, tracking)

**Note:** Phase 3 features intentionally left high-level. POC learnings and Phase 2 adoption will inform specific priorities.

### Risk Mitigation Strategy

**Technical Risks:**

1. **Risk: Gemini voice+vision accuracy insufficient for 96% target**

    - **Mitigation (POC)**: Early technical spike to validate Gemini capabilities before full build
    - **Fallback**: Increase cost-per-survey using more expensive models or hybrid approach
    - **Validation**: Weekly accuracy audits during POC with pilot companies

2. **Risk: Real-time voice UX too complex for homeowners**

    - **Mitigation**: UX testing with 5-10 users before pilot launch
    - **Fallback**: Simplify to text-first with optional voice enhancement
    - **Validation**: Track completion rate and abandonment points during POC

3. **Risk: WebRTC/voice infrastructure unreliable**
    - **Mitigation**: Test across devices and browsers before pilot
    - **Fallback**: Degrade gracefully (though not implemented in POC, architecture supports it)
    - **Validation**: Monitor connection failures and latency during POC

**Market Risks:**

1. **Risk: Mid-market movers don't trust AI survey output**

    - **Mitigation**: Visual proof (numbered overlays) + AI caveat notes build trust
    - **Validation**: Survey pilot companies on trust and willingness to quote from AI output
    - **Fallback**: Offer hybrid model (AI survey + human verification for first 10 surveys)

2. **Risk: Can't acquire 5 pilot companies within 3 months**

    - **Mitigation**: Start outreach during development, pre-sell POC access
    - **Validation**: Confirm 2-3 companies committed before completing POC build
    - **Fallback**: Pivot to smaller movers or adjacent markets (storage, warehouses)

3. **Risk: Homeowners prefer traditional phone/in-person estimates**
    - **Mitigation**: POC tracks completion rate as key metric (90%+ target)
    - **Validation**: User feedback collection during and after surveys
    - **Fallback**: Position as "option" not replacement - moving companies offer both

**Resource Risks:**

1. **Risk: POC takes longer than 12 weeks to build**

    - **Mitigation**: Ruthless scope discipline - nothing beyond must-haves
    - **Fallback**: Launch with single-room surveys first, expand to full-home later
    - **Validation**: Weekly sprint reviews to track velocity

2. **Risk: Team size insufficient (need more than 2-3 engineers)**

    - **Mitigation**: Pre-built infrastructure (Next.js, Gemini API, Supervision library)
    - **Fallback**: Use no-code/low-code tools for non-critical POC components
    - **Validation**: Technical feasibility assessment before committing to timeline

3. **Risk: Gemini API costs exceed budget**
    - **Mitigation**: Monitor per-survey costs daily during POC
    - **Validation**: Calculate unit economics after first 20 surveys
    - **Fallback**: Optimize prompts, reduce multimodal calls, or increase pricing

## Functional Requirements

### Survey Session Management

-   **FR1**: Homeowner can access a survey session via unique link without authentication
-   **FR2**: System can initiate a new survey session when homeowner clicks link
-   **FR3**: System can track survey progress across multiple rooms
-   **FR4**: Homeowner can see which rooms have been completed and which remain
-   **FR5**: System can expire inactive sessions after defined timeout period
-   **FR6**: System can generate unique session identifiers for each survey

### Voice-Guided Interaction

-   **FR7**: Homeowner can communicate with AI guide via voice input
-   **FR8**: AI guide can provide voice instructions and guidance throughout survey
-   **FR9**: Homeowner can interrupt AI guide to ask clarification questions
-   **FR10**: AI guide can respond to homeowner questions in real-time
-   **FR11**: System can display text captions of AI voice instructions for accessibility
-   **FR12**: Homeowner can manually switch to text-only mode at any time
-   **FR13**: System can detect when voice streaming is unavailable and automatically switch to text mode
-   **FR14**: System can request microphone permissions from homeowner's browser

### Photo Capture & Analysis

-   **FR15**: Homeowner can capture photos using device camera through browser
-   **FR16**: System can access native device camera API for photo capture
-   **FR17**: AI can analyze photos in real-time to identify items and estimate properties
-   **FR18**: AI can detect photo quality issues (poor lighting, unclear angles, blurriness)
-   **FR19**: AI can request retake of photos that don't meet quality standards
-   **FR20**: AI can identify furniture, appliances, boxes, and household items from photos
-   **FR21**: AI can estimate item dimensions (width, depth, height) from photos
-   **FR22**: AI can estimate item weight based on visual analysis
-   **FR23**: AI can identify item material properties (wood, metal, fabric, etc.)
-   **FR24**: AI can calculate cubic feet (CFT) per item using 400N moving tariff standards

### Quality Control & Validation

-   **FR25**: AI can perform Satisfactory Check validation before advancing to next room
-   **FR26**: AI can determine confidence level for each identified item
-   **FR27**: AI can prevent progression to next room until current room meets confidence threshold
-   **FR28**: AI can flag items with low confidence and add caveat notes
-   **FR29**: AI can prompt homeowner for additional photos when completeness is uncertain
-   **FR30**: AI can verify all major furniture items have been captured before room completion
-   **FR61**: AI can proactively prompt for commonly missed spaces (garage, attic, basement, storage shed, outdoor items) at end of survey
-   **FR62**: AI can verbally confirm no additional items exist in commonly overlooked areas before survey completion

### Inventory Management & Review

-   **FR31**: Homeowner can review complete captured inventory before submission
-   **FR32**: Homeowner can add items that were missed during photo capture
-   **FR33**: Homeowner can remove items that were incorrectly identified
-   **FR34**: Homeowner can edit item details (name, quantity, description)
-   **FR35**: System can organize inventory by room/space for clarity
-   **FR36**: System can display item metadata (dimensions, weight, material, CFT) to homeowner during review
-   **FR37**: Homeowner can explicitly confirm submission to moving company
-   **FR38**: System can show end-of-session summary with item count and room count

### PDF Generation & Delivery

-   **FR39**: System can generate professional PDF inventory document from captured survey data
-   **FR40**: System can overlay sequential ID numbers on photos using Supervision library
-   **FR41**: PDF can display numbered items with corresponding photos for visual verification
-   **FR42**: PDF can organize inventory by room/space with clear section headers
-   **FR43**: PDF can include detailed metadata per item (dimensions, weight, material, CFT, AI notes)
-   **FR44**: PDF can display total CFT calculations and summary statistics
-   **FR45**: PDF can include AI caveat notes for items flagged with low confidence
-   **FR46**: System can email completed PDF to moving company upon survey submission

### Moving Company Integration

-   **FR47**: Moving company staff can receive email notification when survey is completed
-   **FR48**: Moving company staff can access PDF inventory document via email
-   **FR49**: Moving company can provide unique survey links to their customers
-   **FR50**: System can associate survey session with specific moving company for delivery

### Lead Capture & Mobile Handoff

-   **FR63**: Provide a per–moving company public link intended for their customers (company distribution link).
-   **FR64**: Visiting the company distribution link displays a lightweight lead form requesting customer phone number, email, and name with validation.
-   **FR65**: On successful submission, the system generates a unique survey session link for that customer.
-   **FR66**: The system sends the survey link to the provided phone number via SMS; email can be used as a fallback or secondary delivery.
-   **FR67**: If the lead form is accessed on a desktop-class device, the confirmation screen shows a QR code that encodes the mobile survey link so users can seamlessly continue on their phone.
-   **FR68**: Opening the survey link on mobile deep-links into the survey start flow and associates the session with the submitted contact details (no re-entry required).
-   **FR69**: Apply rate limiting and basic bot protection (e.g., CAPTCHA) on the lead form to prevent abuse.
-   **FR70**: Validate phone number format with country-aware rules (default to US) and provide clear error messages.
-   **FR71**: Display consent/terms notices as required for messaging (e.g., “By submitting, you agree to receive a text message with your survey link.”).
-   **FR72**: Allow company-level configuration of SMS template/branding and option to enable/disable QR code display on desktop confirmation.

### Accessibility & Usability

-   **FR51**: Interface can display clearly on mobile devices (smartphones and tablets)
-   **FR52**: Interface can adapt to portrait and landscape orientations
-   **FR53**: Interface can meet WCAG 2.1 Level AA compliance standards
-   **FR54**: Homeowner can complete survey using keyboard navigation (no mouse required)
-   **FR55**: Screen readers can access all survey content and instructions
-   **FR56**: Interface can display with sufficient color contrast for visual accessibility

### System Monitoring & Error Handling

-   **FR57**: System can track session start vs. completion for abandonment analysis
-   **FR58**: System can handle network interruptions gracefully without data loss
-   **FR59**: System can detect and report Gemini API failures
-   **FR60**: System can monitor and log WebRTC connection quality metrics

### Design Constraints

**Future CRM Integration Protection:**

While POC outputs PDF only, the internal data model must store inventory in structured format that can be mapped to common moving industry CRM systems (SmartMoving, MoveitPro, etc.) in Phase 2. This constraint ensures that adding CRM integration in Phase 2 is additive work, not a rebuild. The architecture should maintain clean separation between data capture, storage, and presentation layers.

### AI Orchestration with LangChain

-   **FR73**: Use LangChain (v2026) to orchestrate all Gemini 1.5/2.0 calls.
-   **FR74**: Implement a Vision-to-Inventory chain that processes uploaded photos into item detections with properties (dimensions, weight, material, CFT inputs).
-   **FR75**: Implement a Conversational Clerk chain that manages dialogue, interruptions, and guidance logic for the survey experience.
-   **FR76**: Chains must be configurable (thresholds, prompts, model selection) via environment/config without code changes.
-   **FR77**: Expose chain-level telemetry (latency, token/cost, retries) for observability and tuning.

## Non-Functional Requirements

### Performance

**User-Facing Performance Targets:**

-   **NFR-P1**: Time to Interactive (TTI) must be <3 seconds from link click to survey start
-   **NFR-P2**: Voice interaction latency must be <500ms round-trip for conversational feel
-   **NFR-P3**: Photo upload time must be <5 seconds per photo on 4G mobile connection
-   **NFR-P4**: AI photo analysis and feedback must complete within 2 seconds per photo
-   **NFR-P5**: PDF generation must complete within 30 seconds for surveys up to 200 items
-   **NFR-P6**: Session recovery (if user navigates away and returns) must restore state within 1 second
-   **NFR-P7**: SMS with survey link should be delivered within 10 seconds of lead form submission (p95) when provider is healthy.

**Rationale:** Real-time voice conversation and photo feedback are core to the user experience. Delays break the conversational flow and reduce completion rates.

### Reliability

**System Availability:**

-   **NFR-R1**: surveyor platform uptime must be 99.999% excluding infrastructure provider SLO (Vercel/Railway) - target zero engineering errors on surveyor codebase
-   **NFR-R2**: System must gracefully handle Gemini API failures without crashing survey sessions
-   **NFR-R3**: WebRTC/WebSocket connection failures must be detected and handled without data loss
-   **NFR-R4**: Session state must be persisted continuously to prevent loss during interruptions
-   **NFR-R5**: System must log all errors with sufficient context for debugging and monitoring

**Session Persistence & Recovery:**

-   **NFR-R10**: Session state must be persisted continuously to handle interruptions (phone crashes, network disconnections, system downtime) and allow seamless resume when user returns to link

**External Dependency Management:**

-   **NFR-R6**: System must monitor Gemini API health and response times
-   **NFR-R7**: System must implement retry logic for transient Gemini API failures (3 retries with exponential backoff)
-   **NFR-R8**: If Gemini API is unavailable for >30 seconds, display clear error message to homeowner with option to retry
-   **NFR-R9**: System architecture must support fallback to alternative LLM providers (e.g., OpenAI GPT-4V) if Gemini API becomes unreliable or cost-prohibitive (documented capability, not implemented in POC)

**Rationale:** High uptime is critical for mid-market movers who can't afford downtime during peak season. Gemini dependency is acknowledged but must be managed gracefully. Session persistence protects against real-world interruptions (phone crashes, network issues).

### Security

**Data Protection (POC Scope):**

-   **NFR-S1**: All communication must use HTTPS (required for camera and microphone browser APIs)
-   **NFR-S2**: Session IDs must be cryptographically secure and non-guessable (UUID v4 or equivalent)
-   **NFR-S3**: Photos and voice data must be retained indefinitely for machine learning and quote pattern analysis
-   **NFR-S4**: No authentication required for POC, but session URLs must be single-use or time-limited (24-48 hour expiration)
-   **NFR-S5**: API endpoints must implement rate limiting to prevent abuse (max 100 requests/minute per IP)

**Data Privacy:**

-   **NFR-S6**: System must not log or store personally identifiable information beyond what's necessary for survey completion
-   **NFR-S7**: Photo metadata (EXIF data) must be stripped before PDF generation to protect location privacy
-   **NFR-S8**: Moving company email addresses must be validated before sending PDFs to prevent data leakage

**Messaging & Compliance (Additions):**

-   **NFR-S9**: SMS delivery must comply with applicable messaging regulations (e.g., TCPA/CTIA in the US); include required disclosures and consent on the lead form.
-   **NFR-S10**: Provide STOP/HELP keywords handling where applicable; do not continue messaging beyond the one-time survey link unless explicitly opted in for further notifications.
-   **NFR-S11**: Do not expose PII in URLs; avoid logging PII in application logs; mask sensitive fields in telemetry.
-   **NFR-S12**: Enforce rate limiting and CAPTCHA on lead form endpoints to mitigate abuse.

**Rationale:** Homeowners are photographing their personal belongings and homes. Even for POC, basic security and privacy protections are essential for trust. Photos are retained indefinitely to enable ML improvements and quote pattern learning.

### Scalability

**POC Capacity (Immediate):**

-   **NFR-SC1**: System must support 5 concurrent voice sessions without performance degradation
-   **NFR-SC2**: System must handle 100 survey sessions per week during POC
-   **NFR-SC3**: Photo storage must accommodate 500 photos per survey (high-end home) × 100 surveys = 50,000 photos during POC

**Production Scalability (Architectural Headroom):**

-   **NFR-SC4**: Architecture must support scaling to 100 concurrent voice sessions with infrastructure changes only (no code rewrites)
-   **NFR-SC5**: System must handle 10x traffic increase (1,000 surveys/week) with <10% performance degradation through horizontal scaling
-   **NFR-SC6**: Database schema must support multi-tenancy without major restructuring (prepare for Phase 2)
-   **NFR-SC7**: Code architecture must separate survey engine from delivery mechanisms to enable future channel additions (mobile app, API, etc.)
-   **NFR-SC8**: Support SMS sending throughput of at least 10 messages/second burst for campaign spikes (configurable by provider), with graceful backoff and queuing.

**Rationale:** Build for POC scale, but design architecture to avoid rewrites when moving to production SaaS. Multi-tenancy preparation is critical for Phase 2. Code scalability ensures dynamic node scaling can handle volume growth without refactoring.

### Data Portability & Integration Readiness

**Structured Data Storage:**

-   **NFR-DP1**: Inventory data must be stored in structured format (JSON or relational schema) separate from PDF rendering
-   **NFR-DP2**: Data model must include standard moving industry entities (items, rooms, dimensions, weights, CFT) that map to common CRM schemas
-   **NFR-DP3**: System must maintain clean separation between data capture, storage, and presentation layers
-   **NFR-DP4**: Internal APIs must use consistent data models to enable future export/integration features

**Integration Preparation (Non-Functional):**

-   **NFR-DP5**: Architecture must support adding data export endpoints without refactoring core survey engine
-   **NFR-DP6**: When CRM integration is added in Phase 2, it should be additive work (<2 weeks engineering), not a rebuild

**Rationale:** Protects against technical debt. Ensures Phase 2 CRM integrations (SmartMoving, MoveitPro) don't require rearchitecting the entire system.

### Accessibility

**WCAG 2.1 Level AA Compliance:**

-   **NFR-A1**: All interface elements must meet WCAG 2.1 Level AA standards
-   **NFR-A2**: Color contrast must be minimum 4.5:1 for text, 3:1 for UI components
-   **NFR-A3**: All functionality must be accessible via keyboard navigation (no mouse required)
-   **NFR-A4**: Screen readers must be able to access all survey content and instructions
-   **NFR-A5**: Voice instructions must have text caption alternatives displayed in real-time
-   **NFR-A6**: Text-only fallback mode must provide equivalent survey experience for users who cannot use voice

**Rationale:** Accessibility is both legal compliance and market expansion - homeowners with disabilities need moving services too.

### Monitoring & Observability

**Operational Visibility:**

-   **NFR-M1**: System must track and log key metrics: session starts, completions, abandonment points, average duration
-   **NFR-M2**: System must monitor Gemini API costs per survey in real-time
-   **NFR-M3**: System must track WebRTC connection quality (latency, packet loss, disconnections)
-   **NFR-M4**: System must log AI confidence scores and Satisfactory Check results for accuracy analysis
-   **NFR-M5**: Dashboard must display POC metrics: completion rate, accuracy feedback from moving companies, cost per survey
-   **NFR-M6**: Track SMS delivery metrics and statuses (queued/sent/delivered/failed) and alert on delivery failure rates exceeding threshold.

### AI Orchestration

-   **NFR-LC1**: LangChain v2026 is the orchestration layer for all Gemini calls (vision and conversation).
-   **NFR-LC2**: Provide chain-level configuration and prompt versioning with safe rollout (feature flags where applicable).
-   **NFR-LC3**: Emit structured telemetry per chain: latency histograms, token/cost by step, retry counts, error taxonomy.
-   **NFR-LC4**: Deterministic chain testing harness with fixtures for key flows (Vision-to-Inventory, Conversational Clerk).

**Rationale:** POC is validation exercise - need visibility into success metrics (90% completion, 96% accuracy, cost targets) to make Phase 2 decision.

## Addendum: Backend Testing & Session Link Policy

### Quality & Testing Strategy (Backend)

- **Test types**:
	- Unit tests for core logic (session create/validate/close, time math, idempotency, permissions, error mapping).
	- Integration tests for DB/cache/external deps covering end-to-end flows.
	- Smoke tests on deploy.
- **Coverage gates**:
	- ≥80% line and ≥70% branch coverage for core modules.
	- CI blocks merges on any failing unit/integration test.
- **Isolation & speed**:
	- Deterministic seeds, factory-based test data, transactional rollback or isolated schemas; parallel-safe.
	- Unit suite ≤5 min, integration suite ≤10 min on CI baseline.
- **Integration flows (minimum)**:
	- Create session → redeem link → complete/submit survey.
	- Expired link redemption returns 410.
	- Invalid/tampered link returns 404/401 appropriately.
	- Concurrent joins and duplicate redemption handling.
	- Cleanup job removes expired links/sessions idempotently and emits metrics.

### Session Link Expiry Policy

- **Default TTL**: 24h; configurable range 1h–7d via environment config.
- **Absolute expiration (no sliding)**: `expiresAt` computed at creation, stored, indexed; not extended by access.
- **Token**: Signed payload with `exp` claim (or equivalent) to enforce cryptographically; optional single-use flag; supports explicit revocation.
- **API behavior**:
	- Valid redemption: 200.
	- Expired link: 410 Gone `{ code: "link_expired", expiresAt }`.
	- Invalid/not found: 404 `{ code: "not_found" }`.
	- Signature/tamper: 401 `{ code: "invalid_signature" }`.
- **Revocation**: Admin/system revocation terminates future redemptions immediately; propagation ≤60s.
- **Cleanup**: Background job every 15 min deletes/archives links with `expiresAt < now - 1h` (grace); idempotent, batch-limited, retried with DLQ.
- **Observability**: Metrics for created/consumed/expired/revoked links; cleanup processed/failed/backlog; alerts on backlog >10k or 3 consecutive job failures.

### Active Engagement Must Not Be Interrupted

- **Link TTL is redemption-only**: The link cannot be redeemed after `expiresAt`, but it must not disconnect users who already joined.
- **Active session separate from link**:
	- Upon redemption, the user obtains a session (token/WS) governed by an inactivity timeout, separate from link TTL.
	- **Inactivity timeout (rolling)**: Default 30 minutes (configurable 5–120). Any activity (API call, WS message, heartbeat) advances `lastActivityAt`.
	- **Heartbeat**: Client heartbeats every 30–120s; server updates `lastActivityAt` atomically. Grace window is 2× heartbeat interval before expiry.
	- **Revocation precedence**: Admin/system revocation terminates active sessions immediately regardless of activity.
- **API behavior**:
	- New redemptions after `expiresAt`: 410 Gone `{ code: "link_expired" }`.
	- Active session crossing `expiresAt`: remains valid while activity continues.
	- Session expired due to inactivity: 440 Login Timeout (or 401) `{ code: "session_inactive" }`.
- **Data model**:
	- `SessionLink`: `expiresAt` (indexed).
	- `Session`: `lastActivityAt`, `inactivityTimeoutSec`, `status` (active|revoked|expired).
	- Optional cache key `session:{id}:lastActivityAt` for fast checks.
- **Session cleanup job**:
	- Expires sessions with `now - lastActivityAt > inactivityTimeoutSec + grace`.
	- Idempotent and batch-limited; emits metrics.

### Acceptance Criteria (Addendum)

- Coverage thresholds met; CI blocks merges on failures.
- Integration suites verify: valid redemption, expired (410), invalid (404), tampered (401), concurrent joins, cleanup behavior.
- Users active past link `expiresAt` are not disconnected; inactivity timeouts enforce session end when idle.
- `expiresAt` persisted and indexed; queries use the index; no sliding extension.
- Metrics and alerts in place for link lifecycle, session inactivity expirations, and cleanup health.