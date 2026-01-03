/**
 * Session Context Tests - Story 1.3
 * Tests for session state management with sessionStorage persistence
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import { SessionProvider, useSession, useStartSession } from "../context/SessionContext";
import * as apiClient from "../lib/api-client";

// Mock API client
vi.mock("../lib/api-client");

// Test component that uses the hooks
function TestComponent() {
    const session = useSession();
    const { startSession, reset } = useStartSession();

    return (
        <div>
            <div data-testid="session-id">{session.sessionId || "null"}</div>
            <div data-testid="session-status">{session.sessionStatus}</div>
            <div data-testid="session-error">{session.sessionErrorCode || "none"}</div>
            <button onClick={() => startSession("test-token")}>Start Session</button>
            <button onClick={reset}>Reset</button>
        </div>
    );
}

describe("SessionContext", () => {
    let mockSessionStorage: Record<string, string>;

    beforeEach(() => {
        // Mock sessionStorage
        mockSessionStorage = {};
        Object.defineProperty(window, 'sessionStorage', {
            value: {
                getItem: vi.fn((key) => mockSessionStorage[key] || null),
                setItem: vi.fn((key, value) => {
                    mockSessionStorage[key] = value;
                }),
                removeItem: vi.fn((key) => {
                    delete mockSessionStorage[key];
                }),
                clear: vi.fn(() => {
                    mockSessionStorage = {};
                }),
            },
            writable: true,
        });

        // Reset mocks
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("useSession hook", () => {
        it("returns initial idle state when no session exists", () => {
            render(
                <SessionProvider>
                    <TestComponent />
                </SessionProvider>
            );

            expect(screen.getByTestId("session-id")).toHaveTextContent("null");
            expect(screen.getByTestId("session-status")).toHaveTextContent("idle");
            expect(screen.getByTestId("session-error")).toHaveTextContent("none");
        });

        it("loads sessionId from sessionStorage on mount", () => {
            mockSessionStorage["surveyor:sessionId"] = "existing-session-123";

            render(
                <SessionProvider>
                    <TestComponent />
                </SessionProvider>
            );

            expect(screen.getByTestId("session-id")).toHaveTextContent("existing-session-123");
            expect(screen.getByTestId("session-status")).toHaveTextContent("ready");
        });
    });

    describe("useStartSession hook", () => {
        it("transitions to loading then ready on successful session start", async () => {
            const mockSessionId = "new-session-456";
            vi.mocked(apiClient.startSession).mockResolvedValue({ sessionId: mockSessionId });

            render(
                <SessionProvider>
                    <TestComponent />
                </SessionProvider>
            );

            // Initially idle
            expect(screen.getByTestId("session-status")).toHaveTextContent("idle");

            // Click to start session
            act(() => {
                screen.getByText("Start Session").click();
            });

            // Should be loading
            await waitFor(() => {
                expect(screen.getByTestId("session-status")).toHaveTextContent("loading");
            });

            // Should transition to ready with sessionId
            await waitFor(() => {
                expect(screen.getByTestId("session-status")).toHaveTextContent("ready");
                expect(screen.getByTestId("session-id")).toHaveTextContent(mockSessionId);
            });
        });

        it("transitions to loading then error on failed session start", async () => {
            const mockError: apiClient.ApiError = Object.assign(
                new Error("Token expired"),
                { code: "TOKEN_EXPIRED" as const, status: 410 }
            );
            vi.mocked(apiClient.startSession).mockRejectedValue(mockError);

            render(
                <SessionProvider>
                    <TestComponent />
                </SessionProvider>
            );

            // Click to start session
            act(() => {
                screen.getByText("Start Session").click();
            });

            // Should be loading
            await waitFor(() => {
                expect(screen.getByTestId("session-status")).toHaveTextContent("loading");
            });

            // Should transition to error
            await waitFor(() => {
                expect(screen.getByTestId("session-status")).toHaveTextContent("error");
                expect(screen.getByTestId("session-error")).toHaveTextContent("TOKEN_EXPIRED");
            });
        });

        it("persists sessionId to sessionStorage on success", async () => {
            const mockSessionId = "persisted-session-789";
            vi.mocked(apiClient.startSession).mockResolvedValue({ sessionId: mockSessionId });

            render(
                <SessionProvider>
                    <TestComponent />
                </SessionProvider>
            );

            // Start session
            act(() => {
                screen.getByText("Start Session").click();
            });

            // Wait for completion
            await waitFor(() => {
                expect(screen.getByTestId("session-status")).toHaveTextContent("ready");
            });

            // Check sessionStorage was updated
            expect(mockSessionStorage["surveyor:sessionId"]).toBe(mockSessionId);
        });

        it("prevents multiple concurrent session start calls", async () => {
            vi.mocked(apiClient.startSession).mockImplementation(() => 
                new Promise((resolve) => {
                    setTimeout(() => resolve({ sessionId: "test-id" }), 100);
                })
            );

            render(
                <SessionProvider>
                    <TestComponent />
                </SessionProvider>
            );

            const button = screen.getByText("Start Session");

            // Click multiple times rapidly
            act(() => {
                button.click();
                button.click();
                button.click();
            });

            // Should only call API once
            await waitFor(() => {
                expect(screen.getByTestId("session-status")).toHaveTextContent("ready");
            });

            expect(apiClient.startSession).toHaveBeenCalledTimes(1);
        });

        it("clears state and sessionStorage on reset", async () => {
            const mockSessionId = "reset-test-session";
            vi.mocked(apiClient.startSession).mockResolvedValue({ sessionId: mockSessionId });

            render(
                <SessionProvider>
                    <TestComponent />
                </SessionProvider>
            );

            // Start session
            act(() => {
                screen.getByText("Start Session").click();
            });

            await waitFor(() => {
                expect(screen.getByTestId("session-status")).toHaveTextContent("ready");
            });

            // Reset
            act(() => {
                screen.getByText("Reset").click();
            });

            // Should be back to idle with no sessionId
            expect(screen.getByTestId("session-status")).toHaveTextContent("idle");
            expect(screen.getByTestId("session-id")).toHaveTextContent("null");
            expect(mockSessionStorage["surveyor:sessionId"]).toBeUndefined();
        });
    });

    describe("error handling", () => {
        it("stores error code when session start fails", async () => {
            const mockError: apiClient.ApiError = Object.assign(
                new Error("Invalid token"),
                { code: "INVALID_TOKEN" as const, status: 400 }
            );
            vi.mocked(apiClient.startSession).mockRejectedValue(mockError);

            render(
                <SessionProvider>
                    <TestComponent />
                </SessionProvider>
            );

            act(() => {
                screen.getByText("Start Session").click();
            });

            await waitFor(() => {
                expect(screen.getByTestId("session-error")).toHaveTextContent("INVALID_TOKEN");
            });
        });

        it("allows retry after error", async () => {
            const mockError: apiClient.ApiError = Object.assign(
                new Error("Network error"),
                { code: "NETWORK_ERROR" as const }
            );
            
            // First call fails
            vi.mocked(apiClient.startSession)
                .mockRejectedValueOnce(mockError)
                .mockResolvedValueOnce({ sessionId: "retry-success-id" });

            render(
                <SessionProvider>
                    <TestComponent />
                </SessionProvider>
            );

            // First attempt fails
            act(() => {
                screen.getByText("Start Session").click();
            });

            await waitFor(() => {
                expect(screen.getByTestId("session-status")).toHaveTextContent("error");
            });

            // Retry succeeds
            act(() => {
                screen.getByText("Start Session").click();
            });

            await waitFor(() => {
                expect(screen.getByTestId("session-status")).toHaveTextContent("ready");
                expect(screen.getByTestId("session-id")).toHaveTextContent("retry-success-id");
            });
        });
    });
});

