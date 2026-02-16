import { EventBus } from "@dungeon-ledger/shared/src/createEventBus.js";
import { Events } from "../../utility/Events.js";
import { RequestContext, RequestOrchestrator } from "./Requests/types.js";
import { TokenManager } from "./Requests/tokenManager.js";



export function AuthSystem(
    eventBus: EventBus,
    requestOrchestrator: RequestOrchestrator,
    tokenManager: TokenManager
): IAuthSystem {

    let token: string = "";


    let state: AuthState = {
        status: AuthStatus.Unknown,
    };

    eventBus.subscribe(Events.AUTH_REFRESH_TOKEN_EXPIRED, () => {
        
        if (state.status === AuthStatus.Authenticated) {
            setState(AuthStatus.Expired);
        } else {
            setState(AuthStatus.Unauthenticated);
        }
    });

    eventBus.subscribe(Events.AUTH_LOGIN_SUCCEEDED, () => {
        //set state
        setState(AuthStatus.Authenticated);
    });

    eventBus.subscribe(Events.AUTH_LOGIN_FAILED, (err) => {

        //set state
        setState(AuthStatus.Unauthenticated);
    });

    eventBus.subscribe(Events.AUTH_LOGOFF_SUCCEEDED, () => {
        //clear token 
        tokenManager.clearBearerToken();

        //set state
        setState(AuthStatus.Unauthenticated);
    });

    eventBus.subscribe(Events.AUTH_ACCESS_TOKEN_EXPIRED, () => {
        //clear token 
        tokenManager.clearBearerToken();


    });

    async function getAccesToken() {
        //if this fails to get a access token the event Events.AUTH_REFRESH_TOKEN_EXPIRED will be fired.
        try {
            
            //attempt to get a valid access token
            const data = await requestOrchestrator.request({
                method: "GET",
                endpoint: "/auth/refresh",
                requiresAuth: false, //don't send access token since we are trying to get one, and if we have an expired one it will just cause confusion
                sendCookies: true, 
                requestingToken: true,
            });

            if (!data) {
                setState(AuthStatus.Unauthenticated);
            }

            if (data.accessToken) {
                tokenManager.setBearerToken(data.accessToken);
                setState(AuthStatus.Authenticated);
            }
        } catch (error) {

            //if here we know refresh failed, so we are unauthenticated
            setState(AuthStatus.Unauthenticated);
        }
    }

    async function startAuthResolution() {
        await getAccesToken();
    }

    function getStatus(): AuthStatus {
        return state.status;
    }

    function setState(next: AuthStatus) {
        state = { status: next }
        eventBus.publish(Events.AUTH_STATE_CHANGED);
    }

    async function login(email: string, password: string): Promise<void> {

        eventBus.publish(Events.AUTH_LOGIN_STARTED);

        try {
            const response = await requestOrchestrator.request({
                method: "POST",
                endpoint: "/auth/login",
                data: {
                    email,
                    password,
                },
                requestingToken: true,
                requiresAuth: false, 
                sendCookies: true, //needed to receive refresh token cookie
            });

            if (!response?.accessToken) {
                throw new Error("No Token");
            }

            //set token
            tokenManager.setBearerToken(response.accessToken);

            //let everyone know login succeeded 
            eventBus.publish(Events.AUTH_LOGIN_SUCCEEDED);
        } catch (err) {

            eventBus.publish(Events.AUTH_LOGIN_FAILED);
        }
    }

    async function logoff() {

        eventBus.publish(Events.AUTH_LOGOFF_STARTED);
        tokenManager.clearBearerToken();

        try {
            const response = await requestOrchestrator.request({
                method: "POST",
                endpoint: "/auth/logoff",
                requestingToken: true, //bypass the queue if there is one since we want to logoff even if the token is expired, and if there is a queue it might be stuck waiting for a token that will never come since we are logging off.
                requiresAuth: false, 
                sendCookies: true, //needed to send the refresh token cookie
            });

            eventBus.publish(Events.AUTH_LOGOFF_SUCCEEDED);

        } catch (err) {
            console.error("Logoff failed", err);
            eventBus.publish(Events.AUTH_LOGOFF_FAILED);
        }

    }

    return {
        startAuthResolution,
        getStatus,
        login,
        logoff,
    };
}

export interface IAuthSystem {
    startAuthResolution: () => void;
    getStatus: () => AuthStatus;
    login: (username: string, password: string) => Promise<void>;
    logoff: () => Promise<void>;
}

export const AuthStatus = {
    Unknown: "unknown",
    Authenticated: "authenticated",
    Unauthenticated: "unauthenticated",
    Expired: "expired",
    Error: "error",
} as const;

export type AuthStatus = typeof AuthStatus[keyof typeof AuthStatus];

export type AuthState =
    | { status: typeof AuthStatus.Unknown }
    | { status: typeof AuthStatus.Authenticated }
    | { status: typeof AuthStatus.Unauthenticated }
    | { status: typeof AuthStatus.Expired }
    | { status: typeof AuthStatus.Error };
