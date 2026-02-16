import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { LoginPage } from "./components/Pages/LoginPage";
import { Signup } from "./components/pages/Signup";
import { RequireAuth } from "./hooks/requireAuth";
import { Dashboard } from "./components/Pages/Dashboard/Dashboard";
import { NotFound } from "./components/Pages/NotFound";
import { Entry } from "./components/Entry";
import { DungeonLedger } from "../app";
import { AppInitializer } from "./components/AppInitializer/AppInitializer";
import { CampaignPage } from "./components/Pages/Campaign/Campaign";
import { MapsPage } from "./components/Pages/Maps/MapsPage";
import { MapEditorPage } from "./components/Pages/MapEditor/MapEditorPage";

function App() {
  //setup
  document.title = "Dungeon Ledger";

  return (
    <AppInitializer>
      <BrowserRouter>
        <Routes>
          {/* Special handling for root */}
          <Route path="/" element={<Entry />} />

          {/* Protected routes */}
          <Route element={<RequireAuth />}>
            <Route path="/home" element={<Dashboard />} />
            <Route path="/campaigns" element={<CampaignPage />} />
            <Route path="/maps" element={<MapsPage />} />
            <Route path="/mapeditor" element={<MapEditorPage />} />
            <Route path="/edit/campaign" element={<Dashboard />} />
            {/* ... other protected routes */}
          </Route>

          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AppInitializer>
  );
}

export default App;
