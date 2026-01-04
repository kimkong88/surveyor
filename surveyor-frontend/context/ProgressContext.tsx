"use client";

/**
 * Progress Context - Story 1.4
 *
 * Manages mock space and item state for progress header counts.
 * UI-only: uses mock data; does not call backend.
 * State is colocated in context so future real data can swap in.
 */

import {
    createContext,
    useContext,
    useState,
    useMemo,
    ReactNode,
    ReactElement,
    useCallback,
} from "react";

/**
 * Space status type
 */
export type SpaceStatus = "not-started" | "in-progress" | "done" | "complete";

/**
 * Space state shape
 */
export interface Space {
    id: string;
    name: string;
    status: SpaceStatus;
    itemCount: number;
}

/**
 * Progress state with computed totals
 */
export interface ProgressState {
    spaces: Space[];
    totalSpaces: number;
    completedSpaces: number;
    totalItems: number;
}

/**
 * Progress context value including state and actions
 */
export interface ProgressContextValue extends ProgressState {
    toggleSpaceStatus: (spaceId: string) => void;
    updateItemCount: (spaceId: string, itemCount: number) => void;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(
    undefined
);

interface ProgressProviderProps {
    children: ReactNode;
}

/**
 * Default mock spaces for UI-only implementation
 */
const DEFAULT_MOCK_SPACES: Space[] = [
    { id: "space-1", name: "Living Room", status: "not-started", itemCount: 0 },
    { id: "space-2", name: "Kitchen", status: "not-started", itemCount: 0 },
    { id: "space-3", name: "Bedroom", status: "not-started", itemCount: 0 },
    { id: "space-4", name: "Bathroom", status: "not-started", itemCount: 0 },
    { id: "space-5", name: "Dining Room", status: "not-started", itemCount: 0 },
    { id: "space-6", name: "Office", status: "not-started", itemCount: 0 },
    { id: "space-7", name: "Garage", status: "not-started", itemCount: 0 },
];

/**
 * ProgressProvider component that wraps the app
 */
export function ProgressProvider({
    children,
}: ProgressProviderProps): ReactElement {
    const [spaces, setSpaces] = useState<Space[]>(DEFAULT_MOCK_SPACES);

    // Compute totals from spaces
    const totalSpaces = spaces.length;
    const completedSpaces = useMemo(() => {
        return spaces.filter(
            (s) => s.status === "done" || s.status === "complete"
        ).length;
    }, [spaces]);

    const totalItems = useMemo(() => {
        return spaces.reduce((sum, s) => sum + s.itemCount, 0);
    }, [spaces]);

    /**
     * Toggles space status: not-started -> in-progress -> done -> not-started
     */
    const toggleSpaceStatus = useCallback((spaceId: string) => {
        setSpaces((prev) =>
            prev.map((space) => {
                if (space.id !== spaceId) return space;

                const statusCycle: SpaceStatus[] = [
                    "not-started",
                    "in-progress",
                    "done",
                ];
                const currentIndex = statusCycle.indexOf(space.status);
                const nextIndex =
                    currentIndex === -1 || currentIndex === statusCycle.length - 1
                        ? 0
                        : currentIndex + 1;

                return {
                    ...space,
                    status: statusCycle[nextIndex],
                };
            })
        );
    }, []);

    /**
     * Updates item count for a specific space
     */
    const updateItemCount = useCallback(
        (spaceId: string, itemCount: number) => {
            setSpaces((prev) =>
                prev.map((space) =>
                    space.id === spaceId
                        ? { ...space, itemCount }
                        : space
                )
            );
        },
        []
    );

    const value: ProgressContextValue = {
        spaces,
        totalSpaces,
        completedSpaces,
        totalItems,
        toggleSpaceStatus,
        updateItemCount,
    };

    return (
        <ProgressContext.Provider value={value}>
            {children}
        </ProgressContext.Provider>
    );
}

/**
 * Hook to access progress state
 */
export function useProgress(): ProgressState {
    const context = useContext(ProgressContext);
    if (context === undefined) {
        throw new Error("useProgress must be used within a ProgressProvider");
    }
    return {
        spaces: context.spaces,
        totalSpaces: context.totalSpaces,
        completedSpaces: context.completedSpaces,
        totalItems: context.totalItems,
    };
}

/**
 * Hook to access progress actions
 */
export function useProgressActions(): {
    toggleSpaceStatus: (spaceId: string) => void;
    updateItemCount: (spaceId: string, itemCount: number) => void;
} {
    const context = useContext(ProgressContext);
    if (context === undefined) {
        throw new Error(
            "useProgressActions must be used within a ProgressProvider"
        );
    }
    return {
        toggleSpaceStatus: context.toggleSpaceStatus,
        updateItemCount: context.updateItemCount,
    };
}

