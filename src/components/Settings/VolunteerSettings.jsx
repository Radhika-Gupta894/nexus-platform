import React, { useEffect, useState } from "react";
import { Clock, Radio, MapPin, Zap, Power, Shield } from "lucide-react";
import { db } from "../../firebase/config";
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";

export default function VolunteerSettings({ user }) {
  const [settings, setSettings] = useState({
    available: true,
    busyMode: false,
    dutyHours: "09:00 - 18:00",
    autoAccept: false,
    shareLocation: true,
    gpsAccuracy: "high"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "userSettings", user.uid), (docSnap) => {
      if (docSnap.exists() && docSnap.data().volunteer) {
        setSettings(docSnap.data().volunteer);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [user.uid]);

  const update = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    const docRef = doc(db, "userSettings", user.uid);
    try {
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, { volunteer: newSettings });
      } else {
        await updateDoc(docRef, { "volunteer": newSettings });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="h-40 bg-slate-100 rounded-3xl animate-pulse" />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div>
        <h2 className="text-xl font-black uppercase tracking-widest text-slate-900">Operational Availability</h2>
        <p className="text-slate-500 text-sm mt-1">Manage your deployment status and mission preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Availability Toggle */}
        <div className={`p-8 rounded-[2.5rem] border-2 transition-all flex flex-col justify-between gap-6 ${settings.available ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
          <div className="flex items-center justify-between">
            <div className={`p-4 rounded-2xl ${settings.available ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-300 text-white'}`}>
              <Power size={24} />
            </div>
            <button 
              onClick={() => update("available", !settings.available)}
              className={`w-16 h-8 rounded-full relative transition-all ${settings.available ? 'bg-emerald-500' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.available ? 'left-9' : 'left-1'}`} />
            </button>
          </div>
          <div>
            <h4 className={`text-lg font-black uppercase tracking-tighter ${settings.available ? 'text-emerald-900' : 'text-slate-900'}`}>
              {settings.available ? "Active Duty" : "Off Duty"}
            </h4>
            <p className="text-xs font-medium text-slate-500 mt-1">You are {settings.available ? "visible to dispatchers" : "currently hidden from active missions"}.</p>
          </div>
        </div>

        {/* Busy Mode Toggle */}
        <div className={`p-8 rounded-[2.5rem] border-2 transition-all flex flex-col justify-between gap-6 ${settings.busyMode ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100'}`}>
          <div className="flex items-center justify-between">
            <div className={`p-4 rounded-2xl ${settings.busyMode ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 'bg-slate-300 text-white'}`}>
              <Radio size={24} className={settings.busyMode ? 'animate-pulse' : ''} />
            </div>
            <button 
              onClick={() => update("busyMode", !settings.busyMode)}
              className={`w-16 h-8 rounded-full relative transition-all ${settings.busyMode ? 'bg-amber-500' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.busyMode ? 'left-9' : 'left-1'}`} />
            </button>
          </div>
          <div>
            <h4 className={`text-lg font-black uppercase tracking-tighter ${settings.busyMode ? 'text-amber-900' : 'text-slate-900'}`}>
              {settings.busyMode ? "Busy Mode" : "Ready for Mission"}
            </h4>
            <p className="text-xs font-medium text-slate-500 mt-1">Suppresses non-critical task alerts while you are in the field.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-center justify-between">
           <div className="flex items-center gap-5">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><MapPin size={20} /></div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Live GPS Tracking</h4>
                <p className="text-[11px] text-slate-500 mt-1">Share your location for nearby incident alerts.</p>
              </div>
           </div>
           <button 
             onClick={() => update("shareLocation", !settings.shareLocation)}
             className={`w-14 h-8 rounded-full relative transition-all ${settings.shareLocation ? 'bg-blue-600' : 'bg-slate-200'}`}
           >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.shareLocation ? 'left-7' : 'left-1'}`} />
           </button>
        </div>

        <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-center justify-between">
           <div className="flex items-center gap-5">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl"><Zap size={20} /></div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Auto-Accept Missions</h4>
                <p className="text-[11px] text-slate-500 mt-1">Automatically join tasks that match your skills.</p>
              </div>
           </div>
           <button 
             onClick={() => update("autoAccept", !settings.autoAccept)}
             className={`w-14 h-8 rounded-full relative transition-all ${settings.autoAccept ? 'bg-orange-600' : 'bg-slate-200'}`}
           >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.autoAccept ? 'left-7' : 'left-1'}`} />
           </button>
        </div>
      </div>
    </div>
  );
}
