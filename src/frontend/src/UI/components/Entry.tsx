import { Navigate } from "react-router-dom";
import { RequireAuth } from "../hooks/requireAuth";
import { useAuthState } from "../hooks/useAuthState";
import { Dashboard } from "./pages/Dashboard";
import { Homepage } from "./pages/Homepage";
import { Loading } from "./pages/Loading";
import { BackendDown } from "./pages/BackendDown";

export function Entry() {
  const authState = useAuthState();

  if (authState === "unknown") return <Loading />;

  if (authState === "authenticated") {
    return <Navigate to="/home" replace />;
  }

  if (authState === "unauthenticated") {
    return <Homepage />;
  }

  if (authState === "error") {
    return <BackendDown />;
  }

  return null;
}
