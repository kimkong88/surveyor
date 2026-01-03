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

