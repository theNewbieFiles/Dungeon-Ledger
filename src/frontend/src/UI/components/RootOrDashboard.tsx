import { RequireAuth } from "../hooks/requireAuth";
import { useAuthState } from "../hooks/useAuthState";
import { Dashboard } from "./pages/Dashboard";
import { Homepage } from "./pages/Homepage";
import { Loading } from "./pages/Loading";

export function RootOrDashboard() {
  const authState = useAuthState();
  
  if (authState === "unknown") return <Loading />;
  if (authState === "unauthenticated") return <Homepage />;
  
  // Authenticated users see dashboard at root
  return (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  );
}