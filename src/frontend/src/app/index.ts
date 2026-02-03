import { DungeonLedger } from "./core/DungeonLedger.js";

//since its async it returns a promise (Promise<App>)
//so I have to treat as if it is a promise. 
const dl = await DungeonLedger();
 
dl.init(); 

export default dl;