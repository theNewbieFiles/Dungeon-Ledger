import { BrowserRouter, Routes, Route } from "react-router-dom";
import dungeonLedger  from "../app/index"; //not needed but this initializes the app.
import "./App.css";
import { LoginPage } from "./components/Pages/LoginPage";
import { Signup } from "./components/pages/Signup";
import { RequireAuth } from "./hooks/requireAuth";
import { Dashboard } from "./components/Pages/Dashboard/Dashboard";
import { NotFound } from "./components/Pages/NotFound";
import { Entry } from "./components/Entry";


function App() {
  //setup 
  document.title = "Dungeon Ledger"; 

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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>

  );
}



export default App;
