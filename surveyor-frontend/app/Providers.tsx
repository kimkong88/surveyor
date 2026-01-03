"use client";

import HeroUIProviderWrapper from "../components/HeroUIProviderWrapper";
import { LinkTokenProvider } from "../context/LinkTokenContext";
import { SessionProvider } from "../context/SessionContext";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <HeroUIProviderWrapper>
            <LinkTokenProvider>
                <SessionProvider>{children}</SessionProvider>
            </LinkTokenProvider>
        </HeroUIProviderWrapper>
    );
}
