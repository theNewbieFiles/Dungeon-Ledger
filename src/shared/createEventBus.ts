export interface EventMeta {
  [key: string]: any;
}

export interface EventBus {
  publish<T = any>(topic: string, payload?: T, meta?: EventMeta): void;
  subscribe<T = any>(
    topic: string,
    callback: (payload: T, info: { topic: string; meta: EventMeta }) => void
  ): () => void; // unsubscribe
}

export function createEventBus(): EventBus {
  const subscribers = new Map<string, Set<Function>>();

  function subscribe<T>(
    topic: string,
    callback: (payload: T, info: { topic: string; meta: EventMeta }) => void
  ) {
    if (!subscribers.has(topic)) {
      subscribers.set(topic, new Set());
    }
    subscribers.get(topic)!.add(callback);

    // return unsubscribe
    return () => {
      subscribers.get(topic)!.delete(callback);
      if (subscribers.get(topic)!.size === 0) {
        subscribers.delete(topic);
      }
    };
  }

  function publish<T>(topic: string, payload?: T, meta: EventMeta = {}) {
    const subs = subscribers.get(topic);
    if (!subs) return;
    for (const cb of [...subs]) {
      try {
        cb(payload, { topic, meta });
      } catch (err) {
        console.error("EventBus error", err);
      }
    }
  }

  return { subscribe, publish };
}
