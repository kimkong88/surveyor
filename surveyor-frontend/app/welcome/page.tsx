"use client";

import { useRouter } from "next/navigation";
import { useLinkToken } from "../../context/LinkTokenContext";

export default function WelcomePage() {
    const { linkToken } = useLinkToken();
    const router = useRouter();

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

    return (
        <section aria-labelledby="welcome-title" className="p-4">
            <h1 id="welcome-title">Welcome</h1>
            <p data-testid="permission-guidance">
                Before starting, you may be asked for camera and microphone
                permissions. You can continue without granting them now, and
                enable later when needed.
            </p>
            <button type="button" aria-describedby="welcome-title">
                Start survey
            </button>
        </section>
    );
}
