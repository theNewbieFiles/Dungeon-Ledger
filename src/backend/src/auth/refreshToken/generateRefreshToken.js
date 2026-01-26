import crypto from "crypto";
import AppConfig from "../../config/appConfig.js";

/**
 * Generates a random refresh token as a hexadecimal string.
 * @returns {string} A hexadecimal string representing the refresh token.
 */
export function generateRefreshToken() {
    return crypto.randomBytes(AppConfig.Refresh_Token_Length).toString("hex");
}

