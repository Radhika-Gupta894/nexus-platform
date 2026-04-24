import React from "react";
import StatsCards from "./StatsCards";
import ReportTable from "./ReportTable";
import Analytics from "./Analytics";
import ChatBox from "./ChatBox";

export default function Dashboard({ user }) {
  return (
    <div className="p-8 space-y-10 max-w-[1600px] mx-auto animate-in fade-in duration-1000">
      
      {/* 🚀 Platform Hero Stats */}
      <StatsCards />

      {/* 🧩 Primary Feed Section (Full Width for Management Focus) */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10 items-start">
        <div className="xl:col-span-3 space-y-10">
           <ReportTable user={user} />
        </div>
        <div className="xl:col-span-1 sticky top-24 space-y-10">
           {/* 💬 Integrated Global Chat for Admins */}
           <ChatBox user={user} />
           
           {/* 📊 Quick Analytics Sidebar */}
           <div className="premium-card p-6 shadow-sm">
              <h3 className="text-[var(--color-nexus-text)] font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-[var(--color-nexus-primary)] rounded-full animate-pulse"></span>
                Admin Intelligence
              </h3>
              <p className="text-[var(--color-nexus-text-muted)] text-xs leading-relaxed">
                NEXUS AI is currently monitoring sector patterns. Resolve pending reports to maintain sector stability.
              </p>
           </div>
        </div>
      </div>

      {/* 📊 Advanced Analytics Section (Full Width) */}
      <div className="border-t border-[var(--color-nexus-border)] pt-10">
         <Analytics />
      </div>

    </div>
  );
}