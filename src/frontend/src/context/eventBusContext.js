/**
 * @typedef {import("../../../shared/createEventBus").EventBus} EventBus
 */
import { createContext, useContext } from "react";


//this create an object with a unique context for the event bus
//in eventBusProvider, the context is "injected" into the react tree
//so components can use useEventBus to access the bus via the context. 
export const EventBusContext = createContext(null);

/**
 * Custom hook to access the event bus from the EventBusContext.
 * Must be used within a component that is a descendant of EventBusProvider.
 * @returns {EventBus} The event bus object provided by the EventBusProvider.
 * @throws {Error} Throws an error if the hook is used outside of an EventBusProvider.
 */
export function useEventBus() {
  const bus = useContext(EventBusContext);
  if (!bus) {
    throw new Error("useEventBus must be used within an EventBusProvider");
  }
  return bus;
}

