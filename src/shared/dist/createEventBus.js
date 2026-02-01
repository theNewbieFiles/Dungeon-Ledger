export function createEventBus() {
    const subscribers = new Map();
    function subscribe(topic, callback) {
        if (!subscribers.has(topic)) {
            subscribers.set(topic, new Set());
        }
        subscribers.get(topic).add(callback);
        // return unsubscribe
        return () => {
            subscribers.get(topic).delete(callback);
            if (subscribers.get(topic).size === 0) {
                subscribers.delete(topic);
            }
        };
    }
    function publish(topic, payload, meta = {}) {
        const subs = subscribers.get(topic);
        if (!subs)
            return;
        for (const cb of [...subs]) {
            try {
                cb(payload, { topic, meta });
            }
            catch (err) {
                console.error("EventBus error", err);
            }
        }
    }
    return { subscribe, publish };
}
