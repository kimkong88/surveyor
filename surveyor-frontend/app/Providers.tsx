"use client";

import HeroUIProviderWrapper from "../components/HeroUIProviderWrapper";
import { LinkTokenProvider } from "../context/LinkTokenContext";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <HeroUIProviderWrapper>
            <LinkTokenProvider>{children}</LinkTokenProvider>
        </HeroUIProviderWrapper>
    );
}
