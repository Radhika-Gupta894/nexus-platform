import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";

const AccessDenied = () => {
  return (
    <div className="min-h-screen bg-[var(--color-nexus-bg)] flex flex-col items-center justify-center p-8 animate-in fade-in duration-700">
      <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 mb-8 shadow-xl shadow-red-500/10 border border-red-100">
        <ShieldAlert size={48} />
      </div>
      
      <h1 className="text-4xl font-black text-[var(--color-nexus-text)] tracking-tighter mb-4 text-center">
        ACCESS <span className="text-red-500">DENIED</span>
      </h1>
      
      <p className="text-[var(--color-nexus-text-muted)] text-center max-w-md mb-10 font-medium">
        Your current authorization level does not permit entry to this sector. Please contact a Platform Administrator if you believe this is an error.
      </p>
      
      <Link 
        to="/"
        className="flex items-center gap-3 px-8 py-4 bg-[var(--color-nexus-primary)] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-500/20 hover:scale-105 transition-all"
      >
        <ArrowLeft size={16} />
        Return to Safety
      </Link>
    </div>
  );
};

export default AccessDenied;
