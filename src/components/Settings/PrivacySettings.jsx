import React, { useEffect, useState } from "react";
import { Shield, EyeOff, UserSearch, History, Lock } from "lucide-react";
import { db } from "../../firebase/config";
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";

export default function PrivacySettings({ user }) {
  const [settings, setSettings] = useState({
    hideProfile: false,
    anonymousReporting: true,
    publicActivity: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "userSettings", user.uid), (docSnap) => {
      if (docSnap.exists() && docSnap.data().privacy) {
        setSettings(docSnap.data().privacy);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [user.uid]);

  const toggle = async (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    
    const docRef = doc(db, "userSettings", user.uid);
    try {
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, { privacy: newSettings });
      } else {
        await updateDoc(docRef, { "privacy": newSettings });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="h-40 bg-slate-100 rounded-3xl animate-pulse" />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div>
        <h2 className="text-xl font-black uppercase tracking-widest text-slate-900">Privacy Protocols</h2>
        <p className="text-slate-500 text-sm mt-1">Control your digital footprint and operational anonymity.</p>
      </div>

      <div className="grid gap-4">
        <ToggleItem 
          icon={<EyeOff size={20} />} 
          title="Stealth Mode" 
          desc="Hide your profile details from other citizens and volunteers."
          active={settings.hideProfile}
          onClick={() => toggle("hideProfile")}
        />
        <ToggleItem 
          icon={<History size={20} />} 
          title="Anonymous Reporting" 
          desc="Your identity will be masked on all submitted intelligence reports."
          active={settings.anonymousReporting}
          onClick={() => toggle("anonymousReporting")}
        />
        <ToggleItem 
          icon={<UserSearch size={20} />} 
          title="Activity Visibility" 
          desc="Allow your resolved reports to be visible in the public platform feed."
          active={settings.publicActivity}
          onClick={() => toggle("publicActivity")}
        />
      </div>
    </div>
  );
}

function ToggleItem({ icon, title, desc, active, onClick }) {
  return (
    <div className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
      <div className="flex items-center gap-5">
        <div className={`p-3 rounded-2xl ${active ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 leading-none">{title}</h4>
          <p className="text-[11px] text-slate-500 mt-1.5 font-medium">{desc}</p>
        </div>
      </div>
      <button 
        onClick={onClick}
        className={`w-14 h-8 rounded-full relative transition-all duration-300 ${active ? 'bg-indigo-600' : 'bg-slate-200'}`}
      >
        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${active ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  );
}
