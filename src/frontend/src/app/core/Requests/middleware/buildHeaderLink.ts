import { he } from "zod/locales";
import { ApiRequest, RequestContext } from "../types";


export async function buildHeadersLink(ctx: RequestContext, next: () => Promise<void>): Promise<void> {

    const { request } = ctx;
    const myHeaders = new Headers();

    myHeaders.append("Accept", "application/json");
    

    if (request.data !== undefined && request.method !== "GET") { 
        myHeaders.append("Content-Type",  "application/json"); 
    }

    if(request.requiresAuth) {
        if (ctx.token) {
            myHeaders.append("Authorization", `Bearer ${ctx.token}`);
        } else {
            throw new Error("Request requires auth but no token provided");
        }
    }

    request.headers = Object.fromEntries(myHeaders.entries());

    await next();
}