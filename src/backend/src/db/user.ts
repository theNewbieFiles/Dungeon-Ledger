
import { fail, ok, type Result } from "../utilities/message.js";
import pool from "./db.js";

export interface getUserByEmailResult {id: string, passwordHash: string}

export async function getUserByEmail(email: string): Promise<Result<getUserByEmailResult | never>> {
    const query = `
        SELECT id, password_hash
        FROM users
        WHERE email = $1;
    `;

    try {
        const result = await pool.query(query, [email]);

        if(result.rowCount !== 1){
            return fail(); 
        }

        const user = {
            id: result.rows[0].id,
            passwordHash: result.rows[0].password_hash,
        }
        return ok(user); 

    } catch (err) {
        throw new Error("Database error while retrieving user", {
            cause: JSON.stringify(err),
        });
    }
}
     