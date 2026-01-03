import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AppLayout from "../components/AppLayout";
import WelcomePage from "../app/welcome/page";
import ConversationPage from "../app/conversation/page";
import SubmitPage from "../app/submit/page";

// Mock Next.js router
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
}));

// Mock the context to provide a valid token for Welcome page tests
vi.mock("../context/LinkTokenContext", async () => {
    const actual = await vi.importActual("../context/LinkTokenContext");
    return {
        ...actual,
        useLinkToken: () => ({
            linkToken: "test-token-for-welcome",
            setLinkToken: vi.fn(),
            clearLinkToken: vi.fn(),
        }),
    };
});

// Mock SessionContext
vi.mock("../context/SessionContext", async () => {
    const actual = await vi.importActual("../context/SessionContext");
    return {
        ...actual,
        useSession: () => ({
            sessionId: null,
            sessionStatus: 'idle' as const,
            sessionErrorCode: undefined,
        }),
        useStartSession: () => ({
            startSession: vi.fn(),
            reset: vi.fn(),
        }),
    };
});

function renderWithLayout(node: React.ReactNode) {
    return render(<AppLayout>{node}</AppLayout>);
}

describe("Routing skeleton screens", () => {
    it("Welcome page renders a primary CTA", () => {
        renderWithLayout(<WelcomePage />);
        expect(screen.getByRole("button", { name: /start/i })).toBeDefined();
    });

    it("Conversation page has header and footer landmarks", () => {
        renderWithLayout(<ConversationPage />);
        expect(screen.getByRole("banner")).toBeDefined();
        expect(screen.getByRole("contentinfo")).toBeDefined();
    });

    it("Submit page has header and footer landmarks", () => {
        renderWithLayout(<SubmitPage />);
        expect(screen.getByRole("banner")).toBeDefined();
        expect(screen.getByRole("contentinfo")).toBeDefined();
    });

    it("Welcome page shows permission guidance", () => {
        renderWithLayout(<WelcomePage />);
        expect(screen.getByTestId("permission-guidance")).toBeInTheDocument();
    });
});
