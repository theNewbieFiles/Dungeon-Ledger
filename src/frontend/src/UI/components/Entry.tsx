import { Navigate } from "react-router-dom";
import { LandingPage } from "./Pages/LandingPage/LandingPage";
import { Loading } from "./Pages/Loading";
import { BackendDown } from "./Pages/BackendDown";
import { DungeonLedger } from "../../app";
import { useState } from "react";
import { useEvent } from "../hooks/useEvent";
import { Events } from "../../utility/Events";

export function Entry() {
  const dl = DungeonLedger.get();

  const [state, setState] = useState(dl.getAuthSystem().getStatus());

  useEvent(Events.AUTH_STATE_CHANGED, () => {
     setState(dl.getAuthSystem().getStatus());

  }); 

  

  if (state === "unknown") return <Loading />;

  if (state === "authenticated") {
    return <Navigate to="/home" replace />;
  }

  if (state === "unauthenticated") {
    return <LandingPage />;
  }

  if (state === "error") {
    return <BackendDown />;
  }

  return null;
}
