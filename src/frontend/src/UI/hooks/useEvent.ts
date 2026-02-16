import { useEffect, useRef } from "react";
import { DungeonLedger } from "../../app/index.js";
import { EventMeta } from "@dungeon-ledger/shared";


export function useEvent<T = any>(
    topic: string,
    callback: (payload: T, info: { topic: string; meta: EventMeta }) => void
): void {
    const dl = DungeonLedger.get();
    const callbackRef = useRef(callback);

    // Keep ref updated without re-subscribing
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        const unsubscribe = dl.eventBus.subscribe<T>(topic, (payload, info) => {
            callbackRef.current(payload, info);
        });

        return unsubscribe;
    }, [topic]);
}
