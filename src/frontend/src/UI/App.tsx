import { BrowserRouter, Routes, Route } from "react-router-dom";
import { app } from "../app";
import type { AuthStatus } from "../app/core/createAuth";
import "./App.css";
import { useAuthState } from "./hooks/useAuthState";
import { Homepage } from "./components/pages/Homepage";
import { Login } from "./components/pages/Login";
import { Signup } from "./components/pages/Signup";
import { RequireAuth } from "./hooks/requireAuth";
import { Dashboard } from "./components/pages/Dashboard";
import { NotFound } from "./components/pages/NotFound";

function App() {

  return (
    <BrowserRouter>
      <Routes>


        {/* Protected routes */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/edit/campaign" element={<EditCampaign />} />
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
