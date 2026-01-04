/**
 * Progress Header Component Tests - Story 1.4
 * Tests for progress header component with Progress bar
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import React from "react";
import { render, screen, act } from "@testing-library/react";
import { ProgressProvider, useProgressActions } from "../../context/ProgressContext";
import ProgressHeader from "../../components/ProgressHeader";

describe("ProgressHeader", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders progress header with title and progress bar", () => {
        render(
            <ProgressProvider>
                <ProgressHeader />
            </ProgressProvider>
        );

        // Should show title
        expect(screen.getByText("Initializing")).toBeInTheDocument();
        
        // Should show progress bar
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("displays 'Initializing' title when no spaces are completed", () => {
        render(
            <ProgressProvider>
                <ProgressHeader />
            </ProgressProvider>
        );

        expect(screen.getByText("Initializing")).toBeInTheDocument();
        const progressBar = screen.getByRole("progressbar");
        expect(progressBar).toHaveAttribute("aria-valuenow", "0");
        expect(progressBar).toHaveAttribute("aria-valuetext", "0%");
    });

    it("displays 'Finalizing' title when all spaces are completed", () => {
        function TestWrapper() {
            const { toggleSpaceStatus } = useProgressActions();
            React.useEffect(() => {
                // Complete all 7 spaces
                for (let i = 1; i <= 7; i++) {
                    toggleSpaceStatus(`space-${i}`);
                    toggleSpaceStatus(`space-${i}`);
                }
            }, []);
            return <ProgressHeader />;
        }

        render(
            <ProgressProvider>
                <TestWrapper />
            </ProgressProvider>
        );

        expect(screen.getByText("Finalizing")).toBeInTheDocument();
        const progressBar = screen.getByRole("progressbar");
        expect(progressBar).toHaveAttribute("aria-valuenow", "100");
    });

    it("updates progress bar when space status changes", () => {
        function TestWrapper() {
            const { toggleSpaceStatus } = useProgressActions();
            return (
                <>
                    <ProgressHeader />
                    <button
                        onClick={() => {
                            toggleSpaceStatus("space-1");
                            toggleSpaceStatus("space-1");
                        }}
                        data-testid="complete-space"
                    >
                        Complete Space
                    </button>
                </>
            );
        }

        render(
            <ProgressProvider>
                <TestWrapper />
            </ProgressProvider>
        );

        const progressBar = screen.getByRole("progressbar");
        expect(progressBar).toHaveAttribute("aria-valuenow", "0");

        // Complete one space (1/7 = ~14.29%)
        act(() => {
            screen.getByTestId("complete-space").click();
        });

        // Progress should update (approximately 14%)
        const updatedProgressBar = screen.getByRole("progressbar");
        const valueNow = updatedProgressBar.getAttribute("aria-valuenow");
        expect(parseFloat(valueNow || "0")).toBeGreaterThan(0);
        expect(parseFloat(valueNow || "0")).toBeLessThan(20);
    });

    it("updates live without remount when state changes", () => {
        function TestWrapper() {
            const { toggleSpaceStatus } = useProgressActions();
            return (
                <>
                    <ProgressHeader />
                    <button
                        onClick={() => {
                            // Complete 2 spaces
                            toggleSpaceStatus("space-1");
                            toggleSpaceStatus("space-1");
                            toggleSpaceStatus("space-2");
                            toggleSpaceStatus("space-2");
                        }}
                        data-testid="complete-multiple"
                    >
                        Complete Multiple
                    </button>
                </>
            );
        }

        render(
            <ProgressProvider>
                <TestWrapper />
            </ProgressProvider>
        );

        const progressBar = screen.getByRole("progressbar");
        expect(progressBar).toHaveAttribute("aria-valuenow", "0");

        // Complete multiple spaces
        act(() => {
            screen.getByTestId("complete-multiple").click();
        });

        // Progress should update (2/7 = ~28.57%)
        const updatedProgressBar = screen.getByRole("progressbar");
        const valueNow = updatedProgressBar.getAttribute("aria-valuenow");
        expect(parseFloat(valueNow || "0")).toBeGreaterThan(25);
        expect(parseFloat(valueNow || "0")).toBeLessThan(30);
    });

    describe("Accessibility", () => {
        it("has role='group' with descriptive aria-label on container", () => {
            render(
                <ProgressProvider>
                    <ProgressHeader />
                </ProgressProvider>
            );

            const container = screen.getByRole("group");
            expect(container).toHaveAttribute("aria-label", "Progress indicators");
        });

        it("has accessible progress bar with aria attributes", () => {
            render(
                <ProgressProvider>
                    <ProgressHeader />
                </ProgressProvider>
            );

            const progressBar = screen.getByRole("progressbar");
            expect(progressBar).toHaveAttribute("aria-valuemin", "0");
            expect(progressBar).toHaveAttribute("aria-valuemax", "100");
            expect(progressBar).toHaveAttribute("aria-valuenow");
            expect(progressBar).toHaveAttribute("aria-valuetext");
        });

        it("updates progress bar aria attributes when progress changes", () => {
            function TestWrapper() {
                const { toggleSpaceStatus } = useProgressActions();
                return (
                    <>
                        <ProgressHeader />
                        <button
                            onClick={() => {
                                toggleSpaceStatus("space-1");
                                toggleSpaceStatus("space-1");
                            }}
                            data-testid="update-progress"
                        >
                            Update Progress
                        </button>
                    </>
                );
            }

            render(
                <ProgressProvider>
                    <TestWrapper />
                </ProgressProvider>
            );

            const progressBar = screen.getByRole("progressbar");
            expect(progressBar).toHaveAttribute("aria-valuenow", "0");

            act(() => {
                screen.getByTestId("update-progress").click();
            });

            const updatedProgressBar = screen.getByRole("progressbar");
            const valueNow = updatedProgressBar.getAttribute("aria-valuenow");
            expect(valueNow).not.toBe("0");
            expect(updatedProgressBar).toHaveAttribute("aria-valuetext");
        });

        it("has semantic heading for progress status", () => {
            render(
                <ProgressProvider>
                    <ProgressHeader />
                </ProgressProvider>
            );

            const heading = screen.getByRole("heading", { level: 3 });
            expect(heading).toHaveTextContent("Initializing");
        });
    });

    describe("Snapshots", () => {
        it("matches snapshot for initial state", () => {
            const { container } = render(
                <ProgressProvider>
                    <ProgressHeader />
                </ProgressProvider>
            );

            expect(container).toMatchSnapshot();
        });

        it("matches snapshot for updated state with completed spaces", () => {
            function TestWrapper() {
                const { toggleSpaceStatus } = useProgressActions();
                React.useEffect(() => {
                    // Complete 2 spaces
                    toggleSpaceStatus("space-1");
                    toggleSpaceStatus("space-1");
                    toggleSpaceStatus("space-2");
                    toggleSpaceStatus("space-2");
                }, []);
                return <ProgressHeader />;
            }

            const { container } = render(
                <ProgressProvider>
                    <TestWrapper />
                </ProgressProvider>
            );

            expect(container).toMatchSnapshot();
        });

        it("matches snapshot for finalizing state", () => {
            function TestWrapper() {
                const { toggleSpaceStatus } = useProgressActions();
                React.useEffect(() => {
                    // Complete all spaces
                    for (let i = 1; i <= 7; i++) {
                        toggleSpaceStatus(`space-${i}`);
                        toggleSpaceStatus(`space-${i}`);
                    }
                }, []);
                return <ProgressHeader />;
            }

            const { container } = render(
                <ProgressProvider>
                    <TestWrapper />
                </ProgressProvider>
            );

            expect(container).toMatchSnapshot();
        });
    });
});
