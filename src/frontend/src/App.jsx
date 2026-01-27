//import { useState } from 'react'

import './App.css'
import { UseSubscribe } from './features/hooks/eventBusSubscribeHook.js'
import { usePublish } from './features/hooks/eventBusPublishHook.js'
import { Events } from './utility/Events.js';
import { bindAuthEvents } from './features/authEventBindings.js';

bindAuthEvents();

function App() {



  return (
    <>
      <Dummy />
      <Dummy2 />
    </>
  )
}

function Dummy() {
  UseSubscribe("test", (payload) => {
    console.log("Test event received", payload);
  });

  const publish = usePublish();

  return (
    <button onClick={() => publish(Events.Auth.Login_req, { email: "gravy@chrispcr.com", password: "secret1234"})}>
      Publish Test Event
    </button>
  );
}

function Dummy2() {
  UseSubscribe("logout", (payload) => {
    console.log("Test event received", payload);
  });

  const publish = usePublish();

  return (
    <button onClick={() => publish(Events.Auth.logout_req)}>
      logout
    </button>
  );
}

export default App
