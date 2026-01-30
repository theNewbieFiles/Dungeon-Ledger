import { BrowserRouter, Routes, Route } from "react-router-dom";
import { app } from "../app";
import type { AuthStatus } from "../app/core/createAuthSystem";
import "./App.css";
import { useAuthState } from "./hooks/useAuthState";
import { Homepage } from "./components/pages/Homepage";
import { Login } from "./components/pages/Login";
import { Signup } from "./components/pages/Signup";
import { RequireAuth } from "./hooks/requireAuth";
import { Dashboard } from "./components/pages/Dashboard";
import { NotFound } from "./components/pages/NotFound";
import { Entry } from "./components/Entry";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Special handling for root */}
        <Route path="/" element={<Entry /> } />

        {/* Protected routes */}
        <Route element={<RequireAuth />}>
          <Route path="/home" element={<Dashboard />} />
          <Route path="/edit/campaign" element={<Dashboard />} />
          {/* ... other protected routes */}
        </Route>

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>

  );


}



export default App;
