function defineEvents<T extends Record<string, string>>(events: T) {
    return events;
}
export const Events = defineEvents({
    //login
    AUTH_LOGIN_STARTED: "auth:login-started",
    AUTH_LOGIN_SUCCEEDED: "auth:login-succeeded",
    AUTH_LOGIN_FAILED: "auth:login-failed",

    //state changes
    AUTH_STATE_CHANGED: "auth:state-changed",

    //tokens
    AUTH_ACCESS_TOKEN_EXPIRED: "auth:access-token-expired",
    AUTH_ACCESS_TOKEN_RENEWED: "auth:access-token-renewed",
    AUTH_REFRESH_TOKEN_EXPIRED: "auth:refresh-token-expired",
    AUTH_REFRESH_TOKEN_RENEWED: "auth:refresh-token-renewed",

    //logoff
    AUTH_LOGOFF_STARTED: "auth:logoff-started",
    AUTH_LOGOFF_SUCCEEDED: "auth:logoff-succeeded",
    AUTH_LOGOFF_FAILED: "auth:logoff-failed",

    AUTH_BACKEND_UNAVAILABLE: "auth:backend-unavailable",

    //user
    USER_LOGGED_OFF: "user:logged-off",
    USER_UPDATED: "user:updated",
});
