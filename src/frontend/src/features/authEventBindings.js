import { Events } from "../utility/Events.js";
import { eventBus } from "./eventBus.js";


export function bindAuthEvents() {

    eventBus.subscribe(Events.Auth.Login_req, (Payload) => {
        fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(Payload)
        }).then(
            async (response) => {
                const data = await response.json();
                console.log(data); 
            }
        );
    }); 
}