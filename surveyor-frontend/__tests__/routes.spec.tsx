import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import RootLayout from "../app/layout";
import WelcomePage from "../app/welcome/page";
import ConversationPage from "../app/conversation/page";
import CapturePage from "../app/capture/page";
import InventoryPage from "../app/inventory/page";
import SubmitPage from "../app/submit/page";

function renderWithLayout(node: React.ReactNode) {
    return render(<RootLayout>{node}</RootLayout>);
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

    it("Capture page has header and footer landmarks", () => {
        renderWithLayout(<CapturePage />);
        expect(screen.getByRole("banner")).toBeDefined();
        expect(screen.getByRole("contentinfo")).toBeDefined();
    });

    it("Inventory page has header and footer landmarks", () => {
        renderWithLayout(<InventoryPage />);
        expect(screen.getByRole("banner")).toBeDefined();
        expect(screen.getByRole("contentinfo")).toBeDefined();
    });

    it("Submit page has header and footer landmarks", () => {
        renderWithLayout(<SubmitPage />);
        expect(screen.getByRole("banner")).toBeDefined();
        expect(screen.getByRole("contentinfo")).toBeDefined();
    });
});
