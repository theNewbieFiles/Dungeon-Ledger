import pool from "./db.js";
import logger from "../utilities/logger.js";   
export interface NewSession {
    userID: string;
    hashedToken: string;
    userAgent?: string;
    ipAddress?: string;
    expiresAt: Date;
}

export interface SessionRow {
    id: string;
    user_id: string;
    token_hash: string;
    user_agent: string;
    ip_address: string;
    created_at: Date;
    expires_at: Date;
    revoked_at: Date | null;
}

export async function storeSession(sessionData: NewSession): Promise<string> {

    const {
        userID,
        hashedToken,
        expiresAt,
        userAgent = "",
        ipAddress = "",
    } = sessionData;

    const query = `
        INSERT INTO sessions (user_id, token_hash, user_agent, ip_address, expires_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
    `;

    const values = [userID, hashedToken, userAgent, ipAddress, expiresAt];

    try {
        const result = await pool.query(query, values);
        if (result.rowCount !== 1) {
            throw new Error("Failed to insert session into database");
        }
        const { id } = result.rows[0];
        return id;
    } catch (err) {
        logger.error({ sessionData }, "Database error while storing session")
        throw new Error("Database error while storing session");
    }
}

export interface SessionTokenRow { user_id: string; token_hash: string; expires_at: Date;}
export async function getSessionTokenByID(id: string): Promise<SessionTokenRow | null> {
    const query = `
        SELECT user_id, token_hash, expires_at
        FROM sessions
        WHERE id = $1;
    `;

    try {
        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            return null; //there is no session with that id
        }

        return {
            user_id: result.rows[0].user_id,
            token_hash: result.rows[0].token_hash,
            expires_at: result.rows[0].expires_at,

        };

    } catch (err) {
        logger.error({ id, err }, "Database error while retrieving session");
        throw err;
    }
}



export async function invalidateSession(id: string): Promise<boolean> {
    const query = `
        UPDATE sessions 
        SET revoked_at = NOW()
        WHERE id = $1 AND revoked_at IS NULL;
    `;
    try {
        const result = await pool.query(query, [id]);

        return result.rowCount === 1;

    } catch (err) {
        logger.error({ id, err }, "Database error while invalidating session");
        throw new Error("Database error while invalidating session");
    }
}


export async function recordLoginEvent(userID: string, sessionId: string) {
    const query = `
        INSERT INTO login_events (user_id, session_id, event_type)
        VALUES ($1, $2, 'login');
    `;

    try {
        await pool.query(query, [userID, sessionId]);
    } catch (err) {
        logger.error({ userID, sessionId, err }, "Database error while recording event");
    }
}

export async function recordLogoutEvent(userID: string, sessionId: string | null = null) {
    const query = `
        INSERT INTO login_events (user_id, session_id, event_type)
        VALUES ($1, $2, 'logout');
    `;

    try {
        await pool.query(query, [userID, sessionId]);
    } catch (err) {
        logger.error({ userID, sessionId, err }, "Database error while recording event");
    }
}
