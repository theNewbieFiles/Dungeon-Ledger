import { ApiRequest, RequestContext, RequestQueue } from "../types";


export function RequestQueue<T = any>(): RequestQueue {
    const queue: RequestContext<T>[] = [];

    function addRequest(request: RequestContext<T>) {
        queue.push(request);
    }

    function clearQueue() {
        queue.length = 0;
    }

    function getNextRequest(): RequestContext<T> | undefined {
        return queue.shift();
    }

    function hasPendingRequests(): boolean {
        return queue.length > 0;
    }

    return {
        addRequest,
        clearQueue,
        getNextRequest,
        hasPendingRequests,
    };
}