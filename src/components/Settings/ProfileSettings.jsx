import React, { useState } from "react";
import { User, Mail, Camera, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { auth, db } from "../../firebase/config";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

export default function ProfileSettings({ user }) {
  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      // 1. Update Auth Profile
      if (name !== user.displayName) {
        await updateProfile(auth.currentUser, { displayName: name });
      }

      // 2. Update Firestore Profile
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { name: name });

      // 3. Update Email (Requires recent login usually)
      if (email !== user.email) {
        await updateEmail(auth.currentUser, email);
        await updateDoc(userRef, { email: email });
      }

      // 4. Update Password
      if (password) {
        await updatePassword(auth.currentUser, password);
        setPassword("");
      }

      setStatus({ type: "success", message: "Profile intelligence updated successfully." });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: err.message || "Failed to update profile." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div>
        <h2 className="text-xl font-black uppercase tracking-widest text-slate-900">Personal Intelligence</h2>
        <p className="text-slate-500 text-sm mt-1">Manage your identity and authentication credentials.</p>
      </div>

      {status && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold uppercase tracking-widest ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
          {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {status.message}
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                placeholder="Operative Name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                placeholder="operative@nexus.platform"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Reset Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              placeholder="Leave blank to keep current"
            />
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full md:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center gap-3"
        >
          {loading ? "Syncing..." : "Commit Changes"}
        </button>
      </form>
    </div>
  );
}
