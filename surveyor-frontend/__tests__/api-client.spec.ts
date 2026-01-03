/**
 * API Client Tests - Story 1.3
 * Tests for session start API calls
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { startSession, ApiError } from "../lib/api-client";

describe("startSession API client", () => {
    const mockToken = "test-token-abc123";
    let fetchMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        // Reset mocks before each test
        fetchMock = vi.fn();
        global.fetch = fetchMock;
        
        // Mock environment variables
        process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost:3000";
        process.env.API_TIMEOUT_MS = "10000";
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("success path", () => {
        it("returns sessionId on successful 200 response", async () => {
            const mockSessionId = "550e8400-e29b-41d4-a716-446655440000";
            fetchMock.mockResolvedValue({
                ok: true,
                status: 200,
                json: async () => ({ sessionId: mockSessionId }),
            });

            const result = await startSession({ token: mockToken });

            expect(result.sessionId).toBe(mockSessionId);
            expect(fetchMock).toHaveBeenCalledWith(
                "http://localhost:3000/api/sessions/start",
                expect.objectContaining({
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token: mockToken }),
                })
            );
        });
    });

    describe("error mapping", () => {
        it("throws INVALID_TOKEN when token is missing", async () => {
            await expect(
                startSession({ token: "" as unknown as string })
            ).rejects.toMatchObject({ code: "INVALID_TOKEN" });
            expect(fetchMock).not.toHaveBeenCalled();
        });

        it("maps 400 Bad Request to INVALID_TOKEN error", async () => {
            fetchMock.mockResolvedValue({
                ok: false,
                status: 400,
                json: async () => ({ code: "INVALID_TOKEN", message: "Token is invalid" }),
            });

            await expect(startSession({ token: mockToken })).rejects.toThrow();
            
            try {
                await startSession({ token: mockToken });
            } catch (error) {
                const apiError = error as ApiError;
                expect(apiError.code).toBe("INVALID_TOKEN");
                expect(apiError.status).toBe(400);
            }
        });

        it("maps 410 Gone to TOKEN_EXPIRED error", async () => {
            fetchMock.mockResolvedValue({
                ok: false,
                status: 410,
                json: async () => ({ code: "TOKEN_EXPIRED", message: "Token has expired" }),
            });

            try {
                await startSession({ token: mockToken });
            } catch (error) {
                const apiError = error as ApiError;
                expect(apiError.code).toBe("TOKEN_EXPIRED");
                expect(apiError.status).toBe(410);
            }
        });

        it("maps 429 Too Many Requests to RATE_LIMITED error", async () => {
            fetchMock.mockResolvedValue({
                ok: false,
                status: 429,
                json: async () => ({ code: "RATE_LIMITED", message: "Rate limit exceeded" }),
            });

            try {
                await startSession({ token: mockToken });
            } catch (error) {
                const apiError = error as ApiError;
                expect(apiError.code).toBe("RATE_LIMITED");
                expect(apiError.status).toBe(429);
            }
        });

        it("maps 5xx errors to SERVER_ERROR", async () => {
            fetchMock.mockResolvedValue({
                ok: false,
                status: 500,
                json: async () => ({ code: "SERVER_ERROR", message: "Internal server error" }),
            });

            try {
                await startSession({ token: mockToken });
            } catch (error) {
                const apiError = error as ApiError;
                expect(apiError.code).toBe("SERVER_ERROR");
                expect(apiError.status).toBe(500);
            }
        });

        it("handles network errors as NETWORK_ERROR", async () => {
            fetchMock.mockRejectedValue(new Error("Network failure"));

            try {
                await startSession({ token: mockToken });
            } catch (error) {
                const apiError = error as ApiError;
                expect(apiError.code).toBe("NETWORK_ERROR");
            }
        });

        it("handles timeout errors", async () => {
            // Set a short timeout for this test
            process.env.API_TIMEOUT_MS = "100";
            
            // Mock fetch that respects abort signal
            fetchMock.mockImplementation((url, options) => 
                new Promise((resolve, reject) => {
                    const opts = options as RequestInit;
                    if (opts.signal) {
                        opts.signal.addEventListener('abort', () => {
                            reject(new DOMException('The operation was aborted', 'AbortError'));
                        });
                    }
                    // Never resolve - will be aborted by timeout
                    setTimeout(() => {
                        resolve({
                            ok: true,
                            status: 200,
                            json: async () => ({ sessionId: "test-id" }),
                        });
                    }, 5000);
                })
            );

            await expect(startSession({ token: mockToken })).rejects.toThrow();
            
            try {
                await startSession({ token: mockToken });
            } catch (error) {
                const apiError = error as ApiError;
                expect(apiError.code).toBe("NETWORK_ERROR");
                expect(apiError.message).toContain("timeout");
            } finally {
                // Reset timeout
                process.env.API_TIMEOUT_MS = "10000";
            }
        }, 5000); // Test timeout of 5s
    });

    describe("configuration", () => {
        it("uses NEXT_PUBLIC_API_BASE_URL from environment", async () => {
            process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.com";
            
            fetchMock.mockResolvedValue({
                ok: true,
                status: 200,
                json: async () => ({ sessionId: "test-id" }),
            });

            await startSession({ token: mockToken });

            expect(fetchMock).toHaveBeenCalledWith(
                "https://api.example.com/api/sessions/start",
                expect.any(Object)
            );
        });

        it("falls back to default API base URL if not configured", async () => {
            delete process.env.NEXT_PUBLIC_API_BASE_URL;
            
            fetchMock.mockResolvedValue({
                ok: true,
                status: 200,
                json: async () => ({ sessionId: "test-id" }),
            });

            await startSession({ token: mockToken });

            expect(fetchMock).toHaveBeenCalledWith(
                "/api/sessions/start",
                expect.any(Object)
            );
        });
    });
});

