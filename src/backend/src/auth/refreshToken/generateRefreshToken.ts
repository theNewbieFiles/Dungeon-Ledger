import crypto from "crypto";
import AppConfig from "../../config/appConfig.js";


export function generateRefreshToken(): string {
    return crypto.randomBytes(AppConfig.Refresh_Token_Length).toString("hex");
}

