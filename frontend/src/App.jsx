import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import ReportIssue from "./pages/ReportIssue.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import IssueDetail from "./pages/IssueDetail.jsx";
import Login from "./pages/Login.jsx";

export const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";
export const ApiContext = React.createContext(null);

export const MOCK_ISSUES = [
  {
    id: "mock-local",
    type: "pothole",
    severity: 8,
    status: "reported",
    title: "Fallback pothole report",
    description: "Backend fallback issue shown when API is unavailable.",
    ai_description: "Mock civic issue for offline demo mode.",
    location: { lat: 17.385, lng: 78.4867, address: "Hyderabad" },
    photo_url: "https://images.unsplash.com/photo-1515162816951-d5ea80c8db79?w=800",
    reporter_name: "Demo Citizen",
    upvotes: 12,
    estimated_days: 4,
    created_at: "2026-06-29T00:00:00Z",
    resolved_at: null,
  },
];

const MOCK_USERS = [
  { id: "u1", name: "Demo Hero", xp: 320, badge: "Hero", issues_reported: 5 },
];

function calculateStats(issues, users, healthScore) {
  const total = issues.length;
  const resolved = issues.filter((issue) => issue.status === "resolved").length;
  const inProgress = issues.filter((issue) => issue.status === "in_progress").length;
  const avgSeverity = total ? (issues.reduce((sum, issue) => sum + Number(issue.severity || 0), 0) / total).toFixed(1) : "0.0";
  return {
    total,
    resolved,
    inProgress,
    citizens: users.length || new Set(issues.map((issue) => issue.reporter_id)).size,
    avgSeverity,
    health: healthScore ?? Math.max(0, Math.min(100, Math.round((resolved / Math.max(total, 1)) * 50 + (10 - Number(avgSeverity)) * 5))),
  };
}

function PageFrame({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
      className="relative z-10"
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [healthScore, setHealthScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const refreshData = useCallback(async () => {
    try {
      const [issuesRes, leaderboardRes, healthRes] = await Promise.all([
        fetch(`${API_BASE}/api/issues`),
        fetch(`${API_BASE}/api/leaderboard`),
        fetch(`${API_BASE}/api/city-health`),
      ]);
      if (!issuesRes.ok || !leaderboardRes.ok || !healthRes.ok) throw new Error("Backend not available");
      const issuesData = await issuesRes.json();
      const leaderboardData = await leaderboardRes.json();
      const healthData = await healthRes.json();
      setIssues(issuesData.issues || MOCK_ISSUES);
      setUsers(leaderboardData.users || MOCK_USERS);
      setHealthScore(Number(healthData.score));
    } catch (err) {
      console.error(err);
      setIssues(MOCK_ISSUES);
      setUsers(MOCK_USERS);
      setHealthScore(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 8000);
    return () => clearInterval(interval);
  }, [refreshData]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const stats = useMemo(() => calculateStats(issues, users, healthScore), [issues, users, healthScore]);

  const value = {
    API_BASE,
    issues,
    users,
    stats,
    loading,
    refreshData,
    notify: (message, type = "success") => toast[type]?.(message) || toast(message),
  };

  return (
    <ApiContext.Provider value={value}>
      <div className="page-root">
        <div className="orb-container">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        <Navbar />
        <main className="relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-16 pt-24 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageFrame><Home /></PageFrame>} />
              <Route path="/report" element={<PageFrame><ReportIssue /></PageFrame>} />
              <Route path="/dashboard" element={<PageFrame><Dashboard /></PageFrame>} />
              <Route path="/issue/:id" element={<PageFrame><IssueDetail /></PageFrame>} />
              <Route path="/login" element={<PageFrame><Login /></PageFrame>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "rgba(10,0,21,.92)",
              border: "1px solid rgba(168,85,247,.35)",
              color: "#F1F5F9",
              borderRadius: "16px",
              boxShadow: "0 20px 60px rgba(168,85,247,.25)",
            },
          }}
        />
      </div>
    </ApiContext.Provider>
  );
}
