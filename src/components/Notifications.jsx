import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { Bell, AlertTriangle, ShieldCheck } from "lucide-react";

const Notifications = ({ user }) => {
  const [alerts, setAlerts] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      collection(db, "reports"),
      (snapshot) => {
        const data = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(
            (r) =>
              (r.assignedTo === user.name || r.assignedToEmail === user.email) &&
              r.status === "Assigned"
          );

        setAlerts(data);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-[var(--color-nexus-text-muted)] hover:text-[var(--color-nexus-primary)] hover:bg-[var(--color-nexus-light)] rounded-xl transition-all"
      >
        <Bell size={20} />
        {alerts.length > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-[var(--color-nexus-card)]">
            {alerts.length}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-4 w-80 bg-[var(--color-nexus-card)] border border-[var(--color-nexus-border)] rounded-[2rem] shadow-2xl z-50 p-6 animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xs font-black uppercase tracking-widest text-[var(--color-nexus-text)]">Recent Alerts</h4>
              <span className="px-2 py-0.5 bg-[var(--color-nexus-primary)]/10 text-[var(--color-nexus-primary)] text-[8px] font-black rounded-md uppercase">Live</span>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {alerts.length === 0 ? (
                <div className="py-8 text-center">
                  <ShieldCheck className="mx-auto text-[var(--color-nexus-text-muted)] mb-2 opacity-20" size={32} />
                  <p className="text-[10px] font-bold text-[var(--color-nexus-text-muted)] uppercase tracking-widest">No active threats detected</p>
                </div>
              ) : (
                alerts.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-[var(--color-nexus-bg)] rounded-2xl border border-[var(--color-nexus-border)] hover:border-[var(--color-nexus-primary)]/30 transition-all group cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                       <div className="p-2 bg-red-500/10 text-red-500 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-all">
                          <AlertTriangle size={14} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-[var(--color-nexus-text)] uppercase tracking-wider">{item.type}</p>
                          <p className="text-[9px] text-[var(--color-nexus-text-muted)] mt-0.5">{item.location}</p>
                          <div className="mt-2 flex items-center gap-1.5">
                             <div className="w-1 h-1 bg-[var(--color-nexus-primary)] rounded-full animate-pulse"></div>
                             <span className="text-[8px] font-black uppercase text-[var(--color-nexus-primary)] tracking-tighter">Assigned to you</span>
                          </div>
                       </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button className="w-full mt-6 py-3 border border-[var(--color-nexus-border)] text-[var(--color-nexus-text-muted)] text-[8px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-[var(--color-nexus-bg)] hover:text-[var(--color-nexus-text)] transition-all">
               Clear Intelligence Logs
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Notifications;