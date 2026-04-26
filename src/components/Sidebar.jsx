import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  PlusCircle,
  Users,
  Settings,
  ShieldCheck,
  Zap
} from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { detectCrisis, parseCleanJSON } from "../ai/gemini";
import CrisisModal from "./CrisisModal";

export default function Sidebar({ user }) {
  const location = useLocation();
  const role = user?.role || "user";
  const [loading, setLoading] = useState(false);
  const [crisisData, setCrisisData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const menu = [
    ...(role === "admin" ? [
      { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
      { name: "Admin Panel", path: "/admin", icon: <ShieldCheck size={18} /> },
      { name: "Map View", path: "/map", icon: <Map size={18} /> },
      { name: "Volunteers", path: "/volunteers", icon: <Users size={18} /> },
      { name: "Analytics", path: "/analytics", icon: <Zap size={18} /> },
      { name: "Settings", path: "/settings", icon: <Settings size={18} /> }
    ] : []),
    ...(role === "volunteer" ? [
      { name: "Tasks", path: "/volunteer", icon: <LayoutDashboard size={18} /> },
      { name: "Map View", path: "/map", icon: <Map size={18} /> },
      { name: "Settings", path: "/settings", icon: <Settings size={18} /> }
    ] : []),
    ...(role === "user" ? [
      { name: "Report Hazard", path: "/user", icon: <PlusCircle size={18} /> },
      { name: "My Complaints", path: "/my-complaints", icon: <ShieldCheck size={18} /> },
      { name: "Map View", path: "/map", icon: <Map size={18} /> },
      { name: "Settings", path: "/settings", icon: <Settings size={18} /> }
    ] : [])
  ];

  const handleCrisisMode = async () => {
    console.log("🔥 AI Crisis Mode Clicked! Handlers starting...");
    setIsModalOpen(true);
    setLoading(true);
    setCrisisData(null); 

    try {
      console.log("📡 Fetching Firestore reports for pattern analysis...");
      const snapshot = await getDocs(collection(db, "reports"));
      const reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      console.log(`✅ Fetched ${reports.length} reports. Triggering AI...`);

      if (reports.length === 0) {
        console.warn("⚠️ No reports found to analyze.");
        setCrisisData({
          crisis: "No Patterns Detected",
          area: "N/A",
          severity: "Low",
          action: "Everything looks calm! No active reports to analyze."
        });
      } else {
        const rawResult = await detectCrisis(reports);
        console.log("📦 AI Raw Output Received:", rawResult);
        const parsed = parseCleanJSON(rawResult);
        setCrisisData(parsed);
      }
    } catch (error) {
      console.error("🚨 Crisis Mode Fatal Error:", error);
      setCrisisData({
        crisis: "System Unreachable",
        area: "Config/Auth",
        severity: "Low",
        action: "The AI agent could not be reached. Error: " + error.message
      });
    } finally {
      setLoading(false);
      console.log("🏁 AI Analysis lifecycle ended.");
    }
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-[var(--color-nexus-card)] border-r border-[var(--color-nexus-border)] p-6 z-[9999]" id="nexus-sidebar">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[var(--color-nexus-primary)]">NEXUS</h1>
        <p className="text-sm text-[var(--color-nexus-text-muted)]">Smart Impact Platform</p>
      </div>

      <div className="space-y-3">
        {menu.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all
              ${location.pathname === item.path
                ? "bg-[var(--color-nexus-primary)] text-white shadow-lg shadow-blue-500/20"
                : "text-[var(--color-nexus-text-muted)] hover:bg-[var(--color-nexus-light)] hover:text-[var(--color-nexus-primary)]"
              }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </div>

      {/* AI Crisis Mode Trigger (Admin Only) */}
      {role === 'admin' && (
        <button 
          type="button"
          onClick={() => {
             console.log("🖱️ BUTTON DOM CLICKED");
             handleCrisisMode();
          }}
          className="absolute bottom-6 left-6 right-6 bg-[var(--color-nexus-primary)] text-white p-4 rounded-2xl shadow-xl hover:bg-[var(--color-nexus-dark)] transition-all cursor-pointer"
        >
          <div className="relative z-10 text-left pointer-events-none">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={16} className="text-yellow-300 fill-yellow-300" />
              <p className="text-sm font-bold">AI Crisis Mode</p>
            </div>
            <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Live Intelligence Scan</p>
          </div>
        </button>
      )}

      <CrisisModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        loading={loading}
        data={crisisData}
      />
    </div>
  );
}