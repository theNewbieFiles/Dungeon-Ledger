import { EventBus } from "../../../../shared/src/createEventBus";
import { Events } from "../utilities/events";
import { ISystemSettings } from "../utilities/systemSettings";
import { sharedErrors } from "../../../../shared/src/sharedErrors"
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiRequest {
    method: HttpMethod;
    endpoint: string;
    data?: unknown;
    headers?: Record<string, string>;
    requiresAuth?: true | false;
}

interface PendingRequest {
    request: ApiRequest;
    resolve: (value: any) => void;
    reject: (reason: any) => void;
    retryCount: number;
    hasRetriedAfterRefresh?: boolean;
}

//for testing 
type FetchFunction = typeof fetch;


export function createAPIRequest(
    settings: ISystemSettings,
    eventBus: EventBus,
    fetchFn: FetchFunction = fetch
): IAPIRequest {
    const protocol = settings.get("secured") ? "https" : "http";

    const requestQueue: PendingRequest[] = [];
    let refreshInProgress = false;
    let accessToken: string = "";
    let backendDown: boolean = false;

    //new refresh token
    eventBus.subscribe(Events.AUTH_REFRESH_TOKEN_RENEWED, () => {
        refreshInProgress = false;
        processQueuedRequests();
    });

    //new token aquired
    eventBus.subscribe(Events.AUTH_ACCESS_TOKEN_RENEWED, async () => {
        refreshInProgress = false;
        processQueuedRequests();
    });

    //handle token expired
    eventBus.subscribe(Events.AUTH_ACCESS_TOKEN_EXPIRED, async () => {
        //attempt to get a new token
        if (refreshInProgress) return;

        refreshInProgress = true;

        requestRefreshToken();
    });

    eventBus.subscribe(Events.USER_LOGGED_OFF, () => {
        refreshInProgress = false;

        const queueCopy = requestQueue.splice(0, requestQueue.length);

        queueCopy.forEach((pending) => pending.reject(Events.USER_LOGGED_OFF));

        backendDown = false;
        accessToken = "";
    });

    eventBus.subscribe(Events.AUTH_BACKEND_UNAVAILABLE, () => {
        backendDown = true;
        refreshInProgress = false;

        const queueCopy = requestQueue.splice(0, requestQueue.length);

        queueCopy.forEach((pending) => pending.reject(new Error("Backend down")));
    })

    async function requestRefreshToken(tries = 1) {
        if (tries > settings.get("maxRetryCount")) {
            eventBus.publish(Events.AUTH_BACKEND_UNAVAILABLE);
            return;
        }

        try {
            const response = await fetchFn(
                `${protocol}://${settings.get("apiBaseUrl")}/auth/refresh`,
                {
                    method: "POST",
                    credentials: "include", // Sends http-only refresh token cookie
                },
            );

            if (response.status === 401) {
                // refresh token is expired or user is logged out
                eventBus.publish(Events.AUTH_REFRESH_TOKEN_EXPIRED);
                return;
            }

            if (!response.ok) {
                //try again in a few seconds
                const nextTry = tries + 1;
                setTimeout(() => requestRefreshToken(nextTry), 1000 * nextTry);
                return;
            }

            //request successful
            const data = await response.json();
            setAccessToken(data.token);

            eventBus.publish(Events.AUTH_ACCESS_TOKEN_RENEWED);
        } catch (error) {
            setTimeout(() => requestRefreshToken(tries + 1), 1000 * tries);
        }

    }

    function setAccessToken(token: string) {
        if (!token) {
            throw new Error("Invariant violation: empty access token");
        }
        accessToken = token;

    }

    function clearAccessToken() {
        accessToken = "";
    }

    function request<T = any>(config: ApiRequest): Promise<T> {

        if (backendDown) {
            return Promise.reject(new Error("Backend down"));
        }

        return new Promise((resolve, reject) => {
            const pendingRequest: PendingRequest = {
                request: {
                    ...config,
                },
                resolve,
                reject,
                retryCount: 0,
            };

            if (refreshInProgress) {
                queueRequest(pendingRequest);
            } else {
                executeRequest(pendingRequest);
            }
        });
    }

    function queueRequest(pending: PendingRequest) {
        requestQueue.push(pending);
    }

    async function executeRequest(pending: PendingRequest) {
        try {
            const { request } = pending;

            const headers = buildHeaders(request);

            const response = await fetchFn(
                `${protocol}://${settings.get("apiBaseUrl")}${request.endpoint}`,
                {
                    method: request.method,
                    headers,
                    body:
                        request.data && request.method !== "GET"
                            ? JSON.stringify(request.data)
                            : undefined,
                    credentials: "include", //for http-only cookie
                },
            );

            let data = null;
            try {
                data = await response.json();
            } catch {
                data = null;
            }
   
            if (response.status === 401) {
                switch (data?.error) {
                    
                    case sharedErrors.ACCESS_TOKEN_INVALID:
                        if (pending.hasRetriedAfterRefresh) {
                            pending.reject("Authentication failed after refresh");
                            return
                        }
                        pending.hasRetriedAfterRefresh = true; 1
                        queueRequest(pending);

                        eventBus.publish(Events.AUTH_ACCESS_TOKEN_EXPIRED);
                        return;

                    case sharedErrors.REFRESH_TOKEN_INVALID:
                        eventBus.publish(Events.AUTH_REFRESH_TOKEN_EXPIRED);
                        pending.reject("Refresh token invalid");
                        return;
                }

            }

            if (!response.ok) {
                if (
                    pending.retryCount < settings.get("maxRetryCount") &&
                    isRetryableStatus(response.status)
                ) {
                    pending.retryCount++;
                    setTimeout(
                        () => executeRequest(pending),
                        1000 * pending.retryCount,
                    );
                    return;
                } else {
                    pending.reject(`HTTP ${response.status}: ${response.statusText}`);
                    return;
                }
            }



            pending.resolve(data);
        } catch (error) {
            // Network error: fetch threw before returning a response
            if (pending.retryCount < settings.get("maxRetryCount")) {
                pending.retryCount++;
                setTimeout(() => executeRequest(pending), 1000 * pending.retryCount);
                return;
            }

            pending.reject(error);
        }
    }

    function isRetryableStatus(status: number) {
        return (
            status === 408 || //timeout
            status === 429 ||   //rate limit
            status === 425 ||   //too early
            status === 499 ||   //client closed request
            status === 0 ||     //CORS failure
            (status >= 500 && status < 600)
        );
    }

    function buildHeaders(request: ApiRequest): HeadersInit {
        const headers: HeadersInit = {
            ...request.headers,
        };

        //only add application/json if it has a body. 
        if (request.data !== undefined) { headers["Content-Type"] = "application/json"; }

        if (request.requiresAuth !== false && accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }

        return headers;
    }

    async function processQueuedRequests() {
        const queueCopy = requestQueue.splice(0, requestQueue.length);

        //let execute own resolve/reject
        queueCopy.forEach(p => executeRequest(p));
    }

    return {
        setAccessToken,
        clearAccessToken,
        request,
    };
}

export interface IAPIRequest {
    setAccessToken(token: string): void;
    clearAccessToken(): void;
    request<T = any>(config: ApiRequest): Promise<T>;
}
