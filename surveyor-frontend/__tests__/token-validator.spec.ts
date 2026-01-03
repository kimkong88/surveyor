import { describe, it, expect } from "vitest";
import { validateTokenFormat, isValidToken } from "../lib/token-validator";

describe("Token Format Validator", () => {
    describe("validateTokenFormat", () => {
        it("should accept valid UUIDv4-like tokens", () => {
            const validTokens = [
                "550e8400-e29b-41d4-a716-446655440000",
                "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
                "a1b2c3d4-e5f6-4789-a012-b34567890abc",
            ];

            validTokens.forEach((token) => {
                expect(validateTokenFormat(token)).toBe(true);
            });
        });

        it("should accept alphanumeric tokens of reasonable length", () => {
            const validTokens = [
                "abc123def456",
                "token-with-dashes-123",
                "UPPERCASE123lowercase",
                "mixedCase123WithNumbers456",
            ];

            validTokens.forEach((token) => {
                expect(validateTokenFormat(token)).toBe(true);
            });
        });

        it("should reject tokens with invalid characters", () => {
            const invalidTokens = [
                "token!with@special#chars",
                "token with spaces",
                "token<script>alert('xss')</script>",
                "token&param=value",
                "../../../etc/passwd",
            ];

            invalidTokens.forEach((token) => {
                expect(validateTokenFormat(token)).toBe(false);
            });
        });

        it("should reject tokens that are too short", () => {
            expect(validateTokenFormat("ab")).toBe(false);
            expect(validateTokenFormat("")).toBe(false);
            expect(validateTokenFormat("a")).toBe(false);
        });

        it("should reject tokens that are too long", () => {
            const tooLong = "a".repeat(257);
            expect(validateTokenFormat(tooLong)).toBe(false);
        });

        it("should handle null and undefined gracefully", () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect(validateTokenFormat(null as any)).toBe(false);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect(validateTokenFormat(undefined as any)).toBe(false);
        });
    });

    describe("isValidToken (alias)", () => {
        it("should be an alias for validateTokenFormat", () => {
            expect(isValidToken("valid-token-123")).toBe(true);
            expect(isValidToken("invalid!token")).toBe(false);
        });
    });
});

