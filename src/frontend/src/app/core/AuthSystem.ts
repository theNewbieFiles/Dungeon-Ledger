import { EventBus } from "@dungeon-ledger/shared/src/createEventBus.js";
import { Events } from "../utilities/events.js";
import { IAPIRequest } from "./APIRequest.js";

export const unknown = "unknown";
export const authenticated = "authenticated";
export const unauthenticated = "unauthenticated";
export const expired = "expired";
export const error = "error";

export type AuthStatus =
    | "unknown"
    | "authenticated"
    | "unauthenticated"
    | "expired"
    | "error";

export interface IAuthState {
    status: AuthStatus;
}

export function AuthSystem(
    eventBus: EventBus,
    APIGateway: IAPIRequest,
): IAuthSystem {

    const state: IAuthState = {
        status: "unknown",
    };

    eventBus.subscribe(Events.AUTH_REFRESH_TOKEN_EXPIRED, () => {
        switch (state.status) {
            case "authenticated":
                state.status = "expired";
                break;
            case "unknown":
                state.status = "unauthenticated";
                break;

            default:
                state.status = "unauthenticated";
                break;
        }
        eventBus.publish(Events.AUTH_STATE_CHANGED);
    });

    eventBus.subscribe(Events.AUTH_LOGIN_SUCCEEDED, () => {
        //set state
        state.status = "authenticated";
        eventBus.publish(Events.AUTH_STATE_CHANGED, state.status);
    });

    eventBus.subscribe(Events.AUTH_LOGIN_FAILED, (err) => {

        //set state
        state.status = "unauthenticated";
        eventBus.publish(Events.AUTH_STATE_CHANGED, state.status);
    });

    eventBus.subscribe(Events.AUTH_LOGOFF_SUCCEEDED, () => {
        //clear token 
        APIGateway.clearAccessToken();

        //set state
        state.status = "unauthenticated";
        eventBus.publish(Events.AUTH_STATE_CHANGED, state.status);
    });


    function getStatus(): AuthStatus {
        return state.status;
    }

    function initialize() {
        //verify refresh token

        APIGateway.request({
            method: "GET",
            endpoint: "/auth/refresh",
            requiresAuth: false,
        }).then(() => {

            eventBus.publish(Events.AUTH_LOGIN_SUCCEEDED);
        }).catch(() => {
            //this is avoided error logging since failed refresh is normal on app startup
        });
    }

    async function checkSession(): Promise<void> {

    }

    async function login(email: string, password: string): Promise<void> {
        eventBus.publish(Events.AUTH_LOGIN_STARTED);

        try {
            const response = await APIGateway.request({
                method: "POST",
                endpoint: "/auth/login",
                data: {
                    email,
                    password,
                },
            });

            if (!response?.accessToken) {
                throw new Error("No Token");
            }
            console.log("login successful");

            //set token
            APIGateway.setAccessToken(response.accessToken);

            //let everyone know
            eventBus.publish(Events.AUTH_ACCESS_TOKEN_RENEWED);

            //let everyone know login succeeded 
            eventBus.publish(Events.AUTH_LOGIN_SUCCEEDED);
        } catch (err) {
            state.status = "unauthenticated";
            eventBus.publish(Events.AUTH_LOGIN_FAILED, err);
        }
    }

    async function logoff() {
        try {
            eventBus.publish(Events.AUTH_LOGOFF_STARTED);

            const response = await APIGateway.request({
                method: "POST",
                endpoint: "/auth/logoff",
            }).then(() => {
                
                eventBus.publish(Events.AUTH_LOGOFF_SUCCEEDED);
            }).catch(() => {

            });


        } catch (error) {

        }

    }

    return {
        initialize,
        getStatus,
        checkSession,
        login,
        logoff,
    };
}

export interface IAuthSystem {
    initialize: () => void;
    getStatus: () => AuthStatus;
    checkSession: () => void;
    login: (username: string, password: string) => Promise<void>;
    logoff: () => Promise<void>;
}
