import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { LinkTokenProvider, useLinkToken } from "../context/LinkTokenContext";

// Test component to access the context
function TestComponent() {
    const { linkToken, setLinkToken, clearLinkToken } = useLinkToken();

    return (
        <div>
            <div data-testid="token-value">{linkToken || "no-token"}</div>
            <button onClick={() => setLinkToken("test-token-123")}>
                Set Token
            </button>
            <button onClick={clearLinkToken}>Clear Token</button>
        </div>
    );
}

describe("LinkTokenContext", () => {
    it("should provide default null token value", () => {
        render(
            <LinkTokenProvider>
                <TestComponent />
            </LinkTokenProvider>
        );

        expect(screen.getByTestId("token-value")).toHaveTextContent("no-token");
    });

    it("should allow setting token value", () => {
        render(
            <LinkTokenProvider>
                <TestComponent />
            </LinkTokenProvider>
        );

        const setButton = screen.getByText("Set Token");
        
        act(() => {
            setButton.click();
        });

        expect(screen.getByTestId("token-value")).toHaveTextContent(
            "test-token-123"
        );
    });

    it("should allow clearing token value", () => {
        render(
            <LinkTokenProvider>
                <TestComponent />
            </LinkTokenProvider>
        );

        const setButton = screen.getByText("Set Token");
        const clearButton = screen.getByText("Clear Token");

        act(() => {
            setButton.click();
        });

        expect(screen.getByTestId("token-value")).toHaveTextContent(
            "test-token-123"
        );

        act(() => {
            clearButton.click();
        });

        expect(screen.getByTestId("token-value")).toHaveTextContent("no-token");
    });

    it("should throw error when useLinkToken used outside provider", () => {
        // Suppress console.error for this test
        const originalError = console.error;
        console.error = () => {};

        expect(() => {
            render(<TestComponent />);
        }).toThrow();

        console.error = originalError;
    });

    it("should persist token to sessionStorage", () => {
        render(
            <LinkTokenProvider>
                <TestComponent />
            </LinkTokenProvider>
        );

        const setButton = screen.getByText("Set Token");
        
        act(() => {
            setButton.click();
        });

        // Token should be in sessionStorage
        expect(sessionStorage.getItem("surveyor_link_token")).toBe("test-token-123");
    });

    it("should remove token from sessionStorage when cleared", () => {
        render(
            <LinkTokenProvider>
                <TestComponent />
            </LinkTokenProvider>
        );

        const setButton = screen.getByText("Set Token");
        const clearButton = screen.getByText("Clear Token");
        
        act(() => {
            setButton.click();
        });

        expect(sessionStorage.getItem("surveyor_link_token")).toBe("test-token-123");

        act(() => {
            clearButton.click();
        });

        // Token should be removed from sessionStorage
        expect(sessionStorage.getItem("surveyor_link_token")).toBeNull();
    });

    it("should initialize from sessionStorage on mount", () => {
        // Pre-populate sessionStorage
        sessionStorage.setItem("surveyor_link_token", "existing-token");

        render(
            <LinkTokenProvider>
                <TestComponent />
            </LinkTokenProvider>
        );

        // Should display the token from sessionStorage
        expect(screen.getByTestId("token-value")).toHaveTextContent("existing-token");

        // Cleanup
        sessionStorage.removeItem("surveyor_link_token");
    });
});

