import { EventBus } from "../../../../shared/createEventBus.js";

export type AuthStatus =
    | "unknown"
    | "authenticated"
    | "unauthenticated"
    | "expired"
    | "error";

export interface IAuthState {
    status: AuthStatus;
}

export function createAuthSystem(eventBus: EventBus): IAuthSystem {
    const state: IAuthState = {
        status: "unknown",
    };

    eventBus.subscribe()

    function setUnAuth() {
        if(state.status === 'authenticated'){
            state.status = "expired"
        }

        state.status = "unauthenticated"; 

        eventBus.publish()
        
    }

    function getStatus(): AuthStatus {
        return state.status;
    }

    function checkSession(): void {
        setTimeout(() => {
            console.log("here"); 
            state.status = "unauthenticated";
            eventBus.publish("auth:state-changed");
        }, 1000);
    }

    async function login(username: string, password: string): Promise<void> {
        eventBus.publish("auth:login-started");

        try {
            const res = await fetch("/auth/login", {
                method: "POST",
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) throw new Error("Login failed");

            state.status = "authenticated";
            eventBus.publish("auth:state-changed", state.status);
            eventBus.publish("auth:login-succeeded");
        } catch (err) {
            state.status = "unauthenticated";
            eventBus.publish("auth:state-changed", state.status);
            eventBus.publish("auth:login-failed", err);
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
