"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface LinkTokenContextType {
    linkToken: string | null;
    setLinkToken: (token: string) => void;
    clearLinkToken: () => void;
}

const LinkTokenContext = createContext<LinkTokenContextType | undefined>(
    undefined
);

interface LinkTokenProviderProps {
    children: ReactNode;
}

const STORAGE_KEY = "surveyor_link_token";

export function LinkTokenProvider({ children }: LinkTokenProviderProps) {
    // Initialize from sessionStorage if available
    const [linkToken, setLinkTokenState] = useState<string | null>(() => {
        if (typeof window !== "undefined") {
            return sessionStorage.getItem(STORAGE_KEY);
        }
        return null;
    });

    const setLinkToken = (token: string) => {
        setLinkTokenState(token);
        if (typeof window !== "undefined") {
            sessionStorage.setItem(STORAGE_KEY, token);
        }
    };

    const clearLinkToken = () => {
        setLinkTokenState(null);
        if (typeof window !== "undefined") {
            sessionStorage.removeItem(STORAGE_KEY);
        }
    };

    // Sync with sessionStorage changes from other tabs/windows
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) {
                setLinkTokenState(e.newValue);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <LinkTokenContext.Provider
            value={{ linkToken, setLinkToken, clearLinkToken }}
        >
            {children}
        </LinkTokenContext.Provider>
    );
}

export function useLinkToken() {
    const context = useContext(LinkTokenContext);
    
    if (context === undefined) {
        throw new Error("useLinkToken must be used within a LinkTokenProvider");
    }
    
    return context;
}

