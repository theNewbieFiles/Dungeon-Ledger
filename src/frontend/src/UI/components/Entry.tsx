import { Navigate } from "react-router-dom";
import { RequireAuth } from "../hooks/requireAuth";
import { useAuthState } from "../hooks/useAuthState";
import { Dashboard } from "./Pages/Dashboard/Dashboard";
import { LandingPage } from "./Pages/LandingPage/LandingPage";
import { Loading } from "./Pages/Loading";
import { BackendDown } from "./Pages/BackendDown";

export function Entry() {
  const authState = useAuthState();

  if (authState === "unknown") return <Loading />;

  if (authState === "authenticated") {
    return <Navigate to="/home" replace />;
  }

  if (authState === "unauthenticated") {
    return <LandingPage />;
  }

  if (authState === "error") {
    return <BackendDown />;
  }

  return null;
}
