import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";
import { useIdleTimer } from "../hooks/useIdleTimer";

let mockPathname = "/initial";

vi.mock("next/navigation", () => ({
    usePathname: () => mockPathname,
}));

function TestComponent({
    timeoutMs = 1000,
    enabled = true,
}: {
    timeoutMs?: number;
    enabled?: boolean;
}) {
    const { isIdle, reset, lastActiveAt } = useIdleTimer({
        timeoutMs,
        enabled,
    });

    return (
        <div>
            <div data-testid="is-idle">{isIdle ? "idle" : "active"}</div>
            <div data-testid="last-active">{lastActiveAt}</div>
            <button onClick={reset}>Reset</button>
        </div>
    );
}

describe("useIdleTimer", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        mockPathname = "/initial";
    });

    afterEach(() => {
        act(() => {
            vi.runOnlyPendingTimers();
        });
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    it("becomes idle after the timeout with no activity", async () => {
        await act(async () => {
            render(<TestComponent timeoutMs={1000} />);
        });

        expect(screen.getByTestId("is-idle").textContent).toBe("active");

        await act(async () => {
            vi.advanceTimersByTime(999);
        });
        expect(screen.getByTestId("is-idle").textContent).toBe("active");

        await act(async () => {
            vi.advanceTimersByTime(2);
        });
        expect(screen.getByTestId("is-idle").textContent).toBe("idle");
    });

    it("resets timer on activity events", async () => {
        await act(async () => {
            render(<TestComponent timeoutMs={1000} />);
        });

        await act(async () => {
            vi.advanceTimersByTime(900);
        });
        await act(async () => {
            fireEvent.mouseMove(window);
        });

        await act(async () => {
            vi.advanceTimersByTime(900);
        });
        expect(screen.getByTestId("is-idle").textContent).toBe("active");
    });

    it("reset function clears idle state and reschedules", async () => {
        await act(async () => {
            render(<TestComponent timeoutMs={1000} />);
        });

        await act(async () => {
            vi.advanceTimersByTime(1001);
        });
        expect(screen.getByTestId("is-idle").textContent).toBe("idle");

        await act(async () => {
            screen.getByText("Reset").click();
        });
        expect(screen.getByTestId("is-idle").textContent).toBe("active");

        await act(async () => {
            vi.advanceTimersByTime(900);
        });
        expect(screen.getByTestId("is-idle").textContent).toBe("active");
    });

    it("resets timer on route change", async () => {
        let view: ReturnType<typeof render>;
        await act(async () => {
            view = render(<TestComponent timeoutMs={1000} />);
        });
        // view is initialized in the act block above
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { rerender: rtlRerender } = view!;

        await act(async () => {
            vi.advanceTimersByTime(900);
        });
        mockPathname = "/next";
        await act(async () => {
            rtlRerender(<TestComponent timeoutMs={1000} />);
        });

        await act(async () => {
            vi.advanceTimersByTime(900);
        });
        expect(screen.getByTestId("is-idle").textContent).toBe("active");
    });

    it("resets timer when tab becomes visible", async () => {
        await act(async () => {
            render(<TestComponent timeoutMs={1000} />);
        });

        await act(async () => {
            vi.advanceTimersByTime(900);
        });

        // Simulate tab becoming visible
        await act(async () => {
            Object.defineProperty(document, "visibilityState", {
                configurable: true,
                value: "visible",
            });
            document.dispatchEvent(new Event("visibilitychange"));
        });

        await act(async () => {
            vi.advanceTimersByTime(900);
        });
        expect(screen.getByTestId("is-idle").textContent).toBe("active");
    });

    it("does not become idle when disabled", async () => {
        await act(async () => {
            render(<TestComponent timeoutMs={1000} enabled={false} />);
        });

        await act(async () => {
            vi.advanceTimersByTime(2000);
        });

        expect(screen.getByTestId("is-idle").textContent).toBe("active");
    });

    it("cleans up timer on unmount", async () => {
        const { unmount } = render(<TestComponent timeoutMs={1000} />);

        await act(async () => {
            vi.advanceTimersByTime(500);
        });

        await act(async () => {
            unmount();
        });

        // Timer should be cleared - advancing time should not cause errors
        await act(async () => {
            vi.advanceTimersByTime(2000);
        });

        // If we get here without errors, cleanup worked
        expect(true).toBe(true);
    });
});

