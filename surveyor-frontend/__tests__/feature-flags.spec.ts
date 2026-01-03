import { describe, it, expect } from "vitest";
import { isFeatureEnabled, FeatureFlags } from "../lib/feature-flags";

describe("Feature Flags", () => {
    describe("isFeatureEnabled", () => {
        it("should return true for linkRedemption feature (enabled by default)", () => {
            expect(isFeatureEnabled("linkRedemption")).toBe(true);
        });

        it("should return false for disabled features", () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect(isFeatureEnabled("nonExistentFeature" as any)).toBe(false);
        });

        it("should handle all defined feature flags", () => {
            const flags: Array<keyof FeatureFlags> = [
                "linkRedemption",
            ];

            flags.forEach(flag => {
                const result = isFeatureEnabled(flag);
                expect(typeof result).toBe("boolean");
            });
        });
    });
});

