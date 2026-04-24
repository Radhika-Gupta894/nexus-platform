import React, { useState, useEffect } from "react";
import { adminService } from "../firebase/adminService";
import { Users, Shield, CheckCircle, Clock, Award, Star, Search } from "lucide-react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/config";

export default function OperativeNetwork() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Realtime stream of users with role 'volunteer'
    const q = query(collection(db, "users"), where("role", "==", "volunteer"));
    const unsub = onSnapshot(q, (snapshot) => {
      setVolunteers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = volunteers.filter(v => 
    v.name?.toLowerCase().includes(search.toLowerCase()) || 
    v.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-20 text-center animate-pulse">Scanning Neural Network...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            placeholder="Search operative by name or email..."
            className="nexus-input pl-12"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((v, idx) => (
          <div key={v.id} className="premium-card p-6 border-t-4 border-t-[var(--color-nexus-primary)] relative group overflow-hidden">
             <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-[var(--color-nexus-light)] rounded-2xl flex items-center justify-center text-[var(--color-nexus-primary)] text-xl font-black">
                   {v.name?.charAt(0) || "O"}
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${v.available !== false ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                   {v.available !== false ? 'Active' : 'Busy'}
                </div>
             </div>

             <h3 className="text-lg font-black text-[var(--color-nexus-text)]">{v.name || "Unknown Operative"}</h3>
             <p className="text-xs text-[var(--color-nexus-text-muted)] mb-6">{v.email}</p>

             <div className="grid grid-cols-2 gap-4 border-t border-[var(--color-nexus-border)] pt-6">
                <div className="space-y-1">
                   <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Assigned</p>
                   <div className="flex items-center gap-2">
                      <Clock size={14} className="text-amber-500" />
                      <span className="text-sm font-bold">{v.assignedCount || 0}</span>
                   </div>
                </div>
                <div className="space-y-1">
                   <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Resolved</p>
                   <div className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-emerald-500" />
                      <span className="text-sm font-bold">{v.resolvedCount || 0}</span>
                   </div>
                </div>
             </div>

             <div className="mt-6 pt-6 border-t border-[var(--color-nexus-border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <Star size={14} className="text-amber-400 fill-amber-400" />
                   <span className="text-xs font-black uppercase tracking-widest text-slate-500">Rank: #{idx + 1}</span>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest text-[var(--color-nexus-primary)] hover:underline">View Profile</button>
             </div>
             
             {/* 🎖️ Performance Badge Overlay */}
             {(v.resolvedCount > 10) && (
               <div className="absolute -right-4 -top-4 opacity-5 rotate-12 group-hover:opacity-10 transition-opacity">
                  <Award size={100} />
               </div>
             )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-[var(--color-nexus-border)] rounded-[2rem]">
             <Users size={48} className="mx-auto text-slate-300 mb-4" />
             <p className="text-slate-500 font-bold">No operatives found in current sector.</p>
          </div>
        )}
      </div>
    </div>
  );
}
