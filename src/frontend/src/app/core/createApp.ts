import { createEventBus, EventBus } from "../../../../shared/createEventBus.js";
import { Auth, createAuth } from "./createAuth.js";


export function createApp() {

    //create event bus
    const eventBus: EventBus = createEventBus(); 

    const auth = createAuth(eventBus);

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