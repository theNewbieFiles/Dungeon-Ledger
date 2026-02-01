export interface EventMeta {
    [key: string]: any;
}
export interface EventBus {
    publish<T = any>(topic: string, payload?: T, meta?: EventMeta): void;
    subscribe<T = any>(topic: string, callback: (payload: T, info: {
        topic: string;
        meta: EventMeta;
    }) => void): () => void;
}
export declare function createEventBus(): EventBus;
//# sourceMappingURL=createEventBus.d.ts.map