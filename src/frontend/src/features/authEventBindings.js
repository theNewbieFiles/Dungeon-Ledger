import { Events } from "../utility/Events.js";
import { eventBus } from "../app/core/eventBus.js";


export function bindAuthEvents() {

    eventBus.subscribe(Events.Auth.Login_req, (Payload) => {
        fetch("http://localhost:3000/auth/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(Payload)
        }).then(
            async (response) => {
                const data = await response.json();
                console.log(data);
                eventBus.publish("logged_in"); 
            }
        );
    });

    eventBus.subscribe(Events.Auth.logout_req, () => {
        fetch("http://localhost:3000/auth/logoff", {
            method: "POST",
            credentials: "include"
        });
    })
}