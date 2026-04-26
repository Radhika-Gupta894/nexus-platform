import React, { useEffect, useState } from "react";
import { Sun, Moon, Palette, Check } from "lucide-react";
import { db } from "../../firebase/config";
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";

const ACCENT_COLORS = [
  { name: "Nexus Blue", hex: "#3b82f6" },
  { name: "Emerald Pro", hex: "#10b981" },
  { name: "Indigo Tactical", hex: "#6366f1" },
  { name: "Crimson Alert", hex: "#ef4444" },
  { name: "Amber Warning", hex: "#f59e0b" },
];

export default function ThemeSettings({ user }) {
  const [theme, setTheme] = useState({
    mode: "light",
    accent: "#3b82f6"
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "userSettings", user.uid), (docSnap) => {
      if (docSnap.exists() && docSnap.data().theme) {
        const newTheme = docSnap.data().theme;
        setTheme(newTheme);
        
        // Live update CSS variables
        document.documentElement.style.setProperty('--color-nexus-primary', newTheme.accent);
        if (newTheme.mode === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    });
    return () => unsub();
  }, [user.uid]);

  const updateTheme = async (updates) => {
    const newTheme = { ...theme, ...updates };
    setTheme(newTheme);
    
    // Live update CSS variables
    document.documentElement.style.setProperty('--color-nexus-primary', newTheme.accent);
    if (newTheme.mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const docRef = doc(db, "userSettings", user.uid);
    try {
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, { theme: newTheme });
      } else {
        await updateDoc(docRef, { "theme": newTheme });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div>
        <h2 className="text-xl font-black uppercase tracking-widest text-slate-900">Visual Interface</h2>
        <p className="text-slate-500 text-sm mt-1">Customize the NEXUS environment to your preference.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mode Selector */}
        <div className="p-8 bg-[var(--color-nexus-card)] border border-[var(--color-nexus-border)] rounded-[2.5rem] shadow-sm">
           <label className="text-[10px] font-black text-[var(--color-nexus-text-muted)] uppercase tracking-widest block mb-6">Environment Mode</label>
           <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => updateTheme({ mode: 'light' })}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${theme.mode === 'light' ? 'border-[var(--color-nexus-primary)] bg-[var(--color-nexus-light)]' : 'border-[var(--color-nexus-border)] bg-[var(--color-nexus-bg)]'}`}
              >
                <Sun size={24} className={theme.mode === 'light' ? 'text-[var(--color-nexus-primary)]' : 'text-[var(--color-nexus-text-muted)]'} />
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-nexus-text)]">Light Mode</span>
              </button>
              <button 
                onClick={() => updateTheme({ mode: 'dark' })}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${theme.mode === 'dark' ? 'border-[var(--color-nexus-primary)] bg-slate-800' : 'border-[var(--color-nexus-border)] bg-[var(--color-nexus-bg)]'}`}
              >
                <Moon size={24} className={theme.mode === 'dark' ? 'text-blue-400' : 'text-[var(--color-nexus-text-muted)]'} />
                <span className={`text-xs font-bold uppercase tracking-widest ${theme.mode === 'dark' ? 'text-white' : 'text-[var(--color-nexus-text)]'}`}>Dark Mode</span>
              </button>
           </div>
        </div>

        {/* Accent Selector */}
        <div className="p-8 bg-[var(--color-nexus-card)] border border-[var(--color-nexus-border)] rounded-[2.5rem] shadow-sm">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-6">Tactical Accent Color</label>
           <div className="grid grid-cols-3 gap-3">
              {ACCENT_COLORS.map((color) => (
                <button 
                  key={color.hex}
                  onClick={() => updateTheme({ accent: color.hex })}
                  className="group relative flex flex-col items-center gap-2"
                >
                  <div 
                    className="w-12 h-12 rounded-2xl shadow-sm transition-transform group-hover:scale-110 flex items-center justify-center"
                    style={{ backgroundColor: color.hex }}
                  >
                    {theme.accent === color.hex && <Check size={20} className="text-white" />}
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-tighter text-slate-400">{color.name}</span>
                </button>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
