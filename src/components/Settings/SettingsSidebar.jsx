import React from "react";
import { User, Bell, Palette, Shield, Radio, Terminal, Settings as SettingsIcon, Search } from "lucide-react";

export default function SettingsSidebar({ user, activeTab, onTabChange }) {
  const role = user?.role || "user";

  const MENU_ITEMS = [
    { id: "profile", label: "My Identity", icon: <User size={18} />, roles: ["user", "volunteer", "admin"] },
    { id: "notifications", label: "Alert Config", icon: <Bell size={18} />, roles: ["user", "volunteer", "admin"] },
    { id: "theme", label: "Visual Interface", icon: <Palette size={18} />, roles: ["user", "volunteer", "admin"] },
    { id: "privacy", label: "Privacy Protocols", icon: <Shield size={18} />, roles: ["user", "admin"] },
    { id: "volunteer", label: "Field Operations", icon: <Radio size={18} />, roles: ["volunteer", "admin"] },
    { id: "admin", label: "System Command", icon: <Terminal size={18} />, roles: ["admin"] },
  ];

  const filteredMenu = MENU_ITEMS.filter(item => item.roles.includes(role));

  return (
    <div className="w-full lg:w-80 flex flex-col gap-8">
      {/* Search Header */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
        <input 
          placeholder="Search settings..."
          className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold uppercase tracking-widest outline-none focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm"
        />
      </div>

      {/* Navigation Menu */}
      <nav className="bg-white border border-slate-100 rounded-[2.5rem] p-4 shadow-sm space-y-2">
        {filteredMenu.map((item) => (
          <button 
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
              activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 translate-x-2' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className={`${activeTab === item.id ? 'text-white' : 'text-slate-400'}`}>
              {item.icon}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Role Badge */}
      <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-4">
         <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-600">
            <SettingsIcon size={20} />
         </div>
         <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Permissions</p>
            <div className="flex items-center gap-2 mt-1">
               <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${
                 role === 'admin' ? 'bg-red-100 text-red-600' : 
                 role === 'volunteer' ? 'bg-emerald-100 text-emerald-600' : 
                 'bg-blue-100 text-blue-600'
               }`}>
                 {role} Access
               </span>
            </div>
         </div>
      </div>
    </div>
  );
}
