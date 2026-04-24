import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

const StatsCard = ({ title, value, icon, colorClass }) => (
  <div className="premium-card p-6 flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
    <div className="flex justify-between items-start">
      <h3 className="text-[var(--color-nexus-text-muted)] text-sm font-bold uppercase tracking-wider">{title}</h3>
      <div className={`p-2 rounded-lg ${colorClass} opacity-80 group-hover:opacity-100 transition-opacity`}>
        {icon}
      </div>
    </div>
    <div className="mt-4">
      <h1 className="text-4xl font-black text-[var(--color-nexus-text)]">{value}</h1>
    </div>
    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-current opacity-5 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
  </div>
);

import { FileText, Clock, CheckCircle2, AlertTriangle } from "lucide-react";

const StatsCards = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    urgent: 0
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "reports"), (snapshot) => {
      const docs = snapshot.docs.map(doc => doc.data());
      const total = docs.length;
      const pending = docs.filter(r => r.status?.toLowerCase() === "pending" || !r.status).length;
      const resolved = docs.filter(r => r.status?.toLowerCase() === "resolved").length;
      const urgent = docs.filter(r => r.urgency?.toLowerCase() === "high").length;

      setStats({ total, pending, resolved, urgent });
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard 
        title="Total Reports" 
        value={stats.total} 
        icon={<FileText size={20} />} 
        colorClass="bg-blue-500/10 text-blue-500" 
      />
      <StatsCard 
        title="Pending Tasks" 
        value={stats.pending} 
        icon={<Clock size={20} />} 
        colorClass="bg-amber-500/10 text-amber-500" 
      />
      <StatsCard 
        title="Resolved" 
        value={stats.resolved} 
        icon={<CheckCircle2 size={20} />} 
        colorClass="bg-emerald-500/10 text-emerald-500" 
      />
      <StatsCard 
        title="Urgent Alert" 
        value={stats.urgent} 
        icon={<AlertTriangle size={20} />} 
        colorClass="bg-red-500/10 text-red-500" 
      />
    </div>
  );
};

export default StatsCards;