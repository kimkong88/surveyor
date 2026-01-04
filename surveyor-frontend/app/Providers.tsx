"use client";

import HeroUIProviderWrapper from "../components/HeroUIProviderWrapper";
import { LinkTokenProvider } from "../context/LinkTokenContext";
import { SessionProvider } from "../context/SessionContext";
import { ProgressProvider } from "../context/ProgressContext";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <HeroUIProviderWrapper>
            <LinkTokenProvider>
                <SessionProvider>
                    <ProgressProvider>{children}</ProgressProvider>
                </SessionProvider>
            </LinkTokenProvider>
        </HeroUIProviderWrapper>
    );
}
