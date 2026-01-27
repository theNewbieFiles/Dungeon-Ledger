import argon2id from "argon2";
import { generateRefreshToken } from "../refreshToken/generateRefreshToken.js";
import { storeSession } from "../../db/session.js";
import AppConfig from "../../config/appConfig.js";
import { ok } from "../../utilities/message.js";


/**
 * Creates a new session for a user, generating and storing a refresh token.
 *
 * @param {Object} params - The session creation parameters.
 * @param {string|number} params.userId - The user's unique identifier.
 * @param {string} [params.userAgent] - The user's browser or client info (optional).
 * @param {string} [params.ipAddress] - The user's IP address (optional).
 * @returns {Promise<string>} The plain refresh token to be sent to the client.
 * @throws {Error} If session creation fails at any step.
 */
export async function createSession({ userId, userAgent = "", ipAddress = "" }) {
    try {
        // Create a random refresh token
        const refreshToken = generateRefreshToken();
 
        // Hash the token securely
        const hashedToken = await argon2id.hash(refreshToken);

        // Set expiration date (in ms)
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * AppConfig.Token_TTL_Days);

        // Store session in the database
        const sessionID = await storeSession({
            userId,
            tokenHash: hashedToken,
            expiresAt: expiresAt,
            userAgent,
            ipAddress,
        });

        return ok({
            refreshToken, 
            sessionID,
        });

    } catch (error) {
        throw new Error("Error creating refresh token", { cause: error });
    }
}