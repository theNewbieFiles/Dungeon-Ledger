import { useEffect } from "react";
import { useEventBus } from "../../context/eventBusContext.js";

/**
 * Subscribe to an event and auto-unsubscribe on unmount
 * @param {string} topic
 * @param {function} callback
 * @param {object} options
 */
export function UseSubscribe(topic, callback, options = {}) {
    const bus = useEventBus();

    useEffect(() => {
        const off = bus.subscribe(topic, callback, options);
        return off;
    }, [bus, topic, callback, options]);

}