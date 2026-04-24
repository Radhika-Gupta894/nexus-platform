import React, { useState } from "react";
import { logout } from "../firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { 
  LogOut, User, Camera, Check, X, 
  Settings, ShieldCheck, Mail, Calendar 
} from "lucide-react";

export default function ProfileCard({ user, isOpen, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handleUpdateName = async () => {
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { name: newName });
      setIsEditing(false);
    } catch (err) {
      alert("Failed to update name");
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const photoRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(photoRef, file);
      const url = await getDownloadURL(photoRef);
      
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { photoURL: url });
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const initials = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'bg-red-50 text-red-600 border-red-100';
      case 'volunteer': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute top-20 right-8 w-80 bg-white border border-[var(--color-nexus-border)] rounded-[2.5rem] shadow-2xl z-50 p-6 animate-in slide-in-from-top-4 duration-300">
        
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-3xl bg-[var(--color-nexus-primary)] flex items-center justify-center text-white text-4xl font-black shadow-xl overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 p-2 bg-white border border-[var(--color-nexus-border)] rounded-xl shadow-lg cursor-pointer hover:bg-[var(--color-nexus-light)] transition-all">
              <Camera size={16} className="text-[var(--color-nexus-primary)]" />
              <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
            </label>
          </div>

          <div className="mt-4 text-center w-full">
            {isEditing ? (
              <div className="flex items-center gap-2 px-4">
                <input 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full nexus-input py-2 text-center text-sm font-bold"
                  autoFocus
                />
                <button onClick={handleUpdateName} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100"><Check size={16}/></button>
                <button onClick={() => setIsEditing(false)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><X size={16}/></button>
              </div>
            ) : (
              <div className="group flex items-center justify-center gap-2 cursor-pointer" onClick={() => setIsEditing(true)}>
                <h3 className="text-xl font-black text-[var(--color-nexus-text)] tracking-tight">{user?.name || "User"}</h3>
                <Settings size={14} className="text-[var(--color-nexus-text-muted)] opacity-0 group-hover:opacity-100 transition-all" />
              </div>
            )}
            <div className={`mt-2 inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getRoleBadge(user?.role)}`}>
              {user?.role || "Citizen"}
            </div>
          </div>
        </div>

        {/* User Info List */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 p-3 bg-[var(--color-nexus-bg)] rounded-2xl border border-[var(--color-nexus-border)]">
            <Mail size={16} className="text-[var(--color-nexus-text-muted)]" />
            <div className="overflow-hidden">
              <p className="text-[10px] font-black text-[var(--color-nexus-text-muted)] uppercase tracking-widest">Digital ID</p>
              <p className="text-xs font-bold text-[var(--color-nexus-text)] truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-[var(--color-nexus-bg)] rounded-2xl border border-[var(--color-nexus-border)]">
            <ShieldCheck size={16} className="text-[var(--color-nexus-text-muted)]" />
            <div>
              <p className="text-[10px] font-black text-[var(--color-nexus-text-muted)] uppercase tracking-widest">Authorization</p>
              <p className="text-xs font-bold text-[var(--color-nexus-text)]">{user?.role === 'admin' ? 'Level 5 - Master' : 'Level 2 - Operative'}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 py-4 bg-red-50 text-red-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-all active:scale-95 border border-red-100"
        >
          <LogOut size={18} />
          Terminate Session
        </button>
      </div>
    </>
  );
}
