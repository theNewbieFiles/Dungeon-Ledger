import { use, useEffect, useState } from "react";
import { DungeonLedger } from "../../../app";
import { Loading } from "../Pages/Loading";

export function AppInitializer({ children }: { children: React.ReactNode }) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let cancelled = false; 

        async function initialize() {
            const dungeonLedger = DungeonLedger.get();
            await dungeonLedger.init();

            if (!cancelled) {
                console.log("App initialization complete");
                setReady(true);
            }


        }

        initialize();

        return () => {
            cancelled = true;
        };
    }, []); 

    useEffect(() => {}, []); 

    if (!ready) {
        return <Loading />
    }

    return <>{children}</>;
}