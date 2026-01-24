
import { EventBusContext } from "../context/eventBusContext";
import { eventBus } from "../features/eventBus.js";

export function EventBusProvider({ children}) {
    
    return (
        <EventBusContext.Provider value={eventBus}>
            {children}
        </EventBusContext.Provider>
    );

}