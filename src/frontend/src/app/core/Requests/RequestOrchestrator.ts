import { EventBus, sharedErrors } from "@dungeon-ledger/shared";
import { SystemSettings } from "../../utilities/systemSettings";
import { createMiddlewareEngine, MiddlewareEngine } from "./APIGateway/Middleware";
import { RequestQueue, RequestOrchestrator, Middleware, RequestContext, ApiRequest } from "./types";
import { Events } from "../../../utility/Events";
import { BackendDownError, TimeoutError } from "./Errors";

type RequestOrchestratorState = "ready" | "token_expired" | "backendDown" | "loading";



export function createRequestOrchestrator(params: RequestOrchestratorParams): RequestOrchestrator {

    const {
        settings,
        eventBus,
        requestQueue,
        jsonLink,
        urlBuilder,
        authLink,
        buildHeadersLink,
        fetchLink,
        middleware = createMiddlewareEngine<RequestContext<any>>(),
    } = params


    let state: RequestOrchestratorState = "loading";

    const maxRetries = settings.get("maxRetryCount");

    //setup middleware
    middleware.use(jsonLink);
    middleware.use(urlBuilder);
    middleware.use(authLink);
    middleware.use(buildHeadersLink);
    middleware.use(fetchLink);

    function setState(nextState: RequestOrchestratorState) {
        state = nextState;
    }

    //everything is ready
    setState("ready");

    //new refresh token
    eventBus.subscribe(Events.AUTH_REFRESH_TOKEN_RENEWED, () => {
        setState("ready");
        processQueuedRequests();
    });

    async function request<T = any>(request: ApiRequest): Promise<T> {

        if (state === "backendDown") {
            return Promise.reject(new Error("Backend is currently unavailable"));
        }

        return new Promise((resolve, reject) => {

            const ctx: RequestContext<T> = {
                request,
                resolve,
                reject,
                timeoutCount: 0,
                timeout: settings.get("requestTimeoutMs")
            };

            if (state === "ready") {
                executeRequest(ctx);
            } else if (state === "token_expired") {
                if (request.requestingToken) {
                    executeRequest(ctx);
                } else {
                    requestQueue.addRequest(ctx);
                }

            } else {
                reject(new Error("Request orchestrator is not ready"));
            }

        });

    }

    async function executeRequest<T = any>(requestContext: RequestContext<T>): Promise<void> {

        try {

            await retryRequest(requestContext);

            const { response, data } = requestContext;

            if (!response) {
                requestContext.reject(new Error("No response received"));
                return;
            }

            if (response.status === 401) {
                switch (requestContext.data?.error) {

                    case sharedErrors.ACCESS_TOKEN_INVALID:
                        if (requestContext.hasRetriedAfterRefresh) {
                            requestContext.reject("Authentication failed after refresh");
                            return
                        }
                        requestContext.hasRetriedAfterRefresh = true;

                        requestQueue.addRequest(requestContext);

                        setState("token_expired");

                        eventBus.publish(Events.AUTH_ACCESS_TOKEN_EXPIRED);

                        return;

                    case sharedErrors.REFRESH_TOKEN_INVALID:
                        eventBus.publish(Events.AUTH_REFRESH_TOKEN_EXPIRED);
                        setState("token_expired");
                        requestContext.reject("Refresh token invalid");
                        return;
                }
            }

            if (!response.ok) {

                requestContext.reject(`Request failed`);
                return;
            }
            //everything is good, resolve with data
            requestContext.resolve(requestContext.data);
        } catch (error) {
            console.log(error); 
            requestContext.reject(`Request failed`);
        }

    }

    async function retryRequest<T = any>(requestContext: RequestContext<T>): Promise<void> {


        for (let attempt = 0; attempt < maxRetries; attempt++) {

            //set retriable 
            requestContext.retryAble = false; //default to not retriable, middleware can set to true if error is likely transient

            await middleware.run(requestContext); 
            
            if (!requestContext.retryAble) return; 
            
            await backoff(attempt);
        }

        throw new BackendDownError("Max retry attempts reached. Backend may be down.");

    }

    async function processQueuedRequests() {
        while (requestQueue.hasPendingRequests()) {
            const nextRequest = requestQueue.getNextRequest();
            if (nextRequest) {
                await executeRequest(nextRequest);
            } else {
                break;
            }

        }
    }

    return {
        request,
    }
}






function backoff(attempt: number): Promise<void> {
    const base = 200; // 200ms base
    const max = 5000; // cap at 5s

    // Exponential growth
    let delay = Math.min(max, base * 2 ** attempt);

    // Add jitter (random 0–50%)
    delay = delay * (0.5 + Math.random() * 0.5);

    return new Promise(resolve => setTimeout(resolve, delay));
}





export type RequestOrchestratorParams = {
    settings: SystemSettings,
    eventBus: EventBus,
    requestQueue: RequestQueue,
    jsonLink: Middleware<RequestContext>,
    urlBuilder: Middleware<RequestContext>,
    authLink: Middleware<RequestContext>,
    buildHeadersLink: Middleware<RequestContext>,
    fetchLink: Middleware<RequestContext>,
    middleware?: MiddlewareEngine<RequestContext<any>>,

}