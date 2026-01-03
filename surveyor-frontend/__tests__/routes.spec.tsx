import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AppLayout from "../components/AppLayout";
import WelcomePage from "../app/welcome/page";
import ConversationPage from "../app/conversation/page";
import SubmitPage from "../app/submit/page";

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

    it("Welcome page shows permission guidance and control placeholders exist", () => {
        renderWithLayout(<WelcomePage />);
        expect(screen.getByTestId("permission-guidance")).toBeInTheDocument();
        expect(screen.getByLabelText("Voice controls")).toBeInTheDocument();
        expect(screen.getByLabelText("Text controls")).toBeInTheDocument();
    });
});
