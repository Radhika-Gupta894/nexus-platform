import { db } from "./config";
import { 
  collection, 
  doc, 
  updateDoc, 
  writeBatch, 
  getDocs, 
  query, 
  where,
  getDoc,
  setDoc,
  onSnapshot
} from "firebase/firestore";

/**
 * 🛡️ NEXUS ADMIN SERVICE
 * Centralized logic for administrative operations
 */

export const adminService = {
  // --- 🧩 Report Operations ---
  
  async updateReportStatus(reportId, status) {
    const ref = doc(db, "reports", reportId);
    await updateDoc(ref, { status, updatedAt: new Date().toISOString() });
  },

  async bulkUpdateReports(reportIds, updates) {
    const batch = writeBatch(db);
    reportIds.forEach(id => {
      const ref = doc(db, "reports", id);
      batch.update(ref, { ...updates, updatedAt: new Date().toISOString() });
    });
    await batch.commit();
  },

  async bulkDeleteReports(reportIds) {
    const batch = writeBatch(db);
    reportIds.forEach(id => {
      const ref = doc(db, "reports", id);
      batch.delete(ref);
    });
    await batch.commit();
  },

  // --- 👥 Volunteer Operations ---
  
  async getAllVolunteers() {
    const q = query(collection(db, "users"), where("role", "==", "volunteer"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async assignToVolunteer(reportId, volunteer) {
    const ref = doc(db, "reports", reportId);
    await updateDoc(ref, {
      assignedTo: volunteer.name,
      assignedToEmail: volunteer.email,
      status: "Assigned",
      assignedAt: new Date().toISOString()
    });
  },

  // --- ⚙️ System Config ---
  
  async getSystemSettings() {
    const ref = doc(db, "settings", "global");
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : {};
  },

  async updateSystemSettings(settings) {
    const ref = doc(db, "settings", "global");
    await setDoc(ref, settings, { merge: true });
  },

  // --- 📊 Analytics ---
  
  listenToStats(callback) {
    return onSnapshot(collection(db, "reports"), (snapshot) => {
      const docs = snapshot.docs.map(doc => doc.data());
      const stats = {
        total: docs.length,
        pending: docs.filter(r => r.status === "Pending").length,
        resolved: docs.filter(r => r.status === "Resolved").length,
        highUrgency: docs.filter(r => r.urgency === "High").length,
        private: docs.filter(r => r.privacy === "Private").length,
        public: docs.filter(r => r.privacy === "Public" || !r.privacy).length
      };
      callback(stats);
    });
  }
};
