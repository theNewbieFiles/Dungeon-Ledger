import argon2id from "argon2";
import { generateRefreshToken } from "../refreshToken/generateRefreshToken.js";
import { storeSession } from "../../db/session.js";
import AppConfig from "../../config/appConfig.js";
import { ok, type Result } from "../../utilities/message.js";

export interface createSessionParams {
    userID: string;
    userAgent: string;
    ipAddress: string;
}

export type createSessionResults = {
    refreshToken: string; 
    sessionID: string;
}
export async function createSession(params: createSessionParams): Promise<Result<createSessionResults>> {
    const {
        userID,
        userAgent = "",
        ipAddress = ""
    } = params;


    // Create a random refresh token
    const refreshToken = generateRefreshToken();

    // Hash the token securely
    const hashedToken = await argon2id.hash(refreshToken);

    // Set expiration date (in ms)
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * AppConfig.Token_TTL_Days);

    // Store session in the database
    const sessionID = await storeSession({
        userID,
        hashedToken,
        expiresAt,
        userAgent,
        ipAddress,
    });

    return ok({
        refreshToken,
        sessionID,
    });
}