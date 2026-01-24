import { useEventBus } from "../../context/eventBusContext.js";

/**
 * Hook to get a publish function for the bus
 * @returns {function(topic: string, payload: any, meta?: object)}
 */
export function usePublish(){
    const bus = useEventBus();

    return (topic, payload, meta) => bus.publish(topic, payload, meta);
}
