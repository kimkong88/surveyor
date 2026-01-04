"use client";

/**
 * Progress Header Component - Story 1.4
 *
 * Displays progress header chip with item count and N/X spaces.
 * Uses HeroUI Chip and Progress components.
 */

import { Progress } from "@heroui/react";
import { useProgress } from "../context/ProgressContext";

export default function ProgressHeader() {
    const { completedSpaces, totalSpaces } = useProgress();

    const progressValue = (completedSpaces / totalSpaces) * 100;

    // TODO: this will be replaced with actual progress status,
    // eg: "Initializing", "Room 1", "Room 2", etc.
    let title = "Initializing";
    if (completedSpaces === totalSpaces) {
        title = "Finalizing";
    }

    const progressLabel = `${completedSpaces} of ${totalSpaces} space${
        totalSpaces !== 1 ? "s" : ""
    } complete`;

    return (
        <div
            role="group"
            aria-label="Progress indicators"
            className="px-6 py-4 border-b border-gray-200 shadow-xs"
        >
            <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold">{title}</h3>
            </div>
            <Progress value={progressValue} aria-label={progressLabel} />
        </div>
    );
}
