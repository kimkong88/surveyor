/**
 * Telemetry Utility
 * 
 * Provides client-side event tracking for analytics and observability.
 * Currently logs to console for development; will integrate with analytics service later.
 */

/**
 * Masks a token for safe logging
 * Shows limited preview and length to avoid PII leakage
 * For short tokens (<=12 chars), shows max 25% to avoid excessive exposure
 * For longer tokens, shows up to 6 characters
 * 
 * @param token - The token to mask
 * @returns Masked token string like "abc123…(len=32)"
 */
export function maskToken(token: string): string {
    if (!token || token.length === 0) {
        return "…(len=0)";
    }

    // For short tokens, show max 25% to avoid excessive exposure
    // For longer tokens, show up to 6 characters
    const previewLength =
        token.length <= 12
            ? Math.max(2, Math.floor(token.length * 0.25))
            : Math.min(6, token.length);

    const preview = token.substring(0, previewLength);
    return `${preview}…(len=${token.length})`;
}

/**
 * Tracks an event with optional data
 * 
 * @param eventName - Name of the event to track
 * @param data - Optional event data/properties
 */
export function trackEvent(eventName: string, data?: Record<string, unknown>): void {
    // For now, log to console
    // In production, this would send to an analytics service
    console.log("[Telemetry]", eventName, data);

    // Future: Send to analytics service
    // if (typeof window !== 'undefined' && window.analytics) {
    //     window.analytics.track(eventName, data);
    // }
}

/**
 * Tracks session start request event
 * 
 * @param token - The link token (will be masked for PII safety)
 */
export function trackSessionStartRequest(token: string): void {
    trackEvent('session_start_request', {
        token_preview: maskToken(token),
        timestamp: Date.now(),
    });
}

/**
 * Tracks successful session start event
 * 
 * @param sessionId - The created session ID (only length will be logged)
 * @param durationMs - Time taken to start the session in milliseconds
 */
export function trackSessionStartSuccess(sessionId: string, durationMs: number): void {
    trackEvent('session_start_success', {
        sessionId_length: sessionId.length,
        duration_ms: durationMs,
        timestamp: Date.now(),
    });
}

/**
 * Tracks failed session start event
 * 
 * @param errorCode - The error code from API
 * @param errorMessage - The error message (sanitized to remove PII)
 * @param durationMs - Time taken before failure in milliseconds
 */
export function trackSessionStartFailure(
    errorCode: string,
    errorMessage: string,
    durationMs: number
): void {
    // Sanitize error message to remove any potential PII
    const sanitizedMessage = errorMessage.replace(/[a-zA-Z0-9_-]{8,}/g, '[REDACTED]');
    
    trackEvent('session_start_failure', {
        error_code: errorCode,
        error_message: sanitizedMessage,
        duration_ms: durationMs,
        timestamp: Date.now(),
    });
}

/**
 * Tracks when idle banner is shown
 * @param idleSeconds - elapsed idle seconds when shown
 */
export function trackIdleBannerShown(idleSeconds: number): void {
    trackEvent("idle_banner_shown", {
        idle_seconds: idleSeconds,
        timestamp: Date.now(),
    });
}

/**
 * Tracks when idle banner continue is clicked
 * @param idleSeconds - elapsed idle seconds at continue
 */
export function trackIdleBannerContinue(idleSeconds: number): void {
    trackEvent("idle_banner_continue_clicked", {
        idle_seconds: idleSeconds,
        timestamp: Date.now(),
    });
}

