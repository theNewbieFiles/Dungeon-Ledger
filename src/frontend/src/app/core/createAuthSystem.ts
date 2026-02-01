import { EventBus } from "../../../../shared/src/createEventBus.js";
import { Events } from "../utilities/events.js";
import { IAPIRequest } from "./APIRequest.js";

export type AuthStatus =
    | "unknown"
    | "authenticated"
    | "unauthenticated"
    | "expired"
    | "error";

export interface IAuthState {
    status: AuthStatus;
}

export function createAuthSystem(
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
    });

    function getStatus(): AuthStatus {
        return state.status;
    }

    async function checkSession(): Promise<void> {
         
    }

    function getAccessCookie(){
        
    }

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

    async function logoff() { }

    return {
        getStatus,
        checkSession,
        login,
        logoff,
    };
}

export interface IAuthSystem {
    getStatus: () => AuthStatus;
    checkSession: () => void;
    login: (username: string, password: string) => Promise<void>;
    logoff: () => Promise<void>;
}
