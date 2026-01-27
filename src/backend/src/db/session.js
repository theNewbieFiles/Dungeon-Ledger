
/**
 * Database connection pool instance.
 * @module db/db
 */
import argon2id from "argon2";
import pool from "./db.js";



/**
 * Stores a session in the database for refresh token tracking.
 *
 * @param {Object} sessionData - The session data to store.
 * @param {string|number} sessionData.userId - The user's unique identifier.
 * @param {string} sessionData.tokenHash - The hashed refresh token.
 * @param {string|Date} sessionData.expiresAt - The expiration date/time of the session.
 * @param {string} [sessionData.userAgent] - The user's browser or client info (optional).
 * @param {string} [sessionData.ipAddress] - The user's IP address (optional).
 * @throws {Error} If the session could not be inserted into the database.
 * @returns {Promise<void>} Resolves if the session is stored successfully.
 */
export async function storeSession(sessionData) {

    const {
        userId, 
        tokenHash,
        expiresAt, 
        userAgent = "", 
        ipAddress = "", 
    } = sessionData;

    const query = `
        INSERT INTO sessions (user_id, token_hash, user_agent, ip_address, expires_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
    `;

    const values = [userId, tokenHash, userAgent, ipAddress, expiresAt];

    try {
        const result = await pool.query(query, values);
        if (result.rowCount !== 1) {
            throw new Error("Failed to insert session into database");
        }
        const sessionID = result.rows[0].id;
        return sessionID;
    } catch (err) {
        // Optionally, log error details here
        throw new Error("Database error while storing session", { cause: JSON.stringify(err) });
    }
} 

export async function getSessionTokenByID(id) {
    const query = `
        SELECT user_id, token_hash
        FROM sessions
        WHERE id = $1 AND revoked_at IS NULL;
    `;

    try {
        return await pool.query(query, [id]);

    } catch (err) {
        console.error("DB error:", err); 
        throw new Error("Database error while retrieving session");
    }
}; 

export async function invalidateSession(id) {
    const query = `
        UPDATE sessions 
        SET revoked_at = NOW()
        WHERE id = $1 AND revoked_at IS NULL;
    `; 
    try {
        return await pool.query(query, [id]);

    } catch (err) { 
        console.error("DB error:", err); 
        throw new Error("Database error while invalidating session");
    }
}
  
export async function recordLoginEvent(userID, sessionId = null) {
    const query = `
        INSERT INTO login_events (user_id, session_id, event_type, created_at)
        VALUES ($1, $2, 'login', NOW());
    `;

    //console.log(userId, sessionId);

    try {
        await pool.query(query, [userID, sessionId]);
    } catch (err) {
        throw new Error("Database error while recording login event", { 
            cause: JSON.stringify(err),
        });
    }
}

export async function recordLogoutEvent(userID, sessionId = null) {
    const query = `
        INSERT INTO login_events (user_id, session_id, event_type, created_at)
        VALUES ($1, $2, 'logout', NOW());
    `;

    try {
        await pool.query(query, [userID, sessionId]);
    } catch (err) {
        throw new Error("Database error while recording logout event", { 
            cause: JSON.stringify(err),
        });
    }
}
