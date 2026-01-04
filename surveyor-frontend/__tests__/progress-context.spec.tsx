/**
 * Progress Context Tests - Story 1.4
 * Tests for mock space and item state management for progress header
 */

import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import {
    ProgressProvider,
    useProgress,
    useProgressActions,
} from "../context/ProgressContext";

// Test component that uses the hooks
function TestComponent() {
    const progress = useProgress();
    const { toggleSpaceStatus, updateItemCount } = useProgressActions();

    return (
        <div>
            <div data-testid="total-spaces">{progress.totalSpaces}</div>
            <div data-testid="completed-spaces">{progress.completedSpaces}</div>
            <div data-testid="total-items">{progress.totalItems}</div>
            <div data-testid="spaces">
                {progress.spaces.map((s) => (
                    <div key={s.id} data-testid={`space-${s.id}`}>
                        <span data-testid={`space-${s.id}-name`}>{s.name}</span>
                        <span data-testid={`space-${s.id}-status`}>{s.status}</span>
                        <span data-testid={`space-${s.id}-itemCount`}>
                            {s.itemCount}
                        </span>
                    </div>
                ))}
            </div>
            <button
                onClick={() => toggleSpaceStatus("space-1")}
                data-testid="toggle-space-1"
            >
                Toggle Space 1
            </button>
            <button
                onClick={() => updateItemCount("space-1", 5)}
                data-testid="update-items-space-1"
            >
                Update Items
            </button>
        </div>
    );
}

describe("ProgressContext", () => {
    beforeEach(() => {
        // Reset any mocks if needed
    });

    describe("useProgress hook", () => {
        it("returns initial mock state with spaces and computed totals", () => {
            render(
                <ProgressProvider>
                    <TestComponent />
                </ProgressProvider>
            );

            // Should have default mock spaces
            expect(screen.getByTestId("total-spaces")).toHaveTextContent("7");
            expect(screen.getByTestId("completed-spaces")).toHaveTextContent("0");
            expect(screen.getByTestId("total-items")).toHaveTextContent("0");
        });

        it("computes completed spaces from spaces with status 'done' or 'complete'", () => {
            render(
                <ProgressProvider>
                    <TestComponent />
                </ProgressProvider>
            );

            // Initially no completed spaces
            expect(screen.getByTestId("completed-spaces")).toHaveTextContent("0");

            // Toggle a space to 'in-progress' (first toggle)
            act(() => {
                screen.getByTestId("toggle-space-1").click();
            });

            // Still no completed spaces (in-progress is not done)
            expect(screen.getByTestId("completed-spaces")).toHaveTextContent("0");

            // Toggle again to 'done' (second toggle)
            act(() => {
                screen.getByTestId("toggle-space-1").click();
            });

            // Should now show 1 completed space
            expect(screen.getByTestId("completed-spaces")).toHaveTextContent("1");
        });

        it("computes total items from all spaces", () => {
            render(
                <ProgressProvider>
                    <TestComponent />
                </ProgressProvider>
            );

            // Update item count for a space
            act(() => {
                screen.getByTestId("update-items-space-1").click();
            });

            // Total items should reflect the sum
            expect(screen.getByTestId("total-items")).toHaveTextContent("5");
        });
    });

    describe("useProgressActions hook", () => {
        it("toggles space status between 'not-started', 'in-progress', and 'done'", () => {
            render(
                <ProgressProvider>
                    <TestComponent />
                </ProgressProvider>
            );

            const space1Status = screen.getByTestId("space-space-1-status");

            // Initial state should be 'not-started'
            expect(space1Status).toHaveTextContent("not-started");

            // First toggle -> 'in-progress'
            act(() => {
                screen.getByTestId("toggle-space-1").click();
            });
            expect(space1Status).toHaveTextContent("in-progress");

            // Second toggle -> 'done'
            act(() => {
                screen.getByTestId("toggle-space-1").click();
            });
            expect(space1Status).toHaveTextContent("done");

            // Third toggle -> back to 'not-started'
            act(() => {
                screen.getByTestId("toggle-space-1").click();
            });
            expect(space1Status).toHaveTextContent("not-started");
        });

        it("updates item count for a specific space", () => {
            render(
                <ProgressProvider>
                    <TestComponent />
                </ProgressProvider>
            );

            const space1ItemCount = screen.getByTestId("space-space-1-itemCount");

            // Initial item count
            expect(space1ItemCount).toHaveTextContent("0");

            // Update item count
            act(() => {
                screen.getByTestId("update-items-space-1").click();
            });

            expect(space1ItemCount).toHaveTextContent("5");
        });

        it("recomputes totals when space status changes", () => {
            render(
                <ProgressProvider>
                    <TestComponent />
                </ProgressProvider>
            );

            // Set item count first
            act(() => {
                screen.getByTestId("update-items-space-1").click();
            });

            // Toggle to done
            act(() => {
                screen.getByTestId("toggle-space-1").click();
            });
            act(() => {
                screen.getByTestId("toggle-space-1").click();
            });

            // Should show 1 completed space and 5 total items
            expect(screen.getByTestId("completed-spaces")).toHaveTextContent("1");
            expect(screen.getByTestId("total-items")).toHaveTextContent("5");
        });
    });
});

