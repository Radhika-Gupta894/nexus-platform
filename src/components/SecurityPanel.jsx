import React from "react";
import { Shield, Lock, Fingerprint, ShieldCheck, AlertCircle, Terminal } from "lucide-react";

export default function SecurityPanel({ user }) {
  const securityLogs = [
    { event: "Login Success", user: user?.email, time: "2 mins ago", status: "Secure" },
    { event: "Role Verification", user: "System", time: "10 mins ago", status: "Verified" },
    { event: "Data Sync", user: "Cloud", time: "1 hour ago", status: "Encrypted" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status Hub */}
        <div className="lg:col-span-1 space-y-6">
           <div className="premium-card p-8 bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                 <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-2xl w-fit mb-6">
                    <ShieldCheck size={32} />
                 </div>
                 <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Nexus Secure</h2>
                 <p className="text-emerald-400/60 text-xs font-bold uppercase tracking-widest">Neural Encryption Active</p>
                 
                 <div className="mt-10 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Your Role</span>
                       <span className="px-3 py-1 bg-white/10 rounded-lg font-black uppercase tracking-widest text-[10px] text-emerald-400">{user?.role || "Operative"}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Session Status</span>
                       <span className="text-emerald-400 font-black">Active</span>
                    </div>
                 </div>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12">
                 <Fingerprint size={200} />
              </div>
           </div>

           <div className="premium-card p-6 border-l-4 border-l-amber-500">
              <div className="flex gap-4">
                 <AlertCircle size={24} className="text-amber-500 shrink-0" />
                 <div>
                    <h4 className="text-sm font-bold text-slate-900">MFA Recommended</h4>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-black">Multi-factor authentication is currently disabled for this sector.</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Audit Logs */}
        <div className="lg:col-span-2">
           <div className="premium-card overflow-hidden">
              <div className="p-6 border-b border-[var(--color-nexus-border)] flex items-center justify-between">
                 <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs flex items-center gap-2">
                    <Terminal size={16} className="text-[var(--color-nexus-primary)]" /> Security Audit Log
                 </h3>
                 <button className="text-[10px] font-black uppercase tracking-widest text-[var(--color-nexus-primary)]">Clear Log</button>
              </div>
              <div className="divide-y divide-[var(--color-nexus-border)]">
                 {securityLogs.map((log, i) => (
                    <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                             <Lock size={16} />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-slate-900">{log.event}</p>
                             <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{log.user}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{log.status}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{log.time}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
