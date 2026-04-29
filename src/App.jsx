import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import Projects from "./pages/admin/Projects";
import TeamAdmin from "./pages/admin/TeamAdmin";
import Messages from "./pages/admin/Messages";
import AchievementsAdmin from "./pages/admin/AchievementsAdmin";
import Settings from "./pages/admin/Settings";
import HeroSlidesAdmin from "./pages/admin/HeroSlidesAdmin";
import GalleryAdmin from "./pages/admin/GalleryAdmin";
import HeroContentAdmin from "./pages/admin/HeroContentAdmin";
import AIFAQAdmin from "./pages/admin/AIFAQAdmin";

import BirthdayAdmin from "./pages/admin/BirthdayAdmin";
import NoticeAdmin from "./pages/admin/NoticeAdmin";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected admin routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/projects" element={<Projects />} />
          <Route path="/admin/team" element={<TeamAdmin />} />
          <Route path="/admin/messages" element={<Messages />} />
          <Route path="/admin/achievements" element={<AchievementsAdmin />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/hero-slider" element={<HeroSlidesAdmin />} />
          <Route path="/admin/gallery" element={<GalleryAdmin />} />

          {/* ✅ NEW ROUTES INSIDE PROTECTED */}
          <Route path="/admin/hero-content" element={<HeroContentAdmin />} />
          <Route path="/admin/ai-faqs" element={<AIFAQAdmin />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />



<Route path="/admin/birthday" element={<BirthdayAdmin />} />
<Route path="/admin/notice" element={<NoticeAdmin />} />


      </Routes>
    </HashRouter>
  );
}

export default App;