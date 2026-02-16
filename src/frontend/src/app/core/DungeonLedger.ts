
import { createEventBus, EventBus } from "@dungeon-ledger/shared/src/createEventBus.js";
import { createSystemSettings, SystemSettings } from "../utilities/systemSettings.js";
import { IAuthSystem, AuthSystem } from "./AuthSystem.js";
import { Events } from "../../utility/Events.js";
import { RequestOrchestrator } from "./Requests/types.js";
import { RequestQueue } from "./Requests/RequestQueue/RequestQueue.js";
import { jsonLink } from "./Requests/middleware/jsonLink.js";
import { createUrlBuilder } from "./Requests/middleware/urlBuilderLink.js";
import { createTokenManager } from "./Requests/tokenManager.js";
import { CreateAuthProcessor } from "./Requests/middleware/authLink.js";
import { buildHeadersLink } from "./Requests/middleware/buildHeaderLink.js";
import { fetchLink } from "./Requests/middleware/fetchLink.js";
import { createRequestOrchestrator, RequestOrchestratorParams } from "./Requests/RequestOrchestrator.js";



export function createDungeonLedger(): IDungeonLedger {


    const eventBus: EventBus = createEventBus();

    let requestOrch: RequestOrchestrator | null = null;
    let authSystem: IAuthSystem | null = null;
    let systemSettings: SystemSettings | null = null;



    function getRequestOrch(): RequestOrchestrator {
        if (!requestOrch) {
            throw new Error("Request Orchestrator not initialized yet");
        }
        return requestOrch;
    }

    function getAuthSystem(): IAuthSystem {
        if (!authSystem) {
            throw new Error("Auth System not initialized yet");
        }
        return authSystem;
    }

    function getSystemSettings(): SystemSettings {
        if (!systemSettings) {
            throw new Error("System Settings not initialized yet");
        }
        return systemSettings;
    }

    async function init() {
        //authSystem.login("gravy@chrispcr.com", "secret123");

        try {
            const configFile = await fetch("/config.json");
            if (!configFile.ok) throw new Error("Failed to load config file");

            const config = await configFile.json();

            systemSettings = createSystemSettings(config);//config loaded, initialize systems
            

            //determine protocol and set base url
            const protocol = systemSettings.get("secured") ? "https" : "http";
            const baseUrl = systemSettings.get("apiBaseUrl").replace("{protocol}", protocol);

            

            

            //token manager for authLink and authSystem to use
            const tokenManager = createTokenManager(eventBus); 

            //prepare middleware for request orchestrator
            const requestOrchParams: RequestOrchestratorParams = {
                settings: systemSettings,
                eventBus,
                requestQueue: RequestQueue(), 
                jsonLink, 
                urlBuilder: createUrlBuilder(baseUrl), 
                authLink: CreateAuthProcessor(tokenManager),
                buildHeadersLink, 
                fetchLink,
            }


            requestOrch = createRequestOrchestrator(requestOrchParams);


            authSystem = AuthSystem(eventBus, requestOrch, tokenManager);


            authSystem.startAuthResolution();

            eventBus.publish(Events.APP_READY);

        } catch (error) {
            eventBus.publish(Events.APP_FAILED);
            throw error;
        }


    }



    return {
        eventBus,
        getRequestOrch,
        getAuthSystem,
        getSystemSettings,
        init,
    };



}

export interface IDungeonLedger {
    eventBus: EventBus;
    getRequestOrch: () => RequestOrchestrator;
    getAuthSystem: () => IAuthSystem;
    getSystemSettings: () => SystemSettings;
    init: () => Promise<void>;
}
