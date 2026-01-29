import { EventBus } from "../../../../shared/createEventBus.js";

export type AuthStatus = "unknown" | "authenticated" | "unauthenticated" | "expired" | "error";

export interface AuthState {
    status: AuthStatus;
}


export function createAuth(eventBus: EventBus) {
    const state: AuthState = {
        status: "unknown"
    };

    function getStatus(): AuthStatus {
        return state.status;
    }

    function checkSession(): void{
         
        state.status = "authenticated";
        eventBus.publish("auth:state-changed");
    }

    async function login(username: string, password: string): Promise<void> {
        eventBus.publish("auth:login-started");

            try {
                const res = await fetch("/auth/login", {
                    method: "POST",
                    body: JSON.stringify({ username, password })
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

    async function logoff() {
        
    }

    return {
        getStatus,
        checkSession,
        login,
        logoff,
    };
}

export interface Auth {
    getStatus: () => AuthStatus;
    checkSession: () => void;
    login: (username: string, password: string) => Promise<void>;
    logoff: () => Promise<void> 
}
