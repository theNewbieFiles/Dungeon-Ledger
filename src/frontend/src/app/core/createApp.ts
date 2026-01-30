import { createEventBus, EventBus } from "../../../../shared/createEventBus.js";
import { IAuthSystem, createAuthSystem } from "./createAuthSystem.js";


export function createApp() {

    //create event bus
    const eventBus: EventBus = createEventBus(); 


    const authSys = createAuthSystem(eventBus);

    function init() {
        
        authSys.checkSession(); 
        
    }

    return {
        eventBus,
        authSys,
        init,
    }
}

export interface App {
    eventBus: EventBus; 
    authSys: IAuthSystem;
    init: () => void;
}