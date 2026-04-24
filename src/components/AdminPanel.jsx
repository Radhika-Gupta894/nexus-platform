import React, { useState, useEffect } from "react";
import ReportTable from "./ReportTable";
import SecurityPanel from "./SecurityPanel";
import PrivacyPanel from "./PrivacyPanel";
import CoreConfig from "./CoreConfig";
import OperativeNetwork from "./OperativeNetwork";
import { adminService } from "../firebase/adminService";
import { Shield, Users, BarChart3, Settings, Zap, Database, ChevronRight } from "lucide-react";

export default function AdminPanel({ user }) {
  const [activeTab, setActiveTab] = useState("reports");
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, highUrgency: 0, private: 0, public: 0 });

  useEffect(() => {
    const unsub = adminService.listenToStats(s => setStats(s));
    return () => unsub();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "security": return <SecurityPanel user={user} />;
      case "privacy": return <PrivacyPanel />;
      case "bulk": return <div className="space-y-6"><div className="premium-card p-10 bg-amber-50 border-amber-200 text-center"><Zap size={48} className="mx-auto text-amber-500 mb-4" /><h3 className="text-xl font-bold">Bulk Action Mode</h3><p className="text-sm text-slate-600">Select reports below to perform global intelligence updates.</p></div><ReportTable user={user} /></div>;
      case "volunteers": return <OperativeNetwork />;
      case "settings": return <CoreConfig />;
      default: return <ReportTable user={user} />;
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* 🚀 Admin Command Center Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <button 
           onClick={() => setActiveTab("security")}
           className={`premium-card p-6 border-l-4 text-left transition-all ${activeTab === 'security' ? 'border-l-[var(--color-nexus-primary)] ring-2 ring-[var(--color-nexus-primary)]/10 shadow-lg' : 'border-l-slate-300 hover:border-l-[var(--color-nexus-primary)] shadow-sm'}`}
         >
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-[var(--color-nexus-light)] rounded-2xl text-[var(--color-nexus-primary)]">
                     <Shield size={24} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-[var(--color-nexus-text-muted)] uppercase tracking-widest">Security Status</p>
                     <h3 className="text-xl font-black text-[var(--color-nexus-text)]">NEXUS SECURE</h3>
                  </div>
               </div>
               <ChevronRight size={16} className="text-slate-300" />
            </div>
         </button>
         
         <button 
           onClick={() => setActiveTab("privacy")}
           className={`premium-card p-6 border-l-4 text-left transition-all ${activeTab === 'privacy' ? 'border-l-emerald-500 ring-2 ring-emerald-500/10 shadow-lg' : 'border-l-slate-300 hover:border-l-emerald-500 shadow-sm'}`}
         >
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                     <Database size={24} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-[var(--color-nexus-text-muted)] uppercase tracking-widest">Privacy Engine</p>
                     <h3 className="text-xl font-black text-[var(--color-nexus-text)]">{stats.private} PRIVATE</h3>
                  </div>
               </div>
               <ChevronRight size={16} className="text-slate-300" />
            </div>
         </button>

         <button 
           onClick={() => setActiveTab("bulk")}
           className={`premium-card p-6 border-l-4 text-left transition-all ${activeTab === 'bulk' ? 'border-l-amber-500 ring-2 ring-amber-500/10 shadow-lg' : 'border-l-slate-300 hover:border-l-amber-500 shadow-sm'}`}
         >
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
                     <Zap size={24} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-[var(--color-nexus-text-muted)] uppercase tracking-widest">Bulk Actions</p>
                     <h3 className="text-xl font-black text-[var(--color-nexus-text)]">MULTI-TARGET</h3>
                  </div>
               </div>
               <ChevronRight size={16} className="text-slate-300" />
            </div>
         </button>
      </div>

      {/* 🧩 Management Interface */}
      <div className="space-y-6">
         <div className="flex items-center gap-2 p-1.5 bg-white border border-[var(--color-nexus-border)] rounded-2xl w-fit shadow-sm overflow-x-auto max-w-full">
            <button 
              onClick={() => setActiveTab("reports")}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shrink-0 ${activeTab === 'reports' ? 'bg-[var(--color-nexus-primary)] text-white shadow-md' : 'text-[var(--color-nexus-text-muted)] hover:bg-[var(--color-nexus-light)]'}`}
            >
              <BarChart3 size={14} /> Intelligence
            </button>
            <button 
              onClick={() => setActiveTab("volunteers")}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shrink-0 ${activeTab === 'volunteers' ? 'bg-[var(--color-nexus-primary)] text-white shadow-md' : 'text-[var(--color-nexus-text-muted)] hover:bg-[var(--color-nexus-light)]'}`}
            >
              <Users size={14} /> Operative Network
            </button>
            <button 
              onClick={() => setActiveTab("settings")}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shrink-0 ${activeTab === 'settings' ? 'bg-[var(--color-nexus-primary)] text-white shadow-md' : 'text-[var(--color-nexus-text-muted)] hover:bg-[var(--color-nexus-light)]'}`}
            >
              <Settings size={14} /> Core Config
            </button>
         </div>

         <div className="transition-all duration-500">
            {renderContent()}
         </div>
      </div>
    </div>
  );
}
