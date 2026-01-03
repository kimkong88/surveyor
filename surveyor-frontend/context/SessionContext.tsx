"use client";

/**
 * Session Context - Story 1.3
 *
 * Manages session state including sessionId, loading states, and error handling.
 * Persists sessionId to sessionStorage to survive page refreshes.
 */

import {
    createContext,
    useContext,
    useState,
    ReactNode,
    ReactElement,
    useRef,
    useCallback,
    useEffect,
} from "react";
import { startSession as apiStartSession, ApiError } from "../lib/api-client";
import {
    trackSessionStartRequest,
    trackSessionStartSuccess,
    trackSessionStartFailure,
} from "../lib/telemetry";

/**
 * Session state shape
 */
export interface SessionState {
    sessionId: string | null;
    sessionStatus: "idle" | "loading" | "ready" | "error";
    sessionErrorCode?: string;
}

/**
 * Session context value including state and actions
 */
export interface SessionContextValue extends SessionState {
    startSession: (token: string) => Promise<void>;
    reset: () => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(
    undefined
);

interface SessionProviderProps {
    children: ReactNode;
}

const STORAGE_KEY = "surveyor:sessionId";

/**
 * SessionProvider component that wraps the app
 */
export function SessionProvider({
    children,
}: SessionProviderProps): ReactElement {
    // Initialize sessionId from sessionStorage if available
    const [sessionId, setSessionId] = useState<string | null>(() => {
        if (typeof window !== "undefined") {
            return sessionStorage.getItem(STORAGE_KEY);
        }
        return null;
    });

    // Determine initial status based on whether we have a sessionId
    const [sessionStatus, setSessionStatus] = useState<
        SessionState["sessionStatus"]
    >(() => {
        if (
            typeof window !== "undefined" &&
            sessionStorage.getItem(STORAGE_KEY)
        ) {
            return "ready"; // We have a stored session
        }
        return "idle";
    });

    const [sessionErrorCode, setSessionErrorCode] = useState<
        string | undefined
    >(undefined);

    // Ref to prevent concurrent session start calls
    const isStartingRef = useRef(false);

    /**
     * Starts a new session by calling the API with the provided token
     */
    const startSession = useCallback(
        async (token: string): Promise<void> => {
            // Prevent concurrent calls
            if (isStartingRef.current) {
                return;
            }

            // Prevent starting if already have a session
            if (sessionStatus === "loading") {
                return;
            }

            isStartingRef.current = true;
            setSessionStatus("loading");
            setSessionErrorCode(undefined);

            // Track session start request
            trackSessionStartRequest(token);
            const startTime = Date.now();

            try {
                const response = await apiStartSession({ token });
                const duration = Date.now() - startTime;

                // Store sessionId in state and sessionStorage
                setSessionId(response.sessionId);
                setSessionStatus("ready");

                if (typeof window !== "undefined") {
                    sessionStorage.setItem(STORAGE_KEY, response.sessionId);
                }

                // Track success
                trackSessionStartSuccess(response.sessionId, duration);
            } catch (error) {
                const duration = Date.now() - startTime;

                // Handle API errors - store error state for UI to display
                setSessionStatus("error");

                let errorCode = "NETWORK_ERROR";
                let errorMessage = "Unknown error";

                if (error && typeof error === "object" && "code" in error) {
                    const apiError = error as ApiError;
                    errorCode = apiError.code;
                    errorMessage = apiError.message || errorCode;
                    setSessionErrorCode(apiError.code);
                } else {
                    setSessionErrorCode("NETWORK_ERROR");
                }

                // Track failure
                trackSessionStartFailure(errorCode, errorMessage, duration);

                // Error is handled via state - no need to re-throw
            } finally {
                isStartingRef.current = false;
            }
        },
        [sessionStatus]
    );

    /**
     * Resets session state and clears sessionStorage
     */
    const reset = useCallback((): void => {
        setSessionId(null);
        setSessionStatus("idle");
        setSessionErrorCode(undefined);
        isStartingRef.current = false;

        if (typeof window !== "undefined") {
            sessionStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    // Sync with sessionStorage changes from other tabs/windows
    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) {
                if (e.newValue) {
                    setSessionId(e.newValue);
                    setSessionStatus("ready");
                } else {
                    setSessionId(null);
                    setSessionStatus("idle");
                    setSessionErrorCode(undefined);
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const value: SessionContextValue = {
        sessionId,
        sessionStatus,
        sessionErrorCode,
        startSession,
        reset,
    };

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    );
}

/**
 * Hook to access session state
 */
export function useSession(): SessionState {
    const context = useContext(SessionContext);

    if (context === undefined) {
        throw new Error("useSession must be used within a SessionProvider");
    }

    return {
        sessionId: context.sessionId,
        sessionStatus: context.sessionStatus,
        sessionErrorCode: context.sessionErrorCode,
    };
}

/**
 * Hook to access session actions
 */
export function useStartSession(): {
    startSession: (token: string) => Promise<void>;
    reset: () => void;
} {
    const context = useContext(SessionContext);

    if (context === undefined) {
        throw new Error(
            "useStartSession must be used within a SessionProvider"
        );
    }

    return {
        startSession: context.startSession,
        reset: context.reset,
    };
}
