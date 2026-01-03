/**
 * API Client - Story 1.3
 *
 * Handles HTTP communication with the backend API.
 */

/**
 * API Error with structured error codes
 */
export interface ApiError extends Error {
    code:
        | "INVALID_TOKEN"
        | "TOKEN_EXPIRED"
        | "RATE_LIMITED"
        | "SERVER_ERROR"
        | "NETWORK_ERROR";
    status?: number;
}

/**
 * Parameters for starting a session
 */
export interface StartSessionParams {
    token: string;
}

/**
 * Response from session start endpoint
 */
export interface StartSessionResponse {
    sessionId: string;
}

/**
 * Creates a structured API error
 */
function createApiError(
    code: ApiError["code"],
    message: string,
    status?: number
): ApiError {
    const error = new Error(message) as ApiError;
    error.code = code;
    error.status = status;
    error.name = "ApiError";
    return error;
}

/**
 * Gets the API base URL from environment or defaults
 */
function getApiBaseUrl(): string {
    if (
        typeof process !== "undefined" &&
        process.env?.NEXT_PUBLIC_API_BASE_URL
    ) {
        return process.env.NEXT_PUBLIC_API_BASE_URL;
    }
    // Default to relative so same-origin works in any host
    return "";
}

/**
 * Gets the API timeout from environment or defaults
 */
function getApiTimeout(): number {
    if (typeof process !== "undefined" && process.env?.API_TIMEOUT_MS) {
        return parseInt(process.env.API_TIMEOUT_MS, 10);
    }
    return 10000; // 10 seconds default
}

/**
 * Starts a new survey session by redeeming a link token
 *
 * @param params - Parameters including the link token
 * @returns Promise resolving to session data with sessionId
 * @throws ApiError with specific error code for different failure scenarios
 */
export async function startSession(
    params: StartSessionParams
): Promise<StartSessionResponse> {
    const { token } = params;

    // Validate required token early to avoid bad calls and PII leakage
    if (!token || token.trim().length === 0) {
        throw createApiError("INVALID_TOKEN", "Token is required");
    }

    const baseUrl = getApiBaseUrl();
    const timeout = getApiTimeout();
    const url = `${baseUrl}/api/sessions/start`;

    try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Handle successful response
        if (response.ok) {
            const data = (await response.json()) as StartSessionResponse;
            return data;
        }

        // Handle error responses
        const errorData = (await response.json().catch(() => ({}))) as {
            code?: string;
            message?: string;
        };
        const errorMessage =
            errorData.message || response.statusText || "Request failed";

        // Map status codes to error codes
        switch (response.status) {
            case 400:
                throw createApiError("INVALID_TOKEN", errorMessage, 400);
            case 410:
                throw createApiError("TOKEN_EXPIRED", errorMessage, 410);
            case 429:
                throw createApiError("RATE_LIMITED", errorMessage, 429);
            case 500:
            case 502:
            case 503:
            case 504:
                throw createApiError(
                    "SERVER_ERROR",
                    errorMessage,
                    response.status
                );
            default:
                throw createApiError(
                    "SERVER_ERROR",
                    errorMessage,
                    response.status
                );
        }
    } catch (error) {
        // Handle network errors and timeouts

        // Re-throw if already an ApiError
        if (
            error &&
            typeof error === "object" &&
            "code" in error &&
            typeof (error as ApiError).code === "string"
        ) {
            throw error;
        }

        // Handle abort/timeout (DOMException or Error with AbortError)
        if (error && typeof error === "object" && "name" in error) {
            if ((error as { name: string }).name === "AbortError") {
                throw createApiError(
                    "NETWORK_ERROR",
                    `Request timeout after ${timeout}ms`
                );
            }
        }

        // Handle Error instances
        if (error instanceof Error) {
            // Check message for abort indication
            if (error.message?.includes("aborted")) {
                throw createApiError(
                    "NETWORK_ERROR",
                    `Request timeout after ${timeout}ms`
                );
            }

            // Handle other network errors
            throw createApiError(
                "NETWORK_ERROR",
                `Network request failed: ${error.message}`
            );
        }

        // Fallback for unknown errors
        throw createApiError("NETWORK_ERROR", "An unknown error occurred");
    }
}
