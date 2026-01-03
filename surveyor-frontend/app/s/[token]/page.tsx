"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { validateTokenFormat } from "../../../lib/token-validator";
import { useLinkToken } from "../../../context/LinkTokenContext";
import { trackEvent, maskToken } from "../../../lib/telemetry";
import { isFeatureEnabled } from "../../../lib/feature-flags";

type ErrorType = "disabled" | "invalid" | null;

export default function TokenRedemptionPage() {
    const params = useParams();
    const router = useRouter();
    const token = params.token as string;
    const { setLinkToken } = useLinkToken();
    const [errorType, setErrorType] = useState<ErrorType>(null);
    const hasProcessed = useRef(false);

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        // Prevent multiple executions
        if (hasProcessed.current) return;
        hasProcessed.current = true;

        // Check if link redemption feature is enabled
        if (!isFeatureEnabled("linkRedemption")) {
            setErrorType("disabled");
            return;
        }

        // Emit telemetry event for link opened
        trackEvent("link_opened", {
            token_preview: maskToken(token),
        });

        // Validate token format
        if (!validateTokenFormat(token)) {
            setErrorType("invalid");
            return;
        }

        // Store token in state
        setLinkToken(token);

        // Navigate to welcome page
        router.replace("/welcome");
    }, [token, setLinkToken, router]);
    /* eslint-enable react-hooks/set-state-in-effect */

    // Error state
    if (errorType) {
        const errorConfig = {
            disabled: {
                title: "Feature Unavailable",
                message:
                    "This feature is currently disabled. Please try again later or contact support.",
            },
            invalid: {
                title: "Invalid Link",
                message:
                    "Invalid access link. Please check your link and try again.",
            },
        };

        const { title, message } = errorConfig[errorType];

        return (
            <main
                role="main"
                className="flex min-h-screen items-center justify-center p-4"
            >
                <div className="max-w-md text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">
                        {title}
                    </h1>
                    <p className="text-gray-700 mb-6">{message}</p>
                    <div className="space-y-3">
                        <button
                            onClick={() => router.push("/")}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Go Home
                        </button>
                        <p className="text-sm text-gray-500">
                            Need help? Contact support
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    // Loading state (shown while redirecting)
    return (
        <main
            role="main"
            className="flex min-h-screen items-center justify-center"
        >
            <div className="text-center" role="status" aria-live="polite">
                <p>Loading...</p>
                <p className="text-sm text-gray-500">
                    Validating your access link
                </p>
            </div>
        </main>
    );
}
