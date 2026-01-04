"use client";

import { useEffect, useRef } from "react";

type IdleBannerProps = {
    visible: boolean;
    onContinue: () => void;
    idleSeconds: number;
};

/**
 * IdleBanner - informs users about inactivity with a continue action.
 */
export default function IdleBanner({
    visible,
    onContinue,
    idleSeconds,
}: IdleBannerProps) {
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (visible && buttonRef.current) {
            buttonRef.current.focus();
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <div
            role="status"
            aria-live="polite"
            className="w-full bg-amber-50 border-b border-amber-200 px-4 py-3 text-sm text-amber-900"
        >
            <div className="flex items-start gap-3">
                <div className="flex-1">
                    <p className="font-semibold">Are you still there?</p>
                    <p className="text-amber-900/80">
                        You have been idle for about {Math.floor(idleSeconds)}{" "}
                        seconds. Continue to keep your session active.
                    </p>
                </div>
                <button
                    ref={buttonRef}
                    onClick={onContinue}
                    onKeyDown={(e) => {
                        if (e.key === "Escape") {
                            e.preventDefault();
                            onContinue();
                        }
                    }}
                    className="inline-flex items-center rounded-md bg-amber-600 px-3 py-1.5 text-white text-sm font-semibold shadow-sm hover:bg-amber-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}

