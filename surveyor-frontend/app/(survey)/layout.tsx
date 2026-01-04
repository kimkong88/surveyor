"use client";

import { useEffect, useState } from "react";
import IdleBanner from "../../components/IdleBanner";
import ResponsiveLayout from "../../components/layout/ResponsiveLayout";
import ProgressHeader from "../../components/ProgressHeader";
import { useIdleTimer } from "../../hooks/useIdleTimer";
import {
    trackIdleBannerContinue,
    trackIdleBannerShown,
} from "../../lib/telemetry";

const DEFAULT_TIMEOUT_MS = 5 * 60_000;

export default function Layout({ children }: { children: React.ReactNode }) {
    const idleBannerEnabled =
        process.env.NEXT_PUBLIC_FEATURE_IDLE_BANNER !== "false";
    const configuredTimeout =
        Number(process.env.NEXT_PUBLIC_IDLE_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS;

    const { isIdle, reset, lastActiveAt } = useIdleTimer({
        timeoutMs: configuredTimeout,
        enabled: idleBannerEnabled,
    });

    const [hasLoggedShown, setHasLoggedShown] = useState(false);
    const [idleSeconds, setIdleSeconds] = useState(0);

    // Update idle seconds when idle state changes or periodically while idle
    useEffect(() => {
        if (!isIdle) {
            setIdleSeconds(0);
            return;
        }

        // Calculate immediately when becoming idle
        const calculateIdleSeconds = () => {
            return Math.max(0, (Date.now() - lastActiveAt) / 1000);
        };
        setIdleSeconds(calculateIdleSeconds());

        // Update every second while idle for accurate display
        const interval = setInterval(() => {
            setIdleSeconds(calculateIdleSeconds());
        }, 1000);

        return () => clearInterval(interval);
    }, [isIdle, lastActiveAt]);

    useEffect(() => {
        if (!idleBannerEnabled) return;
        if (isIdle && !hasLoggedShown) {
            try {
                trackIdleBannerShown(idleSeconds);
            } catch (error) {
                // Silently fail telemetry - don't break banner functionality
                console.warn("Failed to track idle banner shown:", error);
            }
            setHasLoggedShown(true);
        }
        if (!isIdle) {
            setHasLoggedShown(false);
        }
    }, [hasLoggedShown, idleBannerEnabled, idleSeconds, isIdle]);

    const handleContinue = () => {
        try {
            trackIdleBannerContinue(idleSeconds);
        } catch (error) {
            // Silently fail telemetry - don't break banner functionality
            console.warn("Failed to track idle banner continue:", error);
        }
        reset();
    };

    const showBanner = idleBannerEnabled && isIdle;

    return (
        <>
            <ProgressHeader />
            <IdleBanner
                visible={showBanner}
                onContinue={handleContinue}
                idleSeconds={idleSeconds}
            />
            <ResponsiveLayout>{children}</ResponsiveLayout>
        </>
    );
}
