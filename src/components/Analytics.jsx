import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from "recharts";
import { TrendingUp, PieChart as PieIcon, Activity } from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#e2af58ff", "#ef4444", "#8b5cf6"];

export default function Analytics() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "reports"), (snapshot) => {
      setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  // Category Distribution
  const categoryMap = {};
  reports.forEach(r => {
    const key = r.type || "Other";
    categoryMap[key] = (categoryMap[key] || 0) + 1;
  });
  const categoryData = Object.keys(categoryMap).map(key => ({
    name: key,
    value: categoryMap[key]
  }));

  // Status Breakdown
  const statusData = [
    { name: "Pending", value: reports.filter(r => (r.status || "Pending").toLowerCase() === "pending").length },
    { name: "Resolved", value: reports.filter(r => (r.status || "").toLowerCase() === "resolved").length },
  ];

  return (
    <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-[var(--color-nexus-light)] rounded-xl text-[var(--color-nexus-primary)] shadow-sm">
          <TrendingUp size={24} />
        </div>
        <h2 className="text-2xl font-black text-[var(--color-nexus-text)] tracking-tighter uppercase">Impact <span className="text-[var(--color-nexus-primary)]">Analytics</span></h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Category Pie Chart */}
        <div className="premium-card p-8 shadow-sm">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6 text-[var(--color-nexus-text-muted)] uppercase tracking-widest text-[10px] font-black">
               <PieIcon size={14} className="text-[var(--color-nexus-primary)]" />
               <span>Issue Distribution</span>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#111827', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Status Bar Chart */}
        <div className="premium-card p-8 shadow-sm">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6 text-[var(--color-nexus-text-muted)] uppercase tracking-widest text-[10px] font-black">
               <Activity size={14} className="text-[var(--color-nexus-primary)]" />
               <span>Status Efficiency</span>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}}
                  />
                  <Tooltip 
                    cursor={{fill: 'rgba(0,0,0,0.02)'}}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="var(--color-nexus-primary)" 
                    radius={[8, 8, 0, 0]} 
                    barSize={60} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}