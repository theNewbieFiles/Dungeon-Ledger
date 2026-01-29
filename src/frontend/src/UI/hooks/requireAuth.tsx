import { Homepage } from "../components/pages/Homepage";
import { Loading } from "../components/pages/Loading";
import { SessionExpiredOverlay } from "../components/SessionExpiredOverlay";
import { useAuthState } from "./useAuthState";
import { Navigate, useLocation } from "react-router-dom"; 

import { Outlet } from "react-router-dom";

export function RequireAuth() {
  const authState = useAuthState();
  const location = useLocation();


  if (authState === "unknown") {
    return <Loading />;
  }

  if (authState === "unauthenticated") {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return (
    <>
      <Outlet />
      {authState === "expired" && <SessionExpiredOverlay />}
    </>
  );
}




