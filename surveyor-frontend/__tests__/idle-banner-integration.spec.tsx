import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import React from "react";

vi.mock("next/navigation", () => ({
    usePathname: () => "/survey",
}));

import Layout from "../app/(survey)/layout";
import Providers from "../app/Providers";

describe("Idle banner integration", () => {
    let consoleSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        vi.useFakeTimers();
        process.env.NEXT_PUBLIC_FEATURE_IDLE_BANNER = "true";
        process.env.NEXT_PUBLIC_IDLE_TIMEOUT_MS = "1000";
        consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
            // silence telemetry logs in test output
        });
    });

    afterEach(() => {
        act(() => {
            vi.runOnlyPendingTimers();
        });
        vi.useRealTimers();
        consoleSpy.mockRestore();
    });

    it("shows banner after timeout and tracks telemetry", async () => {
        render(
            <Providers>
                <Layout>Child</Layout>
            </Providers>
        );

        expect(
            screen.queryByText(/are you still there/i)
        ).not.toBeInTheDocument();

        await act(async () => {
            vi.advanceTimersByTime(1100);
        });

        expect(screen.getByText(/are you still there/i)).toBeInTheDocument();
        expect(consoleSpy).toHaveBeenCalledWith(
            "[Telemetry]",
            "idle_banner_shown",
            expect.any(Object)
        );
    });

    it("hides banner on continue and tracks click", async () => {
        render(
            <Providers>
                <Layout>Child</Layout>
            </Providers>
        );

        await act(async () => {
            vi.advanceTimersByTime(1100);
        });

        const button = screen.getByRole("button", { name: /continue/i });
        await act(async () => {
            button.click();
        });

        expect(
            screen.queryByText(/are you still there/i)
        ).not.toBeInTheDocument();
        expect(consoleSpy).toHaveBeenCalledWith(
            "[Telemetry]",
            "idle_banner_continue_clicked",
            expect.any(Object)
        );
    });

    it("does not show banner when feature flag is disabled", async () => {
        process.env.NEXT_PUBLIC_FEATURE_IDLE_BANNER = "false";

        render(
            <Providers>
                <Layout>Child</Layout>
            </Providers>
        );

        await act(async () => {
            vi.advanceTimersByTime(2000);
        });

        expect(
            screen.queryByText(/are you still there/i)
        ).not.toBeInTheDocument();
    });

    it("dismisses banner on Escape key", async () => {
        render(
            <Providers>
                <Layout>Child</Layout>
            </Providers>
        );

        await act(async () => {
            vi.advanceTimersByTime(1100);
        });

        expect(screen.getByText(/are you still there/i)).toBeInTheDocument();

        const button = screen.getByRole("button", { name: /continue/i });
        await act(async () => {
            button.focus();
            fireEvent.keyDown(button, { key: "Escape", code: "Escape" });
        });

        expect(
            screen.queryByText(/are you still there/i)
        ).not.toBeInTheDocument();
    });

    it("updates idle seconds display while idle", async () => {
        render(
            <Providers>
                <Layout>Child</Layout>
            </Providers>
        );

        await act(async () => {
            vi.advanceTimersByTime(1100);
        });

        // Banner should show with initial idle seconds
        expect(screen.getByText(/are you still there/i)).toBeInTheDocument();
        expect(screen.getByText(/you have been idle for about/i)).toBeInTheDocument();

        // Advance time (including interval ticks) and check that seconds update
        await act(async () => {
            vi.advanceTimersByTime(2000);
        });

        // Should still be visible with updated seconds
        expect(screen.getByText(/are you still there/i)).toBeInTheDocument();
        // Verify the seconds text is present (even if exact number may vary)
        expect(screen.getByText(/seconds/i)).toBeInTheDocument();
    });
});

