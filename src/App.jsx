import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Admin from "./pages/Admin";
import LoginPage from "./pages/LoginPage";
import AddReport from "./components/ReportForm";
import Volunteers from "./pages/Volunteers";
import MapPage from "./pages/MapPage";
import VolunteerPanel from "./components/VolunteerPanel";
import ErrorBoundary from "./components/ErrorBoundary";
import RoleRouter from "./components/RoleRouter";
import ProtectedRoute from "./components/ProtectedRoute";
import AccessDenied from "./pages/AccessDenied";
import Analytics from "./components/Analytics";
import ReportTable from "./components/ReportTable";
import CoreConfig from "./components/CoreConfig";
import Settings from "./pages/Settings";

import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase/config";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Firebase Auth + Profile Synchronization
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Fetch real-time profile from Firestore
        const userRef = doc(db, "users", currentUser.uid);
        
        // Use onSnapshot for real-time profile updates (e.g. if name changes)
        const unsubProfile = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setUser({ ...currentUser, ...docSnap.data() });
          } else {
            // Fallback for new Google users before profile is created
            setUser(currentUser);
          }
          setLoading(false);
        });

        return () => unsubProfile();
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-nexus-bg)] font-sans">
        <div className="w-12 h-12 border-4 border-[var(--color-nexus-primary)] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[var(--color-nexus-text-muted)] uppercase tracking-[0.3em] text-[10px] font-black">NEXUS Core Initializing</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        {!user ? (
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        ) : (
          <div className="flex min-h-screen bg-[var(--color-nexus-bg)] font-sans selection:bg-[var(--color-nexus-primary)] selection:text-white">
            
            <Sidebar user={user} />
            
            <div className="flex-1 flex flex-col transition-all duration-300" style={{ marginLeft: "256px" }}>
              <Navbar user={user} />
              
              <main className="p-8">
                <Routes>
                  {/* Smart Redirect: Root path uses RoleRouter to decide where to go */}
                  <Route path="/" element={<RoleRouter user={user} />} />
                  
                  {/* Admin Specific Routes */}
                  <Route path="/admin" element={
                    <ProtectedRoute user={user} role="admin">
                      <Admin user={user} />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute user={user} role="admin">
                      <Dashboard user={user} />
                    </ProtectedRoute>
                  } />
                  <Route path="/volunteers" element={
                    <ProtectedRoute user={user} role="admin">
                      <Volunteers user={user} />
                    </ProtectedRoute>
                  } />
                  <Route path="/analytics" element={
                    <ProtectedRoute user={user} role="admin">
                      <div className="premium-card p-8"><Analytics /></div>
                    </ProtectedRoute>
                  } />
                  {/* Shared Settings Route (Filtered inside) */}
                  <Route path="/settings" element={
                    <ProtectedRoute user={user}>
                      <Settings user={user} />
                    </ProtectedRoute>
                  } />
                  
                  {/* Volunteer Specific Routes */}
                  <Route path="/volunteer" element={
                    <ProtectedRoute user={user} role="volunteer">
                      <VolunteerPanel user={user} />
                    </ProtectedRoute>
                  } />
                  
                  {/* Citizen Specific Routes */}
                  <Route path="/user" element={
                    <ProtectedRoute user={user} role="user">
                      <AddReport user={user} />
                    </ProtectedRoute>
                  } />
                  <Route path="/my-complaints" element={
                    <ProtectedRoute user={user} role="user">
                      <div className="space-y-6">
                        <h1 className="text-3xl font-black uppercase tracking-tighter text-[var(--color-nexus-text)]">My <span className="text-[var(--color-nexus-primary)]">Complaints</span></h1>
                        <ReportTable user={user} citizenMode={true} />
                      </div>
                    </ProtectedRoute>
                  } />
                  
                  {/* Shared/General Routes (Still protected by auth) */}
                  <Route path="/report" element={<AddReport user={user} />} /> 
                  <Route path="/add" element={<AddReport user={user} />} /> 
                  <Route path="/map" element={<MapPage user={user} />} /> 
                  <Route path="/access-denied" element={<AccessDenied />} />
                  
                  {/* 🔄 Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </div>
        )}
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;