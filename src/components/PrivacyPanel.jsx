import React, { useState, useEffect } from "react";
import { adminService } from "../firebase/adminService";
import { Database, Shield, ShieldOff, Eye, Lock, PieChart, Activity } from "lucide-react";

export default function PrivacyPanel() {
  const [stats, setStats] = useState({ public: 0, private: 0, total: 0 });

  useEffect(() => {
    const unsub = adminService.listenToStats(s => setStats(s));
    return () => unsub();
  }, []);

  const publicPercent = stats.total > 0 ? Math.round((stats.public / stats.total) * 100) : 0;
  const privatePercent = stats.total > 0 ? Math.round((stats.private / stats.total) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Visibility Distribution */}
        <div className="premium-card p-8">
           <div className="flex items-center gap-3 mb-8">
              <PieChart size={20} className="text-[var(--color-nexus-primary)]" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Visibility Distribution</h3>
           </div>
           
           <div className="space-y-8">
              <div className="space-y-2">
                 <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                    <span className="text-emerald-600 flex items-center gap-2"><Shield size={12} /> Public Intelligence</span>
                    <span>{publicPercent}%</span>
                 </div>
                 <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${publicPercent}%` }} />
                 </div>
                 <p className="text-[10px] text-slate-400 font-medium">Available to all authenticated operatives and citizens.</p>
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                    <span className="text-red-600 flex items-center gap-2"><ShieldOff size={12} /> Restricted (Private)</span>
                    <span>{privatePercent}%</span>
                 </div>
                 <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${privatePercent}%` }} />
                 </div>
                 <p className="text-[10px] text-slate-400 font-medium">Limited to Admin, Assigned Volunteer, and Reporter.</p>
              </div>
           </div>
        </div>

        {/* Intelligence Controls */}
        <div className="premium-card p-8 bg-[var(--color-nexus-light)]/30 border-dashed border-2 border-[var(--color-nexus-border)]">
           <div className="flex items-center gap-3 mb-6">
              <Activity size={20} className="text-[var(--color-nexus-primary)]" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Privacy Engine V2.0</h3>
           </div>
           
           <div className="space-y-4">
              <div className="p-4 bg-white rounded-2xl border border-[var(--color-nexus-border)] shadow-sm">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Active Protocols</h4>
                 <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-xs font-bold text-slate-700">
                       <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> 
                       Zero-Knowledge Metadata
                    </li>
                    <li className="flex items-center gap-3 text-xs font-bold text-slate-700">
                       <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> 
                       Encrypted Geolocation
                    </li>
                    <li className="flex items-center gap-3 text-xs font-bold text-slate-700">
                       <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" /> 
                       Dynamic Route Obfuscation
                    </li>
                 </ul>
              </div>
           </div>

           <button className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all shadow-lg">
              Run Privacy Audit
           </button>
        </div>
      </div>
    </div>
  );
}
