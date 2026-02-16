import { Middleware, RequestContext } from "../types";


export function createUrlBuilder(basePath: string): Middleware<RequestContext> {
  return async (ctx: RequestContext, next: () => Promise<void>): Promise<void> => {
    const { request } = ctx;

    request.url = new URL(request.endpoint, basePath);

    await next();
  };
}