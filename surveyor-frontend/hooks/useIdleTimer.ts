"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type UseIdleTimerOptions = {
    timeoutMs?: number;
    enabled?: boolean;
};

const DEFAULT_TIMEOUT_MS = 5 * 60_000;

/**
 * useIdleTimer - detects client-side inactivity and exposes idle state/reset
 */
export function useIdleTimer({
    timeoutMs = DEFAULT_TIMEOUT_MS,
    enabled = true,
}: UseIdleTimerOptions = {}) {
    const pathname = usePathname();
    const [isIdle, setIsIdle] = useState(false);
    const [lastActiveAt, setLastActiveAt] = useState<number>(() => Date.now());

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearTimer = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const scheduleTimer = useCallback(() => {
        if (!enabled) return;
        clearTimer();
        timeoutRef.current = setTimeout(() => {
            setIsIdle(true);
        }, timeoutMs);
    }, [clearTimer, enabled, timeoutMs]);

    const markActive = useCallback(() => {
        if (!enabled) return;
        setIsIdle(false);
        setLastActiveAt(Date.now());
        scheduleTimer();
    }, [enabled, scheduleTimer]);

    const reset = useCallback(() => {
        markActive();
    }, [markActive]);

    // Initialize and reschedule when timeout or enabled changes
    useEffect(() => {
        if (!enabled) {
            clearTimer();
            setIsIdle(false);
            return;
        }
        markActive();
        return () => clearTimer();
    }, [enabled, timeoutMs, markActive, clearTimer]);

    // Activity listeners
    useEffect(() => {
        if (!enabled) return;
        const handleActivity = () => markActive();
        const events: Array<keyof WindowEventMap> = [
            "mousemove",
            "mousedown",
            "keydown",
            "touchstart",
        ];
        events.forEach((event) =>
            window.addEventListener(event, handleActivity)
        );

        const handleVisibility = () => {
            if (document.visibilityState === "visible") {
                markActive();
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            events.forEach((event) =>
                window.removeEventListener(event, handleActivity)
            );
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, [enabled, markActive]);

    // Reset on route change
    useEffect(() => {
        if (!enabled) return;
        markActive();
    }, [pathname, enabled, markActive]);

    // Cleanup on unmount
    useEffect(() => () => clearTimer(), [clearTimer]);

    return { isIdle, reset, lastActiveAt };
}

