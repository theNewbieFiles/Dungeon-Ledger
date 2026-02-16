import { EventBus } from "@dungeon-ledger/shared";

import { Events } from "../../../utility/Events";
import { jwtDecode } from "jwt-decode";

export function createTokenManager(eventBus: EventBus) {

    let bearerToken: string | null = null;
    let refreshTimeout: ReturnType<typeof setTimeout> | null = null;


    function scheduleRefresh(exp: number) {
        if (refreshTimeout) clearTimeout(refreshTimeout);

        const timeLeft = exp * 1000 - Date.now() - 60000; // 1 min early
        const delay = Math.max(timeLeft, 0);

        refreshTimeout = setTimeout(() => {
            eventBus.publish(Events.AUTH_ACCESS_TOKEN_EXPIRED);
        }, delay);
    }

    function setBearerToken(token: string) {
        bearerToken = token;
        
        const decoded = jwtDecode<{ exp?: number }>(token); 
        const exp = decoded.exp ?? null;

        if (!exp) {
            // no exp = treat as expired
            clearBearerToken();
            if (refreshTimeout) clearTimeout(refreshTimeout);
            eventBus.publish(Events.AUTH_ACCESS_TOKEN_EXPIRED);
            return;
        }

        scheduleRefresh(exp);
        eventBus.publish(Events.AUTH_ACCESS_TOKEN_RENEWED);
    }

    function clearBearerToken() {
        bearerToken = null;
        if (refreshTimeout) {
            clearTimeout(refreshTimeout);
            refreshTimeout = null;
        }
    }

    function getValidAccessToken() {
        if (isExpired()) return null;
        return bearerToken;
    }

    function isExpired() {
        if (!bearerToken) return true;

        const decoded = jwtDecode<{ exp?: number }>(bearerToken); 
        const exp = decoded.exp ?? null;

        if (!exp) return true;

        return Date.now() >= exp * 1000;
    }


    return {
        setBearerToken,
        clearBearerToken,
        getValidAccessToken,
        isExpired,
    };
}

export type TokenManager = ReturnType<typeof createTokenManager>;
