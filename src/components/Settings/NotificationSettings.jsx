import React, { useEffect, useState } from "react";
import { Bell, Mail, MessageSquare, AlertCircle, ShieldAlert } from "lucide-react";
import { db } from "../../firebase/config";
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";

export default function NotificationSettings({ user }) {
  const [settings, setSettings] = useState({
    emailAlerts: true,
    chatAlerts: true,
    reportUpdates: true,
    emergencyAlerts: true,
    taskAssignments: true // For volunteers
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "userSettings", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(prev => ({ ...prev, ...docSnap.data().notifications }));
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
        await setDoc(docRef, { notifications: newSettings });
      } else {
        await updateDoc(docRef, { "notifications": newSettings });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-20 bg-slate-100 rounded-2xl" /><div className="h-20 bg-slate-100 rounded-2xl" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div>
        <h2 className="text-xl font-black uppercase tracking-widest text-slate-900">Alert Configuration</h2>
        <p className="text-slate-500 text-sm mt-1">Control how you receive mission-critical updates.</p>
      </div>

      <div className="grid gap-4">
        <ToggleItem 
          icon={<Mail size={20} />} 
          title="Email Protocols" 
          desc="Receive encrypted summaries and critical updates via email."
          active={settings.emailAlerts}
          onClick={() => toggle("emailAlerts")}
        />
        <ToggleItem 
          icon={<MessageSquare size={20} />} 
          title="Communication Alerts" 
          desc="Notifications for direct messages in tactical comms rooms."
          active={settings.chatAlerts}
          onClick={() => toggle("chatAlerts")}
        />
        <ToggleItem 
          icon={<AlertCircle size={20} />} 
          title="Status Intelligence" 
          desc="Updates on report progression and mission resolution."
          active={settings.reportUpdates}
          onClick={() => toggle("reportUpdates")}
        />

        {user.role === 'volunteer' && (
          <ToggleItem 
            icon={<ShieldAlert size={20} />} 
            title="Task Deployment" 
            desc="Instant alerts when you are assigned to a new field mission."
            active={settings.taskAssignments}
            onClick={() => toggle("taskAssignments")}
          />
        )}

        {user.role !== 'user' && (
          <ToggleItem 
            icon={<ShieldAlert size={20} />} 
            title="High-Priority Crisis" 
            desc="Emergency broadcast alerts for major system-wide incidents."
            active={settings.emergencyAlerts}
            onClick={() => toggle("emergencyAlerts")}
          />
        )}
      </div>
    </div>
  );
}

function ToggleItem({ icon, title, desc, active, onClick }) {
  return (
    <div className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:border-blue-200 transition-all">
      <div className="flex items-center gap-5">
        <div className={`p-3 rounded-2xl ${active ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 leading-none">{title}</h4>
          <p className="text-[11px] text-slate-500 mt-1.5 font-medium">{desc}</p>
        </div>
      </div>
      <button 
        onClick={onClick}
        className={`w-14 h-8 rounded-full relative transition-all duration-300 ${active ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'bg-slate-200'}`}
      >
        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${active ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  );
}
