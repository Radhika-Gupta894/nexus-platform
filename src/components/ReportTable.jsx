import React, { useEffect, useState } from "react";
import { collection, onSnapshot, doc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { adminService } from "../firebase/adminService";
import { Search, Filter, AlertCircle, CheckCircle2, Clock, Trash2, CheckSquare, Shield, ShieldOff, Layers, Eye, Download, UserPlus, MessageCircle } from "lucide-react";
import ReportDetails from "./ReportDetails";

export default function ReportTable({ user, citizenMode = false }) {
  const [reports, setReports] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedReports, setSelectedReports] = useState([]);
  const [viewingReport, setViewingReport] = useState(null);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "reports"), (snapshot) => {
      let data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      if (citizenMode && user?.email) {
        data = data.filter(r => r.creatorEmail === user.email);
      }

      setReports(data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
    });

    if (isAdmin) {
      const unsubV = onSnapshot(query(collection(db, "users"), where("role", "==", "volunteer")), (snap) => {
        setVolunteers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });
      return () => { unsubscribe(); unsubV(); };
    }

    return () => unsubscribe();
  }, [citizenMode, user?.email, isAdmin]);

  const handleBulkUpdate = async (updates, label) => {
    if (selectedReports.length === 0) return;
    try {
      await adminService.bulkUpdateReports(selectedReports, updates);
      setSelectedReports([]);
      alert(`✅ Bulk updated ${selectedReports.length} reports: ${label}`);
    } catch (error) {
      console.error("🚨 Bulk update error:", error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedReports.length === 0) return;
    if (!window.confirm(`⚠️ Permanently delete ${selectedReports.length} reports?`)) return;
    try {
      await adminService.bulkDeleteReports(selectedReports);
      setSelectedReports([]);
      alert(`🗑️ Purged ${selectedReports.length} records`);
    } catch (error) {
      console.error(error);
    }
  };

  const exportToCSV = () => {
    const headers = ["ID", "Type", "Location", "Status", "Urgency", "Privacy", "Created At"];
    const rows = filteredReports.map(r => [
      r.id, r.type, r.location, r.status, r.urgency, r.privacy || "Public", r.createdAt
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `nexus_report_intelligence_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const toggleSelect = (id) => {
    setSelectedReports(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleResolve = async (id) => {
    try {
      await adminService.updateReportStatus(id, "Resolved");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Purge this record?")) return;
    try {
      await deleteDoc(doc(db, "reports", id));
    } catch (error) {
      console.error(error);
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchSearch =
      (report.type || "").toLowerCase().includes(search.toLowerCase()) ||
      (report.location || "").toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "All" ||
      (report.status || "").toLowerCase() === filter.toLowerCase() ||
      (report.urgency || "").toLowerCase() === filter.toLowerCase() ||
      (report.privacy || "").toLowerCase() === filter.toLowerCase() ||
      (filter === "High" && (report.urgency || "").toLowerCase() === "high");

    return matchSearch && matchFilter;
  });

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getUrgencyStyle = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'low': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPrivacyStyle = (privacy) => {
    return privacy === "Private" 
      ? 'bg-red-50 text-red-600 border-red-100' 
      : 'bg-emerald-50 text-emerald-600 border-emerald-100';
  };

  return (
    <div className="premium-card p-8 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-nexus-text)] flex items-center gap-3">
            <span className="p-2 bg-[var(--color-nexus-light)] rounded-xl text-[var(--color-nexus-primary)]"><Clock size={20} /></span>
            {citizenMode ? "My Activity Log" : "Platform Intelligence Feed"}
          </h2>
          <p className="text-[var(--color-nexus-text-muted)] text-sm mt-1">
            {citizenMode ? "Review and track your submitted hazard reports" : "Manage and resolve live citizen reports"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-nexus-text-muted)]" size={16} />
             <input 
              placeholder="Search type or zone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="nexus-input py-2.5 pl-10 pr-4 text-sm"
             />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-nexus-text-muted)] pointer-events-none" size={16} />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-white border border-[var(--color-nexus-border)] rounded-xl py-2.5 pl-10 pr-10 text-sm focus:ring-2 focus:ring-[var(--color-nexus-primary)]/20 outline-none transition-all cursor-pointer text-[var(--color-nexus-text)]"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
              <option value="Public">Public Only</option>
              <option value="Private">Private Only</option>
              <option value="High" className="text-red-600 font-bold">⚠️ High Urgency</option>
            </select>
          </div>

          {isAdmin && (
            <button 
              onClick={exportToCSV}
              className="p-2.5 bg-white border border-[var(--color-nexus-border)] text-[var(--color-nexus-text-muted)] rounded-xl hover:text-[var(--color-nexus-primary)] transition-all shadow-sm"
              title="Export Intelligence CSV"
            >
              <Download size={18} />
            </button>
          )}

          {isAdmin && selectedReports.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 animate-in slide-in-from-right-4 bg-[var(--color-nexus-light)]/50 p-1.5 rounded-2xl border border-[var(--color-nexus-primary)]/10">
              <span className="text-[10px] font-black uppercase text-[var(--color-nexus-primary)] px-2">{selectedReports.length} SELECTED</span>
              
              <button 
                onClick={() => handleBulkUpdate({ status: "Resolved" }, "Marked Resolved")}
                className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-2"
              >
                <CheckSquare size={10} /> Resolve
              </button>

              <button 
                onClick={() => handleBulkUpdate({ privacy: "Private" }, "Set to Private")}
                className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
              >
                <ShieldOff size={10} /> Private
              </button>

              <select 
                onChange={(e) => {
                  const v = volunteers.find(vol => vol.id === e.target.value);
                  if (v) handleBulkUpdate({ assignedTo: v.name, assignedToEmail: v.email, status: "Assigned" }, `Assigned to ${v.name}`);
                }}
                className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest outline-none border-none cursor-pointer"
              >
                <option value="">Assign Operative</option>
                {volunteers.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>

              <button 
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2"
              >
                <Trash2 size={10} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--color-nexus-border)] bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--color-nexus-bg)]/50 text-[var(--color-nexus-primary)] uppercase tracking-[0.2em] text-[10px] font-black">
              {isAdmin && <th className="px-6 py-5 w-10">Select</th>}
              <th className="px-6 py-5">Intel Type</th>
              <th className="px-6 py-5">Zone/Area</th>
              <th className="px-6 py-5 text-center">Status</th>
              <th className="px-6 py-5">Urgency</th>
              <th className="px-6 py-5 text-center">Privacy</th>
              {!citizenMode && <th className="px-6 py-5 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-nexus-border)]">
            {filteredReports.length > 0 ? filteredReports.map((report) => (
              <tr key={report.id} className={`hover:bg-[var(--color-nexus-light)]/20 transition-colors group ${selectedReports.includes(report.id) ? 'bg-blue-50/50' : ''}`}>
                {isAdmin && (
                  <td className="px-6 py-5">
                    <input 
                      type="checkbox" 
                      checked={selectedReports.includes(report.id)}
                      onChange={() => toggleSelect(report.id)}
                      className="w-4 h-4 rounded border-gray-300 text-[var(--color-nexus-primary)] focus:ring-[var(--color-nexus-primary)]"
                    />
                  </td>
                )}
                <td className="px-6 py-5">
                   <p className="text-[var(--color-nexus-text)] font-bold group-hover:text-[var(--color-nexus-primary)] transition-colors uppercase text-xs">{report.type || "General"}</p>
                   <p className="text-[10px] text-[var(--color-nexus-text-muted)] mt-1">{new Date(report.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="px-6 py-5 text-[var(--color-nexus-text-muted)] text-sm font-medium">{report.location}</td>
                <td className="px-6 py-5 text-center">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(report.status)}`}>
                    {report.status || "Pending"}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border w-fit flex items-center gap-2 ${getUrgencyStyle(report.urgency)}`}>
                    {report.urgency?.toLowerCase() === 'high' && <AlertCircle size={12} />}
                    <span>{report.urgency || "Low"}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getPrivacyStyle(report.privacy)}`}>
                    {report.privacy || "Public"}
                  </span>
                </td>
                {!citizenMode && (
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => setViewingReport(report)}
                          className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          title="View Full Intel & Chat"
                        >
                          <MessageCircle size={16} />
                        </button>
                        <button 
                          onClick={() => setViewingReport(report)}
                          className="p-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-600 hover:text-white transition-all shadow-sm"
                          title="View Full Intel"
                        >
                          <Eye size={16} />
                        </button>
                        {report.status !== "Resolved" && isAdmin && (
                          <button 
                            onClick={() => handleResolve(report.id)}
                            className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                            title="Mark as Resolved"
                          >
                            <CheckSquare size={16} />
                          </button>
                        )}
                        {isAdmin && (
                          <button 
                            onClick={() => handleDelete(report.id)}
                            className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm cursor-pointer"
                            title="Delete Intelligence"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                    </div>
                  </td>
                )}
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="px-6 py-20 text-center">
                  <p className="text-[var(--color-nexus-text-muted)] font-medium">No intelligence detected in this sector.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {viewingReport && (
        <ReportDetails 
          report={viewingReport} 
          user={user} 
          onClose={() => setViewingReport(null)} 
        />
      )}
    </div>
  );
}