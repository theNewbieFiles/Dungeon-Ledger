import jwt from "jsonwebtoken";
import env from "../../config/env.js";

export function verifyAccessToken(token) {
    try {
        const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
        return { valid: true, decoded };
    } catch (err) {
        return { valid: false, error: err };
    }
}
