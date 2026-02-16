import { Settings } from "../../utilities/systemSettings";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRequest {
    url?: URL | undefined;
    method: HttpMethod;
    endpoint: string;
    data?: any; //data sent
    headers?: Record<string, string>;
    requiresAuth?: true | false; //send token in header if true, default is false
    sendCookies?: boolean; //only for header, indicates whether to include cookies in the request.

    requestingToken?: boolean;
}

export type RequestContext<T = unknown> = {
    request: ApiRequest;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: unknown) => void;

    response?: Response;
    data?: any; //data received

    error?: unknown;
    retryAble?: boolean;

    //number of times the request has timed out, used for retry logic
    timeoutCount: number;

    //time in millieseconds before request is considered timed out.
    timeout: number;

    token?: string;

    hasRetriedAfterRefresh?: boolean;

    requestingToken?: boolean;
};


export interface RequestQueue<T = any> {
    addRequest(request: RequestContext<T>): void;
    clearQueue(): void;
    getNextRequest(): RequestContext<T> | undefined;
    hasPendingRequests(): boolean;
}

export interface RequestOrchestrator {
    request(request: ApiRequest): Promise<any>;
}


export type FetchProcessor = (pending: ApiRequest) => Promise<Response>;

export type Middleware<C> = (
    ctx: C,
    next: () => Promise<void>
) => Promise<void>;


//request orchestrator 
export type RequestOrchestratorConfig = {
    settings: Settings;
    requestQueue: RequestQueue;
    authProcessor: Middleware<RequestContext>;
    secured?: boolean; //whether to use https or http, default is false (http)
}