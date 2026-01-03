/**
 * Feature Flags Configuration
 *
 * Allows toggling features during development and integration.
 * In production, these could be controlled via environment variables or a feature flag service.
 */

export interface FeatureFlags {
    /**
     * Link Redemption Feature
     * Enables /s/[token] route and token validation flow
     * Story 1.2 - Link redemption (stub against API)
     */
    linkRedemption: boolean;

    // Add more feature flags here as needed
}

/**
 * Global window extension for runtime feature flag overrides
 * Useful for testing and debugging
 */
declare global {
    interface Window {
        __FEATURE_FLAGS__?: Partial<FeatureFlags>;
    }
}

/**
 * Default feature flag configuration
 * Features can be overridden via environment variables or window.__FEATURE_FLAGS__
 */
const defaultFlags: FeatureFlags = {
    linkRedemption: true, // Enabled by default for Story 1.2
};

/**
 * Gets the current feature flag configuration
 * Priority: window.__FEATURE_FLAGS__ > environment variables > defaults
 */
function getFeatureFlags(): FeatureFlags {
    let flags = { ...defaultFlags };

    // Override from environment variables
    if (typeof process !== "undefined" && process.env) {
        if (process.env.NEXT_PUBLIC_FEATURE_LINK_REDEMPTION !== undefined) {
            flags.linkRedemption =
                process.env.NEXT_PUBLIC_FEATURE_LINK_REDEMPTION === "true";
        }
    }

    // Override from window (for testing/debugging)
    if (typeof window !== "undefined" && window.__FEATURE_FLAGS__) {
        flags = { ...flags, ...window.__FEATURE_FLAGS__ };
    }

    return flags;
}

/**
 * Checks if a specific feature is enabled
 *
 * @param featureName - Name of the feature to check
 * @returns true if feature is enabled, false otherwise
 */
export function isFeatureEnabled(featureName: keyof FeatureFlags): boolean {
    const flags = getFeatureFlags();
    return flags[featureName] ?? false;
}
