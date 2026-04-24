import React, { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { User, MapPin, Wrench, CheckCircle, Info, Plus, X, ShieldCheck } from "lucide-react";

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // New Volunteer Form State
  const [newHero, setNewHero] = useState({
    name: "",
    skill: "",
    location: "",
    email: "",
    available: true
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "volunteers"), (snap) => {
      setVolunteers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "volunteers"), {
        ...newHero,
        createdAt: serverTimestamp()
      });
      alert("Welcome to the NEXUS Intel Hero Team! 🚀");
      setShowForm(false);
      setNewHero({ name: "", skill: "", location: "", email: "", available: true });
    } catch (err) {
      console.error(err);
      alert("Failed to enlist. Check intelligence link.");
    }
  };

  return (
    <div className="p-8 pb-20 bg-[var(--color-nexus-bg)] min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-[var(--color-nexus-text)] tracking-tighter">Our <span className="text-[var(--color-nexus-primary)]">Heroes</span> 🤝</h1>
          <p className="text-[var(--color-nexus-text-muted)] mt-2 font-medium">Active community members ready to resolve civic issues</p>
        </div>
        
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-3 nexus-btn-primary px-8 py-4 text-sm"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? "CLOSE REGISTRY" : "ENLIST AS HERO"}
        </button>
      </div>

      {/* 📝 Enlistment Form Overlay */}
      {showForm && (
        <div className="mb-12 bg-white border border-[var(--color-nexus-border)] p-10 rounded-[2.5rem] animate-in slide-in-from-top duration-500 shadow-xl">
           <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-[var(--color-nexus-light)] rounded-2xl text-[var(--color-nexus-primary)]">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[var(--color-nexus-text)]">Hero Registry</h3>
                <p className="text-[var(--color-nexus-text-muted)] text-sm font-medium">Join the coordination network to make a difference</p>
              </div>
           </div>

           <form onSubmit={handleJoin} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-nexus-primary)] ml-1">Hero Name</label>
                <input 
                  required
                  placeholder="e.g. John Doe"
                  className="nexus-input"
                  value={newHero.name}
                  onChange={(e) => setNewHero({...newHero, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-nexus-primary)] ml-1">Expertise</label>
                <input 
                  required
                  placeholder="e.g. Water, Power"
                  className="nexus-input"
                  value={newHero.skill}
                  onChange={(e) => setNewHero({...newHero, skill: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-nexus-primary)] ml-1">Zone</label>
                <input 
                  required
                  placeholder="e.g. Indore, Sector 7"
                  className="nexus-input"
                  value={newHero.location}
                  onChange={(e) => setNewHero({...newHero, location: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-nexus-primary)] ml-1">Email</label>
                <input 
                  required
                  type="email"
                  placeholder="hero@nexus.ai"
                  className="nexus-input"
                  value={newHero.email}
                  onChange={(e) => setNewHero({...newHero, email: e.target.value})}
                />
              </div>
              <div className="lg:col-span-4 mt-4">
                 <button 
                  type="submit"
                  className="nexus-btn-primary w-full py-4 text-base"
                 >
                   CONFIRM ENLISTMENT 🚀
                 </button>
              </div>
           </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-[var(--color-nexus-light)] border-t-[var(--color-nexus-primary)] rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {volunteers.length > 0 ? volunteers.map((v) => (
            <div 
              key={v.id}
              className="premium-card p-8 group relative overflow-hidden shadow-sm"
            >
              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="bg-[var(--color-nexus-light)] p-4 rounded-2xl text-[var(--color-nexus-primary)]">
                  <User size={28} />
                </div>
                <div className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${v.available ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${v.available ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                  {v.available ? "Ready" : "Busy"}
                </div>
              </div>

              <h2 className="text-2xl font-black text-[var(--color-nexus-text)] mb-6 tracking-tight">{v.name || "Anonymous Hero"}</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 bg-[var(--color-nexus-bg)] p-4 rounded-2xl border border-[var(--color-nexus-border)]">
                  <Wrench size={18} className="text-[var(--color-nexus-primary)]" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-nexus-text-muted)]">Expertise</span>
                    <span className="text-sm font-bold text-[var(--color-nexus-text)] capitalize">{v.skill || "General"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-[var(--color-nexus-bg)] p-4 rounded-2xl border border-[var(--color-nexus-border)]">
                  <MapPin size={18} className="text-[var(--color-nexus-primary)]" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-nexus-text-muted)]">Location</span>
                    <span className="text-sm font-bold text-[var(--color-nexus-text)] capitalize">{v.location || "Central"}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[var(--color-nexus-border)] flex justify-between items-center relative z-10">
                <div className="flex items-center gap-2 opacity-50">
                   <CheckCircle className="text-[var(--color-nexus-primary)]" size={14} />
                   <span className="text-[10px] text-[var(--color-nexus-text-muted)] font-black uppercase tracking-widest">Verified Hero</span>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest text-[var(--color-nexus-primary)] bg-[var(--color-nexus-light)] hover:bg-[var(--color-nexus-primary)] hover:text-white px-6 py-3 rounded-xl transition-all shadow-sm">
                  Contact
                </button>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-32 text-center bg-white border border-dashed border-[var(--color-nexus-border)] rounded-[2.5rem]">
               <Info className="mx-auto text-[var(--color-nexus-border)] mb-6" size={64} />
               <p className="text-[var(--color-nexus-text-muted)] font-black uppercase tracking-widest text-lg">Empty Sector.<br/>Neural Registry awaiting heroes.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
