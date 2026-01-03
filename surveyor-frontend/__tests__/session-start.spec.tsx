/**
 * Session Start Integration Tests - Story 1.3
 * Tests for the complete session start flow from Welcome page
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WelcomePage from "../app/welcome/page";
import { SessionProvider } from "../context/SessionContext";
import * as apiClient from "../lib/api-client";

// Helper to render with SessionProvider
function renderWithSession(component: React.ReactElement) {
    return render(<SessionProvider>{component}</SessionProvider>);
}

// Mock Next.js router
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

// Mock Link Token Context - always provide a valid token
vi.mock("../context/LinkTokenContext", () => ({
    useLinkToken: () => ({
        linkToken: "test-token-123",
        setLinkToken: vi.fn(),
        clearLinkToken: vi.fn(),
    }),
}));

// Don't mock SessionContext - we want to test it properly
// Just mock the API client
vi.mock("../lib/api-client");

describe("Session Start Integration", () => {
    beforeEach(() => {
        mockPush.mockClear();
        vi.clearAllMocks();
        
        // Setup default environment
        process.env.NEXT_PUBLIC_START_SESSION_NAVIGATE = 'true';
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("Success Flow", () => {
        it("should complete full session start flow and navigate to conversation", async () => {
            const mockSessionId = "session-abc-123";
            
            vi.mocked(apiClient.startSession).mockResolvedValue({ sessionId: mockSessionId });

            const user = userEvent.setup();
            renderWithSession(<WelcomePage />);

            // Find and click the "Get started" button
            const button = screen.getByTestId("get-started-button");
            expect(button).toBeInTheDocument();
            expect(button).not.toBeDisabled();

            await user.click(button);

            // Wait for success and navigation (may happen very quickly)
            await waitFor(() => {
                expect(mockPush).toHaveBeenCalledWith('/conversation');
            });

            // Verify API was called correctly
            expect(apiClient.startSession).toHaveBeenCalledWith({ token: "test-token-123" });
        });

        it("should skip navigation when NEXT_PUBLIC_START_SESSION_NAVIGATE is false", async () => {
            process.env.NEXT_PUBLIC_START_SESSION_NAVIGATE = 'false';
            
            vi.mocked(apiClient.startSession).mockResolvedValue({ sessionId: "test-session" });

            const user = userEvent.setup();
            renderWithSession(<WelcomePage />);

            const button = screen.getByTestId("get-started-button");
            await user.click(button);

            await waitFor(() => {
                expect(button).not.toBeDisabled();
            });

            // Should NOT navigate
            expect(mockPush).not.toHaveBeenCalled();
        });
    });

    describe("Error Handling", () => {
        it("should display error banner on INVALID_TOKEN error", async () => {
            const mockError: apiClient.ApiError = Object.assign(
                new Error("Token is invalid"),
                { code: "INVALID_TOKEN" as const, status: 400 }
            );
            vi.mocked(apiClient.startSession).mockRejectedValue(mockError);

            const user = userEvent.setup();
            renderWithSession(<WelcomePage />);

            const button = screen.getByTestId("get-started-button");
            await user.click(button);

            // Wait for error banner to appear
            await waitFor(() => {
                expect(screen.getByTestId("error-banner")).toBeInTheDocument();
            });

            // Verify error message
            expect(screen.getByText(/this link is invalid/i)).toBeInTheDocument();
            
            // Verify retry and go home buttons exist
            expect(screen.getByTestId("retry-button")).toBeInTheDocument();
            expect(screen.getByTestId("go-home-button")).toBeInTheDocument();
        });

        it("should display error banner on TOKEN_EXPIRED error", async () => {
            const mockError: apiClient.ApiError = Object.assign(
                new Error("Token expired"),
                { code: "TOKEN_EXPIRED" as const, status: 410 }
            );
            vi.mocked(apiClient.startSession).mockRejectedValue(mockError);

            const user = userEvent.setup();
            renderWithSession(<WelcomePage />);

            await user.click(screen.getByTestId("get-started-button"));

            await waitFor(() => {
                expect(screen.getByText(/this link has expired/i)).toBeInTheDocument();
            });
        });

        it("should display error banner on NETWORK_ERROR", async () => {
            const mockError: apiClient.ApiError = Object.assign(
                new Error("Network failure"),
                { code: "NETWORK_ERROR" as const }
            );
            vi.mocked(apiClient.startSession).mockRejectedValue(mockError);

            const user = userEvent.setup();
            renderWithSession(<WelcomePage />);

            await user.click(screen.getByTestId("get-started-button"));

            await waitFor(() => {
                expect(screen.getByText(/unable to connect/i)).toBeInTheDocument();
            });
        });

        it("should allow retry after error", async () => {
            const mockError: apiClient.ApiError = Object.assign(
                new Error("Network error"),
                { code: "NETWORK_ERROR" as const }
            );
            
            // First call fails, second succeeds
            vi.mocked(apiClient.startSession)
                .mockRejectedValueOnce(mockError)
                .mockResolvedValueOnce({ sessionId: "retry-success" });

            const user = userEvent.setup();
            renderWithSession(<WelcomePage />);

            // First attempt
            await user.click(screen.getByTestId("get-started-button"));

            // Wait for error
            await waitFor(() => {
                expect(screen.getByTestId("error-banner")).toBeInTheDocument();
            });

            // Retry
            await user.click(screen.getByTestId("retry-button"));

            // Should succeed and navigate
            await waitFor(() => {
                expect(mockPush).toHaveBeenCalledWith('/conversation');
            });

            // Should have called API twice
            expect(apiClient.startSession).toHaveBeenCalledTimes(2);
        });

        it("should navigate home when Go Home button is clicked", async () => {
            const mockError: apiClient.ApiError = Object.assign(
                new Error("Token expired"),
                { code: "TOKEN_EXPIRED" as const, status: 410 }
            );
            vi.mocked(apiClient.startSession).mockRejectedValue(mockError);

            const user = userEvent.setup();
            renderWithSession(<WelcomePage />);

            await user.click(screen.getByTestId("get-started-button"));

            await waitFor(() => {
                expect(screen.getByTestId("go-home-button")).toBeInTheDocument();
            });

            await user.click(screen.getByTestId("go-home-button"));

            expect(mockPush).toHaveBeenCalledWith("/");
        });
    });

    describe("Accessibility", () => {
        it("should have aria-busy attribute during loading", async () => {
            vi.mocked(apiClient.startSession).mockImplementation(() => 
                new Promise((resolve) => {
                    setTimeout(() => resolve({ sessionId: "test" }), 100);
                })
            );

            const user = userEvent.setup();
            renderWithSession(<WelcomePage />);

            const button = screen.getByTestId("get-started-button");
            
            // Initially not busy
            expect(button).toHaveAttribute("aria-busy", "false");

            await user.click(button);

            // Should be busy during loading
            await waitFor(() => {
                expect(button).toHaveAttribute("aria-busy", "true");
            });
        });

        it("should have role=alert on error banner", async () => {
            const mockError: apiClient.ApiError = Object.assign(
                new Error("Error"),
                { code: "NETWORK_ERROR" as const }
            );
            vi.mocked(apiClient.startSession).mockRejectedValue(mockError);

            const user = userEvent.setup();
            renderWithSession(<WelcomePage />);

            await user.click(screen.getByTestId("get-started-button"));

            await waitFor(() => {
                const banner = screen.getByTestId("error-banner");
                expect(banner).toHaveAttribute("role", "alert");
            });
        });

        it("should focus error banner when it appears", async () => {
            const mockError: apiClient.ApiError = Object.assign(
                new Error("Error"),
                { code: "SERVER_ERROR" as const, status: 500 }
            );
            vi.mocked(apiClient.startSession).mockRejectedValue(mockError);

            const user = userEvent.setup();
            renderWithSession(<WelcomePage />);

            await user.click(screen.getByTestId("get-started-button"));

            await waitFor(() => {
                const banner = screen.getByTestId("error-banner");
                expect(banner).toHaveAttribute("tabindex", "0");
            });
        });

        it("should disable button during loading", async () => {
            vi.mocked(apiClient.startSession).mockImplementation(() => 
                new Promise((resolve) => {
                    setTimeout(() => resolve({ sessionId: "test" }), 50);
                })
            );

            const user = userEvent.setup();
            renderWithSession(<WelcomePage />);

            const button = screen.getByTestId("get-started-button");
            
            expect(button).not.toBeDisabled();

            await user.click(button);

            // Should be disabled immediately
            expect(button).toBeDisabled();
        });
    });
});

