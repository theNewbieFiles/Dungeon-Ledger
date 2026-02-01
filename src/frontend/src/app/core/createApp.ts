import { createEventBus, EventBus } from "../../../../shared/src/createEventBus.js";
import { createSystemSettings } from "../utilities/systemSettings.js";
import { createAPIRequest } from "./APIRequest.js";
import { IAuthSystem, createAuthSystem } from "./createAuthSystem.js";

export async function createApp(): Promise<App> {
    try {
        //load settings
        const config = await fetch("/config.json").then((r) => r.json());
        

        const settings = createSystemSettings(config);

        //create event bus
        const eventBus: EventBus = createEventBus();

        //create API gateway
        const APIGateway = createAPIRequest(settings, eventBus);

        const authSys = createAuthSystem(eventBus, APIGateway);

        function init() {
            authSys.login("gravy@chrispcr.com", "secret123");
        }

        return {
            eventBus,
            authSys,
            init,
        };


    } catch (error) {
        console.error(error);
        throw error; 
    }


}

export interface App {
    eventBus: EventBus;
    authSys: IAuthSystem;
    init: () => void;
}
