"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useLinkToken } from "../../../context/LinkTokenContext";
import { useSession, useStartSession } from "../../../context/SessionContext";

/**
 * Get user-friendly error message for error codes
 */
function getErrorMessage(errorCode?: string): string {
    switch (errorCode) {
        case "INVALID_TOKEN":
            return "This link is invalid. Please check your link and try again.";
        case "TOKEN_EXPIRED":
            return "This link has expired. Please request a new survey link.";
        case "RATE_LIMITED":
            return "Too many attempts. Please wait a moment and try again.";
        case "SERVER_ERROR":
            return "Server error occurred. Please try again later.";
        case "NETWORK_ERROR":
            return "Unable to connect. Please check your connection and try again.";
        default:
            return "An error occurred. Please try again.";
    }
}

export default function WelcomePage() {
    const { linkToken } = useLinkToken();
    const router = useRouter();
    const { sessionStatus, sessionErrorCode } = useSession();
    const { startSession } = useStartSession();
    const errorBannerRef = useRef<HTMLDivElement>(null);

    // Check if navigation is enabled via environment variable
    const shouldNavigate =
        process.env.NEXT_PUBLIC_START_SESSION_NAVIGATE !== "false";

    // Focus error banner when it appears
    useEffect(() => {
        if (sessionStatus === "error" && errorBannerRef.current) {
            errorBannerRef.current.focus();
        }
    }, [sessionStatus]);

    // Navigate to conversation page on successful session start
    useEffect(() => {
        if (sessionStatus === "ready" && shouldNavigate) {
            router.push("/conversation");
        }
    }, [sessionStatus, shouldNavigate, router]);

    // Handle "Get started" button click
    const handleGetStarted = async (): Promise<void> => {
        if (!linkToken || sessionStatus === "loading") {
            return;
        }

        try {
            await startSession(linkToken);
        } catch {
            // Error is handled by SessionContext state
            // No need to handle here
        }
    };

    // Require valid token to access welcome page
    if (!linkToken) {
        return (
            <section
                aria-labelledby="access-denied-title"
                className="flex min-h-screen items-center justify-center p-4"
            >
                <div className="max-w-md text-center">
                    <h1
                        id="access-denied-title"
                        className="text-2xl font-bold text-red-600 mb-4"
                    >
                        Access Required
                    </h1>
                    <p className="text-gray-700 mb-6">
                        You need a valid access link to start a survey. Please
                        check your email or SMS for the survey link.
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Go Home
                    </button>
                </div>
            </section>
        );
    }

    const isLoading = sessionStatus === "loading";
    const hasError = sessionStatus === "error";

    return (
        <section
            aria-labelledby="welcome-title"
            className="p-4 max-w-2xl mx-auto"
        >
            <h1 id="welcome-title" className="text-2xl font-bold mb-4">
                Welcome
            </h1>
            <p data-testid="permission-guidance" className="text-gray-700 mb-6">
                Before starting, you may be asked for camera and microphone
                permissions. You can continue without granting them now, and
                enable later when needed.
            </p>

            {/* Error Banner */}
            {hasError && (
                <div
                    ref={errorBannerRef}
                    role="alert"
                    tabIndex={0}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                    data-testid="error-banner"
                >
                    <div className="flex items-start">
                        <span className="text-2xl mr-3" aria-hidden="true">
                            ⚠️
                        </span>
                        <div className="flex-1">
                            <p className="text-red-800 font-semibold mb-2">
                                {getErrorMessage(sessionErrorCode)}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <button
                                    onClick={handleGetStarted}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                    data-testid="retry-button"
                                >
                                    Retry
                                </button>
                                <button
                                    onClick={() => router.push("/")}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                                    data-testid="go-home-button"
                                >
                                    Go Home
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Get Started Button */}
            <button
                type="button"
                onClick={handleGetStarted}
                disabled={isLoading}
                aria-busy={isLoading}
                aria-describedby="welcome-title"
                className={`
                    w-full px-6 py-3 rounded-lg font-semibold text-white transition-all
                    ${
                        isLoading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                    }
                `}
                data-testid="get-started-button"
            >
                {isLoading ? (
                    <span className="flex items-center justify-center">
                        <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        Starting session...
                    </span>
                ) : (
                    "Get started"
                )}
            </button>
        </section>
    );
}
