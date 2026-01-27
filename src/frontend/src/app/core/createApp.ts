import { EventBus } from "../../../../shared/createEventBus.js";
import { eventBus } from "./eventBus.js";
import { Auth, createAuth } from "./createAuth.js";


export function createApp() {

    const auth = createAuth();

    function init() {
        
    }

    return {
        eventBus,
        auth,
        init,
    }
}

export interface App {
    eventBus: EventBus; 
    auth: Auth;
    init: () => void;
}