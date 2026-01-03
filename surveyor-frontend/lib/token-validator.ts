/**
 * Token Format Validator
 *
 * Validates token format for link redemption.
 * Keeps validation minimal - backend will do comprehensive validation.
 *
 * Rules:
 * - Alphanumeric with dashes allowed
 * - Length between 8 and 256 characters
 * - No special characters that could indicate injection attempts
 */

const TOKEN_MIN_LENGTH = 8;
const TOKEN_MAX_LENGTH = 256;

/**
 * Validates token format against basic security and format rules
 * @param token - The token string to validate
 * @returns true if token format is valid, false otherwise
 */
export function validateTokenFormat(token: unknown): boolean {
    // Handle null/undefined
    if (token == null || typeof token !== "string") {
        return false;
    }

    // Check length
    if (token.length < TOKEN_MIN_LENGTH || token.length > TOKEN_MAX_LENGTH) {
        return false;
    }

    // Allow alphanumeric, dashes, and underscores only
    // This prevents XSS, path traversal, and other injection attempts
    const validTokenPattern = /^[a-zA-Z0-9\-_]+$/;

    return validTokenPattern.test(token);
}

/**
 * Alias for validateTokenFormat for more readable code
 */
export function isValidToken(token: unknown): boolean {
    return validateTokenFormat(token);
}
