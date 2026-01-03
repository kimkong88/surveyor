import { describe, it, expect, vi, beforeEach } from "vitest";
import { trackEvent, maskToken } from "../lib/telemetry";

describe("Telemetry", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("maskToken", () => {
        it("should mask long tokens showing up to 6 chars", () => {
            const token = "abc123def456ghi789";
            const masked = maskToken(token);

            expect(masked).toBe("abc123…(len=18)");
        });

        it("should mask short tokens showing max 25% (8 char minimum)", () => {
            const token = "abcd1234"; // 8 chars
            const masked = maskToken(token);

            expect(masked).toBe("ab…(len=8)"); // 25% = 2 chars
        });

        it("should mask 12 char tokens showing 25%", () => {
            const token = "abcdef123456"; // 12 chars
            const masked = maskToken(token);

            expect(masked).toBe("abc…(len=12)"); // 25% = 3 chars
        });

        it("should handle very short tokens (minimum 2 chars shown)", () => {
            const token = "ab";
            const masked = maskToken(token);

            expect(masked).toBe("ab…(len=2)");
        });

        it("should handle empty string", () => {
            const masked = maskToken("");

            expect(masked).toBe("…(len=0)");
        });
    });

    describe("trackEvent", () => {
        it("should log event with data to console in development", () => {
            const consoleSpy = vi.spyOn(console, "log");

            trackEvent("link_opened", {
                token_preview: "abc123…(len=32)",
            });

            expect(consoleSpy).toHaveBeenCalledWith(
                "[Telemetry]",
                "link_opened",
                { token_preview: "abc123…(len=32)" }
            );
        });

        it("should track event without data", () => {
            const consoleSpy = vi.spyOn(console, "log");

            trackEvent("page_view");

            expect(consoleSpy).toHaveBeenCalledWith(
                "[Telemetry]",
                "page_view",
                undefined
            );
        });
    });
});
