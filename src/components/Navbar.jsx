import { Search, Bell, User, LayoutGrid, Map as MapIcon, Shield, Users, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import Notifications from "./Notifications";
import ProfileCard from "./ProfileCard";

export default function Navbar({ user }) {
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const role = user?.role || "user";
  
  const navLinks = [
    ...(role === "admin" ? [
      { name: "Dashboard", path: "/dashboard", icon: <LayoutGrid size={16} /> },
      { name: "Reports", path: "/admin", icon: <Shield size={16} /> },
      { name: "Map", path: "/map", icon: <MapIcon size={16} /> },
      { name: "Volunteers", path: "/volunteers", icon: <Users size={16} /> },
    ] : []),
    ...(role === "volunteer" ? [
      { name: "Tasks", path: "/volunteer", icon: <LayoutGrid size={16} /> },
      { name: "Map", path: "/map", icon: <MapIcon size={16} /> },
    ] : []),
    ...(role === "user" ? [
      { name: "Home", path: "/user", icon: <LayoutGrid size={16} /> },
      { name: "Report", path: "/user", icon: <Shield size={16} /> },
      { name: "My Complaints", path: "/my-complaints", icon: <Shield size={16} /> },
      { name: "Map", path: "/map", icon: <MapIcon size={16} /> },
    ] : [])
  ];

  const initials = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <nav className="h-20 bg-[var(--color-nexus-card)] border-b border-[var(--color-nexus-border)] flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm">
      
      {/* Brand area inside main content */}
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--color-nexus-primary)] rounded-xl shadow-lg shadow-blue-500/20">
            <LayoutGrid size={20} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-[var(--color-nexus-primary)]">
            NEXUS <span className="text-[var(--color-nexus-text)]">Intel</span>
          </h2>
        </div>

        {/* 🔗 Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${location.pathname === link.path ? 'bg-[var(--color-nexus-light)] text-[var(--color-nexus-primary)]' : 'text-[var(--color-nexus-text-muted)] hover:text-[var(--color-nexus-primary)] hover:bg-[var(--color-nexus-light)]/50'}`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Global Search & Profile */}
      <div className="flex items-center gap-6">
        <div className="hidden xl:block">
           <p className="text-[10px] font-black text-[var(--color-nexus-primary)] uppercase tracking-[0.2em] animate-pulse">Neural Link Active</p>
           <p className="text-xs font-bold text-[var(--color-nexus-text)]">Welcome, {user?.name || "Operative"}</p>
        </div>

        <div className="relative group hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-nexus-text-muted)] group-focus-within:text-[var(--color-nexus-primary)] transition-colors" size={18} />
          <input 
            placeholder="Search Intelligence..."
            className="w-64 bg-[var(--color-nexus-bg)] border border-[var(--color-nexus-border)] rounded-2xl py-2 pl-10 pr-4 text-sm text-[var(--color-nexus-text)] placeholder:text-[var(--color-nexus-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-nexus-primary)]/20 transition-all"
          />
        </div>

        <div className="relative">
          <Notifications user={user} />
        </div>

        <div className="relative">
          <div 
            onClick={() => setProfileOpen(!profileOpen)}
            className={`flex items-center gap-3 transition cursor-pointer p-1 pr-3 rounded-2xl ${profileOpen ? 'bg-[var(--color-nexus-light)] shadow-inner' : 'hover:bg-[var(--color-nexus-light)]'}`}
          >
            <div className="w-10 h-10 bg-[var(--color-nexus-primary)] rounded-xl flex items-center justify-center text-white font-black shadow-md overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="P" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="hidden sm:block">
               <p className="text-xs font-bold text-[var(--color-nexus-text)] leading-none truncate max-w-[100px]">{user?.name || "User"}</p>
               <p className="text-[10px] text-[var(--color-nexus-primary)] font-black uppercase tracking-tighter mt-1">{user?.role || "Citizen"}</p>
            </div>
          </div>

          <ProfileCard 
            user={user} 
            isOpen={profileOpen} 
            onClose={() => setProfileOpen(false)} 
          />
        </div>
      </div>
    </nav>
  );
}