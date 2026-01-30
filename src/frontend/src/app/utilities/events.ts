function defineEvents<T extends Record<string, string>>(events: T) {
  return events;
}
export const Events = defineEvents({
  AUTH_STATE_CHANGED: "auth:state-changed",
  AUTH_ACCESS_TOKEN_EXPIRED: "auth:access-token-expired",
  AUTH_ACCESS_TOKEN_RENEWED: "auth:access-token-renewed",
  AUTH_REFRESH_TOKEN_EXPIRED: "auth:refresh-token-expired",
  AUTH_REFRESH_TOKEN_RENEWED: "auth:refresh-token-renewed",

  AUTH_BACKEND_UNAVAILABLE   : "auth:backend-unavailable", 

  //user
  USER_LOGGED_OFF: "user:logged-off", 
  USER_UPDATED: "user:updated",
});
