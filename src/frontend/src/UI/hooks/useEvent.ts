import { useEffect, useRef } from "react";
import { app } from "../../app"
import { EventMeta } from "../../../../shared/createEventBus";


export function useEvent<T = any>(
    topic: string,
    callback: (payload: T, info: { topic: string; meta: EventMeta }) => void
): void {

    const callbackRef = useRef(callback);

    // Keep ref updated without re-subscribing
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        const unsubscribe = app.eventBus.subscribe<T>(topic, (payload, info) => {
            callbackRef.current(payload, info);
        });

        return unsubscribe;
    }, [topic]);
}
