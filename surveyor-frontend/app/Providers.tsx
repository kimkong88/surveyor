"use client";

import HeroUIProviderWrapper from "../components/HeroUIProviderWrapper";

export default function Providers({ children }: { children: React.ReactNode }) {
    return <HeroUIProviderWrapper>{children}</HeroUIProviderWrapper>;
}
