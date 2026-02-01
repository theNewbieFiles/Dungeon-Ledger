
import jwt from "jsonwebtoken";
import type { StringValue } from 'ms';
import AppConfig from "../../config/appConfig.js";
import env from "../../config/env.js";


export function generateAccessToken(userID: string) {
  
    return jwt.sign(
        {
            id: userID,
        }, 
        env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: AppConfig.ACCESS_TOKEN_TTL as StringValue, //cause jwt expects StringValue type here for some stupid reason
        },
    );
}
