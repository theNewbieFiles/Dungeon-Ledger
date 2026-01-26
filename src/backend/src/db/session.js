
/**
 * Database connection pool instance.
 * @module db/db
 */
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
        VALUES ($1, $2, $3, $4, $5);
    `;

    const values = [userId, tokenHash, userAgent, ipAddress, expiresAt];

    try {
        const result = await pool.query(query, values);
        if (result.rowCount !== 1) {
            throw new Error("Failed to insert session into database");
        }
    } catch (err) {
        // Optionally, log error details here
        throw new Error("Database error while storing session", { cause: JSON.stringify(err) });
    }
} 

export async function getSessionByTokenHash(tokenHash) {
    //TODO: implement this function to retrieve session by token hash
}; 
  