import { App, createApp } from "./core/createApp.js";

//since its async it returns a promise (Promise<App>)
//so I have to treat as if it is a promise. 
export const app = await createApp(); 
app.init(); 