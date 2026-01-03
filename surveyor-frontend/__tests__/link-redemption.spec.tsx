import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { LinkTokenProvider } from "../context/LinkTokenContext";
import * as telemetry from "../lib/telemetry";

const mockPush = vi.fn();
const mockReplace = vi.fn();
let mockToken = "valid-test-token-123";

// Mock Next.js router
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
        replace: mockReplace,
    }),
    useParams: () => ({
        token: mockToken,
    }),
}));

describe("Link Redemption Route /s/[token]", () => {
    beforeEach(() => {
        mockPush.mockClear();
        mockReplace.mockClear();
        mockToken = "valid-test-token-123";
        vi.clearAllMocks();
    });

    it("should render loading state initially", async () => {
        const TokenPage = (await import("../app/s/[token]/page")).default;
        render(
            <LinkTokenProvider>
                <TokenPage />
            </LinkTokenProvider>
        );
        
        // Should show some loading indicator
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it("should navigate to welcome page with valid token", async () => {
        const TokenPage = (await import("../app/s/[token]/page")).default;
        render(
            <LinkTokenProvider>
                <TokenPage />
            </LinkTokenProvider>
        );
        
        // Should redirect to welcome
        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith("/welcome");
        }, { timeout: 2000 });
    });

    it("should show error for invalid token format", async () => {
        // Set invalid token for this test
        mockToken = "invalid!token@#$";

        const TokenPage = (await import("../app/s/[token]/page")).default;
        render(
            <LinkTokenProvider>
                <TokenPage />
            </LinkTokenProvider>
        );
        
        // Should show error heading
        await waitFor(() => {
            expect(screen.getByRole("heading", { name: /invalid link/i })).toBeInTheDocument();
        }, { timeout: 2000 });

        // Should show Go Home button
        expect(screen.getByRole("button", { name: /go home/i })).toBeInTheDocument();

        // Should not have redirected
        expect(mockReplace).not.toHaveBeenCalled();
    });

    it("should emit link_opened telemetry event with masked token", async () => {
        const trackEventSpy = vi.spyOn(telemetry, "trackEvent");
        
        const TokenPage = (await import("../app/s/[token]/page")).default;
        render(
            <LinkTokenProvider>
                <TokenPage />
            </LinkTokenProvider>
        );
        
        // Should have called trackEvent with masked token
        // Token is "valid-test-token-123" = 20 chars, shows up to 6 chars
        expect(trackEventSpy).toHaveBeenCalledWith("link_opened", {
            token_preview: "valid-…(len=20)",
        });
    });
});

