import pool from "./db.js";


export const getUserByEmail = async (email) => {
    return await pool.query("SELECT * FROM users WHERE email = $1", [email]);
};     