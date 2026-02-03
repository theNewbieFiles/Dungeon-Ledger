import { useState } from "react";
import DungeonLedger from "../../app/index";
import { useEvent } from "./useEvent";
import type { AuthStatus } from "../../app/core/AuthSystem"
import { Events } from "../../app/utilities/events";

export function useAuthState(): AuthStatus {
    const [state, setState] = useState(DungeonLedger.authSystem.getStatus()); 

    useEvent(Events.AUTH_STATE_CHANGED, () => {
       
        setState(DungeonLedger.authSystem.getStatus()); 
    }); 

    return state; 
}  