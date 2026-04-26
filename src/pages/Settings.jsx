import React, { useState } from "react";
import SettingsSidebar from "../components/Settings/SettingsSidebar";
import ProfileSettings from "../components/Settings/ProfileSettings";
import NotificationSettings from "../components/Settings/NotificationSettings";
import ThemeSettings from "../components/Settings/ThemeSettings";
import PrivacySettings from "../components/Settings/PrivacySettings";
import VolunteerSettings from "../components/Settings/VolunteerSettings";
import AdminSettings from "../components/Settings/AdminSettings";

export default function Settings({ user }) {
  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile": return <ProfileSettings user={user} />;
      case "notifications": return <NotificationSettings user={user} />;
      case "theme": return <ThemeSettings user={user} />;
      case "privacy": 
        return user.role === 'admin' || user.role === 'user' ? <PrivacySettings user={user} /> : <AccessDenied />;
      case "volunteer": 
        return user.role === 'admin' || user.role === 'volunteer' ? <VolunteerSettings user={user} /> : <AccessDenied />;
      case "admin": 
        return user.role === 'admin' ? <AdminSettings /> : <AccessDenied />;
      default: return <ProfileSettings user={user} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <header>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-[var(--color-nexus-text)]">
          System <span className="text-[var(--color-nexus-primary)]">Preferences</span>
        </h1>
        <p className="text-[var(--color-nexus-text-muted)] text-sm mt-2 font-medium">Configure your tactical environment and operative profile.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-12">
        <SettingsSidebar 
          user={user} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        <main className="flex-1">
          <div className="premium-card p-10 shadow-2xl shadow-blue-500/5 min-h-[600px]">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
      <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center shadow-inner">
        <svg size={40} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} className="w-10 h-10">
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-xl font-black uppercase tracking-widest text-[var(--color-nexus-text)]">Access Restricted</h3>
      <p className="text-[var(--color-nexus-text-muted)] text-xs font-medium max-w-xs">Your current clearance level does not permit access to these tactical configurations.</p>
    </div>
  );
}
