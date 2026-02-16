import { createDungeonLedger, IDungeonLedger } from "./core/DungeonLedger.js";


export const DungeonLedger = (() => {
    let instance: IDungeonLedger | null = null;

    function get() {
        if (!instance) {
            instance = createDungeonLedger();
        }
        return instance;
    }

    return { get };
})();
