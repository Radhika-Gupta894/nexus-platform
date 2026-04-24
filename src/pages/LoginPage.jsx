import React, { useState } from "react";
import { auth, db } from "../firebase/config";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User as UserIcon, Shield, Sparkles, LogIn } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveUserToFirestore = async (user, name, role) => {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name: name || user.displayName || "User",
        email: user.email,
        role: role || "user",
        createdAt: new Date().toISOString()
      });
    }
    return snap;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await saveUserToFirestore(userCredential.user, formData.name, formData.role);
      }
      
      const userRef = doc(db, "users", userCredential.user.uid);
      const updatedSnap = await getDoc(userRef);
      const role = updatedSnap.data()?.role || "user";

      if (role === "admin") navigate("/admin");
      else if (role === "volunteer") navigate("/volunteer");
      else navigate("/user");

    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await saveUserToFirestore(result.user, result.user.displayName, "user");
      
      const userRef = doc(db, "users", result.user.uid);
      const snap = await getDoc(userRef);
      const role = snap.data()?.role || "user";

      if (role === "admin") navigate("/admin");
      else if (role === "volunteer") navigate("/volunteer");
      else navigate("/user");
    } catch (error) {
      console.error(error);
      alert("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[var(--color-nexus-bg)] font-sans p-4 overflow-y-auto">
      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-[var(--color-nexus-border)] shadow-2xl text-center w-full max-w-lg animate-in fade-in zoom-in duration-500 relative overflow-hidden">
        
        {/* Abstract Background Glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[var(--color-nexus-primary)] opacity-5 blur-[80px]" />
        
        <div className="mb-8 relative z-10">
          <div className="w-16 h-16 bg-[var(--color-nexus-primary)] rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4 animate-bounce-slow">
             <span className="text-white text-2xl font-black italic">N</span>
          </div>
          <h1 className="text-4xl font-black text-[var(--color-nexus-text)] tracking-tighter">
            NEXUS <span className="text-[var(--color-nexus-primary)] uppercase">Core</span>
          </h1>
          <p className="text-[var(--color-nexus-text-muted)] text-sm font-medium mt-2">
            Intelligence Operations Management
          </p>
        </div>

        <div className="flex bg-[var(--color-nexus-bg)] p-1.5 rounded-2xl mb-8 relative z-10 border border-[var(--color-nexus-border)]">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-xl text-xs font-black tracking-widest transition-all ${isLogin ? 'bg-white text-[var(--color-nexus-primary)] shadow-md border border-[var(--color-nexus-border)]' : 'text-[var(--color-nexus-text-muted)] hover:text-[var(--color-nexus-primary)]'}`}
          >
            LOGIN
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-xl text-xs font-black tracking-widest transition-all ${!isLogin ? 'bg-white text-[var(--color-nexus-primary)] shadow-md border border-[var(--color-nexus-border)]' : 'text-[var(--color-nexus-text-muted)] hover:text-[var(--color-nexus-primary)]'}`}
          >
            ENLIST
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-4 relative z-10">
          {!isLogin && (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-nexus-text-muted)]" size={18} />
                <input
                  name="name"
                  placeholder="Full Name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="nexus-input pl-12 py-4"
                />
              </div>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-nexus-text-muted)]" size={18} />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="nexus-input pl-12 py-4 appearance-none"
                >
                  <option value="user">Citizen / User</option>
                  <option value="volunteer">Intelligence Volunteer</option>
                  <option value="admin">Platform Administrator</option>
                </select>
              </div>
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-nexus-text-muted)]" size={18} />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={handleChange}
              className="nexus-input pl-12 py-4"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-nexus-text-muted)]" size={18} />
            <input
              name="password"
              type="password"
              placeholder="Secure Password"
              required
              value={formData.password}
              onChange={handleChange}
              className="nexus-input pl-12 py-4"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full nexus-btn-primary py-4 text-sm font-black tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (isLogin ? <LogIn size={18} /> : <Sparkles size={18} />)}
            {loading ? "INITIALIZING..." : (isLogin ? "TRANSMIT COMMAND" : "ENLIST IN NEXUS")}
          </button>
        </form>

        <div className="my-8 flex items-center gap-4 relative z-10">
          <div className="h-px bg-[var(--color-nexus-border)] flex-1" />
          <span className="text-[10px] font-black text-[var(--color-nexus-text-muted)] tracking-widest uppercase">Or synchronize with</span>
          <div className="h-px bg-[var(--color-nexus-border)] flex-1" />
        </div>

        <button
          onClick={loginWithGoogle}
          disabled={loading}
          className="w-full bg-white border border-[var(--color-nexus-border)] py-4 rounded-2xl flex items-center justify-center gap-3 text-xs font-black text-[var(--color-nexus-text)] hover:bg-[var(--color-nexus-light)] transition-all shadow-sm"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/layout/google.svg" className="w-5 h-5" alt="G" />
          Google Satellite Link
        </button>
        
        <div className="mt-8 pt-6 border-t border-[var(--color-nexus-border)] relative z-10">
           <p className="text-[10px] text-[var(--color-nexus-text-muted)] font-black uppercase tracking-[0.3em]">Neural Protocol: nexus-v2.0-stable</p>
        </div>

      </div>
    </div>
  );
}