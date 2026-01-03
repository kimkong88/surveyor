import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import WelcomePage from "../app/welcome/page";

const mockPush = vi.fn();

// Mock Next.js router
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

// Mock the context to control token state
let mockTokenValue: string | null = null;

vi.mock("../context/LinkTokenContext", async () => {
    const actual = await vi.importActual("../context/LinkTokenContext");
    return {
        ...actual,
        useLinkToken: () => ({
            linkToken: mockTokenValue,
            setLinkToken: vi.fn(),
            clearLinkToken: vi.fn(),
        }),
    };
});

describe("Welcome Page Protection", () => {
    beforeEach(() => {
        mockPush.mockClear();
        mockTokenValue = null;
    });

    it("should show access denied when no token is present", () => {
        mockTokenValue = null;

        render(<WelcomePage />);

        // Should show access denied message
        expect(screen.getByText(/access required/i)).toBeInTheDocument();
        expect(screen.queryByText(/start survey/i)).not.toBeInTheDocument();
    });

    it("should show welcome content when token is present", () => {
        mockTokenValue = "valid-token-123";

        render(<WelcomePage />);

        // Should show welcome content
        expect(screen.getByText(/welcome/i)).toBeInTheDocument();
        expect(screen.getByText(/start survey/i)).toBeInTheDocument();
    });

    it("should provide link to get access when denied", () => {
        mockTokenValue = null;

        render(<WelcomePage />);

        // Should have a way to get access
        const getAccessButton = screen.getByRole("button", { name: /home/i });
        expect(getAccessButton).toBeInTheDocument();
    });
});

