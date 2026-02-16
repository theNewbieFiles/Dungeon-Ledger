
import { MissingURLError, TimeoutError } from "../Errors";
import { ApiRequest, FetchProcessor, Middleware, RequestContext } from "../types";




export async function fetchLink(ctx: RequestContext, next: () => Promise<void>): Promise<void> {

    const { request } = ctx;


    //abort
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ctx.timeout);


    if (!request.url) {
        ctx.retryAble = false; //mark as not retryable since this is likely a coding error rather than a transient issue
        throw new MissingURLError("fetchLink: request.url missing (urlBuilder middleware not run)");
    }

    try {
        const response = await fetch(request.url, {
            method: request.method,
            headers: request.headers,
            body:
                request.data && request.method !== "GET"
                    ? JSON.stringify(request.data)
                    : undefined,
            credentials: request.sendCookies ? "include" : "omit", //conditionally include cookies based on sendCookies flag
            signal: controller.signal,
        });

        if(response.status && isRetryableStatus(response.status)) {
            ctx.retryAble = true; //mark as retryable since this is likely a transient server issue
        }

        ctx.response = response;

        await next();
    } catch (error) {
        if (controller.signal.aborted || (error instanceof Error && error.name === "AbortError")) {
            ctx.retryAble = true; //mark as retryable since timeouts are often transient
            ctx.timeoutCount += 1; 

            throw new TimeoutError("Request timed out");
        }

        if(isRetryableNetworkError(error)) {
            ctx.retryAble = true; //mark as retryable since this is likely a transient network issue
            return; 
        }

        ctx.retryAble = false; 
        throw error;
    } finally {
        clearTimeout(timeoutId); //ensure timeout is cleared
    }
}


function isRetryableStatus(status: number): boolean {
    return (
        status === 0 || 
        status === 408 ||
        status === 425 ||
        status === 429 ||
        status === 499 ||
        (status >= 500 && status <= 504)
    );
}

function isRetryableNetworkError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;

  if (err instanceof TimeoutError) return true;

  // Fetch abort / network failure
  if (err.name === "AbortError") return true;
  if (err.name === "TypeError") return true;

  // Node.js fetch / undici errors
  if ("code" in err && typeof (err as any).code === "string") {
    const code = (err as any).code;

    return [
      "ECONNRESET",
      "ECONNREFUSED",
      "EHOSTUNREACH",
      "ENOTFOUND",
      "ETIMEDOUT",
    ].includes(code);
  }

  return false;
}