import React from "react";
import { Shield, Users, Database, Cpu, Globe, Wrench, Terminal, Download, Trash2, RefreshCw } from "lucide-react";

export default function AdminSettings() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
      <div>
        <h2 className="text-xl font-black uppercase tracking-widest text-slate-900">System Command Center</h2>
        <p className="text-slate-500 text-sm mt-1">High-level platform governance and infrastructure maintenance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AdminCard 
          icon={<Users size={24} />} 
          title="User Management" 
          desc="Modify roles, ban users, or audit operative credentials."
          color="blue"
        />
        <AdminCard 
          icon={<Cpu size={24} />} 
          title="AI Engine Config" 
          desc="Tune Gemini model fallback chains and token limits."
          color="indigo"
        />
        <AdminCard 
          icon={<Shield size={24} />} 
          title="Security Firewall" 
          desc="Configure multi-factor auth and IP restriction protocols."
          color="red"
        />
        <AdminCard 
          icon={<Globe size={24} />} 
          title="Map Deployment" 
          desc="Manage GIS layers and regional intelligence zones."
          color="emerald"
        />
        <AdminCard 
          icon={<Database size={24} />} 
          title="Database Sync" 
          desc="Trigger manual re-indexing or export system state."
          color="amber"
        />
        <AdminCard 
          icon={<Wrench size={24} />} 
          title="Maintenance Mode" 
          desc="Suspend platform operations for emergency upgrades."
          color="slate"
        />
      </div>

      {/* Advanced Actions */}
      <div className="p-8 bg-slate-900 rounded-[3rem] text-white shadow-2xl">
         <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-white/10 rounded-2xl"><Terminal size={24} /></div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-tighter">Tactical Exports & Purge</h3>
              <p className="text-slate-400 text-xs">Direct database operations and record management.</p>
            </div>
         </div>

         <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all border border-white/10">
              <Download size={14} /> Export Global JSON
            </button>
            <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all border border-white/10">
              <RefreshCw size={14} /> Rebuild AI Index
            </button>
            <button className="px-6 py-3 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all border border-red-500/20">
              <Trash2 size={14} /> Purge Resolved Data
            </button>
         </div>
      </div>
    </div>
  );
}

function AdminCard({ icon, title, desc, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    slate: 'bg-slate-100 text-slate-600 border-slate-200'
  };

  return (
    <div className="p-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${colors[color]}`}>
          {icon}
       </div>
       <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 leading-none">{title}</h4>
       <p className="text-[11px] text-slate-500 mt-3 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}
