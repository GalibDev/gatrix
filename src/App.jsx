import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import Projects from "./pages/admin/Projects";
import TeamAdmin from "./pages/admin/TeamAdmin";
import Messages from "./pages/admin/Messages";
import AchievementsAdmin from "./pages/admin/AchievementsAdmin";
import Settings from "./pages/admin/Settings";
import HeroSlidesAdmin from "./pages/admin/HeroSlidesAdmin";
import ProtectedRoute from "./routes/ProtectedRoute";


import GalleryAdmin from "./pages/admin/GalleryAdmin";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/projects" element={<Projects />} />
          <Route path="/admin/team" element={<TeamAdmin />} />
          <Route path="/admin/messages" element={<Messages />} />
          <Route path="/admin/achievements" element={<AchievementsAdmin />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/hero-slider" element={<HeroSlidesAdmin />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
<Route path="/admin/gallery" element={<GalleryAdmin />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;