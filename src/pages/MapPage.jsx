import React from "react";
import UrgencyMap from "../components/UrgencyMap";
import { Map as MapIcon, Shield, AlertTriangle } from "lucide-react";

export default function MapPage({ user }) {
  return (
    <div className="min-h-screen bg-[var(--color-nexus-bg)] animate-in fade-in duration-1000">
      {/* 🚀 Premium Header for Map View */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[var(--color-nexus-text)] flex items-center gap-4 tracking-tighter">
            <span className="p-3 bg-[var(--color-nexus-light)] rounded-2xl text-[var(--color-nexus-primary)] shadow-sm">
              <MapIcon size={24} />
            </span>
            Geospatial <span className="text-[var(--color-nexus-primary)]">Intelligence</span>
          </h1>
          <p className="text-[var(--color-nexus-text-muted)] text-sm mt-2 font-medium">Live tactical visualization of city-wide incidents and hazards</p>
        </div>

        <div className="flex items-center gap-4">
           <div className="px-4 py-2 bg-white border border-[var(--color-nexus-border)] rounded-xl flex items-center gap-3 shadow-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Neural Link Active</span>
           </div>
           <div className="px-4 py-2 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 shadow-sm">
              <AlertTriangle size={14} className="text-red-500" />
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Live Feed</span>
           </div>
        </div>
      </div>

      {/* 🗺️ Full-Screen Map Container */}
      <div className="rounded-[2.5rem] overflow-hidden border border-[var(--color-nexus-border)] shadow-xl bg-white relative">
        <UrgencyMap user={user} />
      </div>

      {/* 📊 Bottom Tactical Overlay (Optional) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="premium-card p-6 shadow-sm">
            <h3 className="text-[var(--color-nexus-text)] font-bold mb-2 flex items-center gap-2 text-sm">
               <Shield size={16} className="text-[var(--color-nexus-primary)]" />
               Sector Monitoring
            </h3>
            <p className="text-[var(--color-nexus-text-muted)] text-[10px] uppercase tracking-wider font-black">Currently scanning 14 districts for anomalies</p>
         </div>
      </div>
    </div>
  );
}
