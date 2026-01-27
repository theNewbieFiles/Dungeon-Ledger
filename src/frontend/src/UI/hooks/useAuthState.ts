import { useState } from "react";
import { app } from "../../app";
import { useEvent } from "./useEvent";
import type { AuthStatus } from "../../app/core/createAuth"

export function useAuthState(): AuthStatus {
    const [state, setState] = useState(app.auth.getStatus()); 

    useEvent("auth:state-changed", () => {
       
        setState(app.auth.getStatus()); 
    }); 

    return state; 
}  