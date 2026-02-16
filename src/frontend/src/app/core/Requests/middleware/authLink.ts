import { MissingTokenError } from "../Errors";
import { TokenManager } from "../tokenManager";
import { Middleware, RequestContext } from "../types";


export function CreateAuthProcessor(tokenManager: TokenManager): Middleware<RequestContext> {

    return function (ctx: RequestContext, next: () => Promise<void>): Promise<void> {
        const { request } = ctx;
        if (request.requiresAuth) {
            const token = tokenManager.getValidAccessToken();

            if (token) {
                ctx.token = token;
                
            }else{
                ctx.retryAble = false; //mark as not retryable since this is likely an auth issue rather than a transient error
                throw new MissingTokenError("No valid access token available");
            }
   
        }
        
        return next();

    }
}