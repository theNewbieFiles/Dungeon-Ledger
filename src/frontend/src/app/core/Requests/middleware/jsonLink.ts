import { jsonParseError } from "../Errors";
import { RequestContext } from "../types";



export async function jsonLink(ctx: RequestContext, next: () => Promise<void>): Promise<void> {


    await next();

    if (!ctx.response) {
        ctx.retryAble = false;
        throw new Error("No response to parse in jsonLink");
    }

    // Handle no-content responses
    if (ctx.response.status === 204 || ctx.response.status === 205 || ctx.response.status === 304) {
        ctx.data = undefined;
        return;
    }

    try {
        ctx.data = await ctx.response.json();
    } catch (error) {
        ctx.retryAble = false;
        throw new jsonParseError("Failed to parse JSON response");
    }
}

