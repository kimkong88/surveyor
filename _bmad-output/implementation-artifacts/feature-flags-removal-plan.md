# Feature flags removal for MVP

Context: MVP/POC ships all features enabled; feature flags add noise and test overhead. Telemetry can stay as-is (stub), but no runtime gating is required.

## Decisions
- Remove all feature flags and gating paths (frontend; no flags exist in backend today).
- Delete flag config/env plumbing; no kill switch needed.
- Keep telemetry stub untouched.

## Required changes (frontend)
- Delete `surveyor-frontend/lib/feature-flags.ts` and any `__FEATURE_FLAGS__` window overrides.
- Remove imports/usages of `isFeatureEnabled` (e.g., `app/s/[token]/page.tsx`, `lib/api-client.ts`) and run flows unconditionally.
- Remove env vars `NEXT_PUBLIC_FEATURE_LINK_REDEMPTION` and `NEXT_PUBLIC_MOCK_SESSION_START`; scrub references from code/tests/config.
- Simplify UI states tied to flags (e.g., “Feature Unavailable” branch) to the single valid path.
- Update tests: drop `__tests__/feature-flags.spec.ts`; collapse mock-mode branches in `__tests__/api-client.spec.ts`; adjust link redemption tests if they expect the disabled state.
- Ensure any docs mentioning feature flags (stories/prd) note they were removed for MVP.

## Acceptance criteria
- No imports or definitions of feature flag utilities remain.
- No flag-related env vars are read or required to run.
- All tests updated to reflect single-path behavior and pass.
- Telemetry remains intact (no flag gating).

## Suggested verification
- `pnpm test --filter api-client.spec.ts`
- `pnpm test --filter link-redemption.spec.tsx`
- `pnpm test --filter session-start.spec.tsx`

