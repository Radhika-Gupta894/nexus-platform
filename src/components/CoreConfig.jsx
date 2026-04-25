import React, { useState, useEffect } from "react";
import { adminService } from "../firebase/adminService";
import { Settings, Bell, Zap, Map, Cpu, Power, Save } from "lucide-react";

const ConfigItem = (props) => (
  <div className="flex items-center justify-between p-6 bg-white border border-[var(--color-nexus-border)] rounded-2xl hover:shadow-md transition-all">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${props.active ? 'bg-[var(--color-nexus-light)] text-[var(--color-nexus-primary)]' : 'bg-slate-50 text-slate-400'}`}>
        <props.icon size={20} />
      </div>
      <div>
        <h4 className="text-sm font-black text-[var(--color-nexus-text)] uppercase tracking-tight">{props.label}</h4>
        <p className="text-xs text-[var(--color-nexus-text-muted)] mt-0.5">{props.description}</p>
      </div>
    </div>
    <button 
      onClick={props.onClick}
      className={`w-14 h-7 rounded-full transition-all relative ${props.active ? 'bg-[var(--color-nexus-primary)]' : 'bg-slate-200'}`}
    >
      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${props.active ? 'left-8' : 'left-1'}`} />
    </button>
  </div>
);

export default function CoreConfig() {
  const [settings, setSettings] = useState({
    themeMode: "light",
    notifications: true,
    autoAssignment: false,
    publicMap: true,
    aiAnalysis: true,
    maintenanceMode: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await adminService.getSystemSettings();
      if (Object.keys(data).length > 0) setSettings(data);
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminService.updateSystemSettings(settings);
      alert("✅ Core Configuration Synchronized");
    } catch (error) {
      console.error(error);
      alert("🚨 Sync Failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse">Accessing Neural Config...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ConfigItem 
          icon={Bell} 
          label="System Notifications" 
          description="Push alerts for high urgency incidents"
          active={settings.notifications}
          onClick={() => handleToggle('notifications')}
        />
        <ConfigItem 
          icon={Zap} 
          label="Auto Assignment" 
          description="Algorithmic dispatch based on proximity"
          active={settings.autoAssignment}
          onClick={() => handleToggle('autoAssignment')}
        />
        <ConfigItem 
          icon={Map} 
          label="Public Geospatial Map" 
          description="Enable citizen visibility of incident markers"
          active={settings.publicMap}
          onClick={() => handleToggle('publicMap')}
        />
        <ConfigItem 
          icon={Cpu} 
          label="Gemini AI Analysis" 
          description="Use LLM for automated report verification"
          active={settings.aiAnalysis}
          onClick={() => handleToggle('aiAnalysis')}
        />
        <ConfigItem 
          icon={Power} 
          label="Maintenance Mode" 
          description="Lock system for scheduled core updates"
          active={settings.maintenanceMode}
          onClick={() => handleToggle('maintenanceMode')}
        />
      </div>

      <div className="pt-6 border-t border-[var(--color-nexus-border)] flex justify-end">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="nexus-btn-primary flex items-center gap-3"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={18} />}
          {saving ? "SYNCING..." : "COMMIT CHANGES"}
        </button>
      </div>
    </div>
  );
}
