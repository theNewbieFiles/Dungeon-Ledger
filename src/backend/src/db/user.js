import pool from "./db.js";

/**
 * Retrieves a user record by email.
 *
 * Executes a parameterized SQL query to safely fetch a user row from the
 * `users` table. Returns the raw `pg` query result, including `rows`,
 * `rowCount`, and other metadata.
 *
 * @async
 * @function getUserByEmail
 *
 * @param {string} email - The email address to search for.
 *
 * @returns {Promise<import('pg').QueryResult>} The PostgreSQL query result.
 * @throws {Error} If the database query fails.
 */
export const getUserByEmail = async (email) => {
    return await pool.query("SELECT * FROM users WHERE email = $1", [email]);
};     