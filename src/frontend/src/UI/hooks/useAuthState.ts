import { useState } from "react";
import {DungeonLedger} from "../../app/index";
import { useEvent } from "./useEvent";
import type { AuthStatus } from "../../app/core/AuthSystem"
import { Events } from "../../utility/Events";


export function useAuthState(): AuthStatus {
    const dungeonLedger = DungeonLedger.get();
    const [state, setState] = useState(dungeonLedger.getAuthSystem().getStatus()); 

    useEvent(Events.AUTH_STATE_CHANGED, () => {
       
        setState(dungeonLedger.getAuthSystem().getStatus()); 
    }); 

    return state; 
}  