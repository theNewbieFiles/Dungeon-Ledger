
import { Middleware } from "../types";

type Pipeline<C> = (ctx: C) => Promise<void>;

export function createMiddlewareEngine<C>() {

    //middleware storage
    const middlewares: Middleware<C>[] = [];

    //composed pipeline
    let pipeline: Pipeline<C> | undefined;

    // This is how to add middleware to the middleware array. 
    // Each middleware is a function that takes a context and a next function. 
    // Each function will be executed in the order they were added.
    function use(middleware: Middleware<C>): void {
        middlewares.push(middleware);
        pipeline = undefined; //reset pipeline

    }

    /**
     * This function composes the middleware functions into a single pipeline function.
     */
    function compose<C>(middleware: Middleware<C>[]) {
        return function run(ctx: C) {
            let index = -1;


            
            function dispatch(i: number): Promise<void> {
                //next #0 -> next #1 -> next #2 -> next #3
                //  |
                //  |-> next #1 expecting 1 but gets 3 
                if (i <= index) {
                    return Promise.reject(new Error("next() called multiple times"));
                }
                
                index = i;

                const fn = middleware[i];
                if (!fn) return Promise.resolve(undefined);

                return fn(ctx, () => dispatch(i + 1));
            }

            return dispatch(0);
        };
    }

    function getPipeline() {
        if (!pipeline) {
            pipeline = compose(middlewares);
        }
        return pipeline;
    }


    async function run(ctx: C) {
        await getPipeline()(ctx);
    }

    return {
        use,
        run,
    }
}

export type MiddlewareEngine<C> = {
    use(mw: Middleware<C>): void;
    run(ctx: C): Promise<void>;
}; 