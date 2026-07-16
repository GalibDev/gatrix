import { lazy, Suspense } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Projects = lazy(() => import("./pages/admin/Projects"));
const TeamAdmin = lazy(() => import("./pages/admin/TeamAdmin"));
const Messages = lazy(() => import("./pages/admin/Messages"));
const AchievementsAdmin = lazy(() => import("./pages/admin/AchievementsAdmin"));
const Settings = lazy(() => import("./pages/admin/Settings"));
const HeroSlidesAdmin = lazy(() => import("./pages/admin/HeroSlidesAdmin"));
const GalleryAdmin = lazy(() => import("./pages/admin/GalleryAdmin"));
const HeroContentAdmin = lazy(() => import("./pages/admin/HeroContentAdmin"));
const AIFAQAdmin = lazy(() => import("./pages/admin/AIFAQAdmin"));
const BirthdayAdmin = lazy(() => import("./pages/admin/BirthdayAdmin"));
const NoticeAdmin = lazy(() => import("./pages/admin/NoticeAdmin"));
const ProtectedRoute = lazy(() => import("./routes/ProtectedRoute"));

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-cyan-400">
      Loading…
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <Suspense fallback={<RouteFallback />}>
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
      </Suspense>
    </HashRouter>
  );
}

export default App;
