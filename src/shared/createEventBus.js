// eventBus.js

/**
 * @typedef {Object} EventBus
 *
 * @property {(topic: string, payload: any, meta?: Object) => void} publish
 *   Publishes an event with a topic, payload, and optional metadata.
 *
 * @property {(pattern: string, callback: (payload: any, ctx: { topic: string, meta: Object, id: number }) => void, options?: { priority?: number, once?: boolean }) => () => void} subscribe
 *   Subscribes to events matching a pattern. Returns an unsubscribe function.
 *
 * @property {(pattern: string, callback: Function, options?: Object) => () => void} subscribeOnce
 *   Subscribes to an event once, then auto‑unsubscribes.
 *
 * @property {(pattern: string, callback?: Function) => void} unsubscribe
 *   Unsubscribes from events matching a pattern, optionally by callback.
 *
 * @property {() => void} clearAll
 *   Clears all subscribers.
 *
 * @property {(middleware: (ctx: { topic: string, payload: any, meta: Object, next: Function }) => void) => () => void} addMiddleware
 *   Adds middleware to the event bus. Returns a remove function.
 *
 * @property {(prefix: string) => EventBus} child
 *   Creates a scoped child event bus with a prefix.
 */


export function createEventBus({ async = false } = {}) {
  let nextSubId = 1;
  const subscribers = new Map(); // pattern -> [sub]
  const middlewares = [];

  function addMiddleware(fn) {
    middlewares.push(fn);
    return () => {
      const idx = middlewares.indexOf(fn);
      if (idx >= 0) middlewares.splice(idx, 1);
    };
  }

  function subscribe(pattern, callback, options = {}) {
    const { priority = 0, once = false } = options;
    if (!subscribers.has(pattern)) {
      subscribers.set(pattern, []);
    }
    const sub = {
      id: nextSubId++,
      callback,
      priority,
      once,
      pattern,
    };
    const list = subscribers.get(pattern);
    list.push(sub);
    // keep highest priority first
    list.sort((a, b) => b.priority - a.priority);

    return () => unsubscribeById(sub.id);
  }

  function subscribeOnce(pattern, callback, options = {}) {
    return subscribe(pattern, callback, { ...options, once: true });
  }

  function unsubscribe(pattern, callback) {
    if (!subscribers.has(pattern)) return;
    if (!callback) {
      subscribers.delete(pattern);
      return;
    }
    const list = subscribers.get(pattern);
    const filtered = list.filter(sub => sub.callback !== callback);
    if (filtered.length === 0) {
      subscribers.delete(pattern);
    } else {
      subscribers.set(pattern, filtered);
    }
  }

  function unsubscribeById(id) {
    for (const [pattern, list] of subscribers.entries()) {
      const idx = list.findIndex(sub => sub.id === id);
      if (idx >= 0) {
        list.splice(idx, 1);
        if (list.length === 0) subscribers.delete(pattern);
        return;
      }
    }
  }

  function clearAll() {
    subscribers.clear();
  }

  function matchPattern(pattern, topic) {
    if (pattern === topic) return true;
    const pParts = pattern.split('.');
    const tParts = topic.split('.');
    if (pParts.length !== tParts.length) return false;

    for (let i = 0; i < pParts.length; i++) {
      if (pParts[i] === '*') continue;
      if (pParts[i] !== tParts[i]) return false;
    }
    return true;
  }

  function getMatchingSubscribers(topic) {
    const matches = [];
    for (const [pattern, list] of subscribers.entries()) {
      if (matchPattern(pattern, topic)) {
        matches.push(...list);
      }
    }
    // already sorted by priority per pattern, but merging patterns
    // might break global ordering; sort again by priority.
    matches.sort((a, b) => b.priority - a.priority);
    return matches;
  }

  function dispatch(topic, payload, meta) {
    const subs = getMatchingSubscribers(topic);
    if (subs.length === 0) return;

    const run = () => {
      for (const sub of [...subs]) {
        // sub might have been removed by earlier callback
        let stillExists = false;
        const currentList = subscribers.get(sub.pattern);
        if (currentList && currentList.some(s => s.id === sub.id)) {
          stillExists = true;
        }
        if (!stillExists) continue;

        try {
          sub.callback(payload, { topic, meta, id: sub.id });
        } catch (err) {
          // You can plug in error handling here or emit an "error" event
          // console.error('EventBus subscriber error', err);
        }

        if (sub.once) {
          unsubscribeById(sub.id);
        }
      }
    };

    if (async) {
      queueMicrotask(run);
    } else {
      run();
    }
  }

  function runMiddlewares(index, ctx) {
    if (index >= middlewares.length) {
      dispatch(ctx.topic, ctx.payload, ctx.meta);
      return;
    }
    const mw = middlewares[index];
    mw({
      ...ctx,
      next: (nextCtx = ctx) => runMiddlewares(index + 1, nextCtx),
    });
  }

  function publish(topic, payload, meta = {}) {
    const ctx = { topic, payload, meta };
    if (middlewares.length === 0) {
      dispatch(topic, payload, meta);
      return;
    }
    runMiddlewares(0, ctx);
  }

  function child(scopePrefix) {
    const prefix = scopePrefix.endsWith('.') ? scopePrefix : scopePrefix + '.';
    return {
      publish: (topic, payload, meta) => publish(prefix + topic, payload, meta),
      subscribe: (pattern, cb, opts) => subscribe(prefix + pattern, cb, opts),
      subscribeOnce: (pattern, cb, opts) =>
        subscribeOnce(prefix + pattern, cb, opts),
      unsubscribe: (pattern, cb) => unsubscribe(prefix + pattern, cb),
    };
  }

  return {
    publish,
    subscribe,
    subscribeOnce,
    unsubscribe,
    clearAll,
    addMiddleware,
    child,
  };
}

// Example usage:

// const bus = createEventBus({ async: true });

// const off = bus.subscribe('user.*', (payload, ctx) => {
//   console.log('user.* handler', payload, ctx);
// }, { priority: 10 });

// bus.subscribeOnce('user.created', (payload) => {
//   console.log('user.created once', payload);
// });

// bus.addMiddleware(({ topic, payload, meta, next }) => {
//   console.log('[LOG]', topic, payload, meta);
//   next();
// });

// bus.publish('user.created', { id: 1, name: 'Alice' }, { source: 'signup-form' });
// off(); // unsubscribe
