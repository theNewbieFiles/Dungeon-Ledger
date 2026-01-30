import { useState } from "react";
import { app } from "../../app";
import { useEvent } from "./useEvent";
import type { AuthStatus } from "../../app/core/createAuthSystem"
import { Events } from "../../app/utilities/events";

export function useAuthState(): AuthStatus {
    const [state, setState] = useState(app.authSys.getStatus()); 

    useEvent(Events.AUTH_STATE_CHANGED, () => {
       
        setState(app.authSys.getStatus()); 
    }); 

    return state; 
}  