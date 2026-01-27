//import { useState } from 'react'

import { app } from "../app";
import type { AuthStatus } from "../app/core/createAuth";
import "./App.css";
import { useAuthState } from "./hooks/useAuthState";

function App() {
  const authState: AuthStatus = useAuthState();
console.log(authState)
  if (authState === "authenticated") return <>Authenticated</>;
  if (authState === "unauthenticated") return <>UnAuthenticated</>;

  return <Unknown />;
}

function Unknown() {
  const handler = () => {
    console.log("Clicked"); 
    app.auth.checkSession();
  };

  return (
    <>
      Loading...
      <button onClick={() => handler()}>login</button>
    </>
  );
}

export default App;
