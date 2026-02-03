
import { createEventBus, EventBus } from "@dungeon-ledger/shared/src/createEventBus.js";
import { createSystemSettings } from "../utilities/systemSettings.js";
import { createAPIRequest } from "./APIRequest.js";
import { IAuthSystem, AuthSystem } from "./AuthSystem.js";


export async function DungeonLedger(): Promise<IDungeonLedger> {
    try {
        //load settings
        try {
            const config = await fetch("/config.json").then((r) => r.json());

            const settings = createSystemSettings(config);

            //create event bus
            const eventBus: EventBus = createEventBus();

            //create API gateway
            const APIGateway = createAPIRequest(settings, eventBus);

            //Authorization system
            //controls login/logout and token management
            const authSystem = AuthSystem(eventBus, APIGateway);

            function init() {
                //authSystem.login("gravy@chrispcr.com", "secret123");

                authSystem.initialize();
            }

            return {
                eventBus,
                authSystem,
                init,
            };


        } catch (error) {
            console.error("Failed to load configuration:", error);

            throw error;
        }








    } catch (error) {
        throw error;
    }


}

export interface IDungeonLedger {
    eventBus: EventBus;
    authSystem: IAuthSystem;
    init: () => void;
}
