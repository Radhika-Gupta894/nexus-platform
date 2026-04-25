import React, { useEffect, useState } from "react";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db } from "../firebase/config";
import { 
  Users, CheckCircle2, Clock, MapPin, 
  UploadCloud, AlertCircle, Sparkles, Send 
} from "lucide-react";
import ChatBox from "./ChatBox"; 
import { chatService } from "../firebase/chatService";

export default function VolunteerPanel({ user }) {
  const [tasks, setTasks] = useState([]);
  const [files, setFiles] = useState({});
  const [uploading, setUploading] = useState({});

  const [activeChatReportId, setActiveChatReportId] = useState(null);
  const [activeChatTitle, setActiveChatTitle] = useState("Global Intelligence");

  useEffect(() => {
    if (!user) return;
    
    const unsubscribe = onSnapshot(collection(db, "reports"), (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((report) => report.assignedToEmail === user.email);
      setTasks(data);
    });

    return () => unsubscribe();
  }, [user]);

  const openChat = async (report) => {
    await chatService.getOrCreateChatRoom(report, user);
    setActiveChatReportId(report.id);
    setActiveChatTitle(`Mission Comms: ${report.type}`);
  };

  const updateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "reports", id), { status });
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const completeWithProof = async (taskId) => {
    const file = files[taskId];
    if (!file) return alert("Please select a photo evidence first 📷");

    setUploading(prev => ({ ...prev, [taskId]: true }));
    try {
      const imageRef = ref(storage, `proofs/${taskId}-${Date.now()}`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);

      await updateDoc(doc(db, "reports", taskId), {
        status: "Resolved",
        proofImage: url,
        resolvedAt: new Date().toISOString()
      });

      alert("Mission Accomplished! Proof uploaded and status resolved 🚀");
    } catch (err) {
      console.error(err);
      alert("Upload failed. Verify Storage permissions.");
    } finally {
      setUploading(prev => ({ ...prev, [taskId]: false }));
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-screen bg-[var(--color-nexus-bg)] p-8">
      <div className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-[var(--color-nexus-text)] flex items-center gap-4 tracking-tighter">
            <span className="p-3 bg-[var(--color-nexus-light)] rounded-2xl text-[var(--color-nexus-primary)] shadow-sm"><Users size={28} /></span>
            Volunteer <span className="text-[var(--color-nexus-primary)]">Hub</span>
          </h1>
          <p className="text-[var(--color-nexus-text-muted)] text-sm mt-2 font-medium">
            Field Operation Management for <span className="text-[var(--color-nexus-primary)] font-bold">{user?.displayName}</span>
          </p>
        </div>
        <div className="bg-white border border-[var(--color-nexus-border)] px-6 py-3 rounded-2xl flex items-center gap-4 w-fit shadow-sm">
          <div className="text-right">
            <p className="text-[10px] text-[var(--color-nexus-text-muted)] font-black uppercase tracking-wider">Active Missions</p>
            <p className="text-xl font-black text-[var(--color-nexus-text)]">{tasks.filter(t => t.status !== 'Resolved').length}</p>
          </div>
          <div className="w-px h-8 bg-[var(--color-nexus-border)]" />
          <div className="text-right">
            <p className="text-[10px] text-[var(--color-nexus-text-muted)] font-black uppercase tracking-wider">Completed</p>
            <p className="text-xl font-black text-emerald-600">{tasks.filter(t => t.status === 'Resolved').length}</p>
          </div>
          <div className="w-px h-8 bg-[var(--color-nexus-border)]" />
          <div className="text-right">
             <p className="text-[10px] text-[var(--color-nexus-text-muted)] font-black uppercase tracking-wider">Efficiency</p>
             <p className="text-xl font-black text-blue-600">
               {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'Resolved').length / tasks.length) * 100) : 0}%
             </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 items-start">
        {/* Missions Column */}
        <div className="xl:col-span-2 space-y-8">
           {tasks.length === 0 ? (
            <div className="premium-card py-24 text-center border-dashed border-2 border-[var(--color-nexus-border)] shadow-none">
               <Clock size={48} className="mx-auto text-[var(--color-nexus-border)] mb-4" />
               <p className="text-[var(--color-nexus-text-muted)] font-medium">Monitoring dispatch feed... No missions assigned yet.</p>
            </div>
           ) : (
            tasks.map((task) => (
              <div key={task.id} className={`premium-card p-8 relative overflow-hidden group hover:border-[var(--color-nexus-primary)]/30 transition-all flex flex-col md:flex-row gap-8 shadow-sm ${activeChatReportId === task.id ? 'border-[var(--color-nexus-primary)] ring-2 ring-[var(--color-nexus-primary)]/10' : ''}`}>
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:scale-110 transition-all">
                  <Sparkles size={80} className="text-[var(--color-nexus-primary)]" />
                </div>

                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      task.urgency?.toLowerCase() === 'high' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {task.urgency || 'Normal'} Priority
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      task.status === 'Resolved' ? 'text-emerald-600' : 'text-amber-600'
                    }`}>{task.status || 'Pending'}</span>
                  </div>

                  <h3 className="text-2xl font-black text-[var(--color-nexus-text)] uppercase tracking-tight mb-2">{task.type}</h3>
                  <div className="flex items-center gap-2 text-[var(--color-nexus-text-muted)] mb-6 font-semibold text-sm">
                    <MapPin size={14} className="text-[var(--color-nexus-primary)]" />
                    <span>{task.location}</span>
                  </div>

                  <div className="p-5 bg-[var(--color-nexus-bg)] rounded-2xl border border-[var(--color-nexus-border)] mb-6 text-sm text-[var(--color-nexus-text)] leading-relaxed italic font-medium">
                    "{task.summary || 'No dispatch summary provided.'}"
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {task.status !== 'Resolved' && (
                       <button 
                        onClick={() => updateStatus(task.id, "In Progress")}
                        className="px-6 py-3 bg-[var(--color-nexus-light)] hover:bg-[var(--color-nexus-primary)] hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest text-[var(--color-nexus-primary)] transition-all active:scale-95 shadow-sm"
                       >
                         Acknowledge Mission
                       </button>
                    )}
                    <button 
                      onClick={() => openChat(task)}
                      className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm flex items-center gap-2 ${
                        activeChatReportId === task.id 
                          ? 'bg-[var(--color-nexus-primary)] text-white' 
                          : 'bg-white border border-[var(--color-nexus-border)] text-[var(--color-nexus-text)] hover:border-[var(--color-nexus-primary)]'
                      }`}
                    >
                      <Send size={14} />
                      Chat with Citizen
                    </button>
                  </div>
                </div>

                {task.status !== 'Resolved' && (
                  <div className="w-full md:w-64 space-y-4">
                    <label className="cursor-pointer group/label block">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => setFiles({...files, [task.id]: e.target.files[0]})}
                      />
                      <div className={`p-8 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center gap-3 text-center transition-all ${
                        files[task.id] ? 'bg-blue-50 border-[var(--color-nexus-primary)] text-[var(--color-nexus-primary)] shadow-inner' : 'bg-white border-[var(--color-nexus-border)] text-[var(--color-nexus-text-muted)] group-hover/label:border-[var(--color-nexus-primary)]/40'
                      }`}>
                        <UploadCloud size={24} />
                        <span className="text-[10px] font-black uppercase tracking-widest leading-tight">
                          {files[task.id] ? "Evidence Ready" : "Upload Verification Photo"}
                        </span>
                      </div>
                    </label>

                    <button
                      onClick={() => completeWithProof(task.id)}
                      disabled={uploading[task.id]}
                      className="w-full nexus-btn-primary p-5 rounded-[1.5rem] text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02]"
                    >
                      {uploading[task.id] ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircle2 size={16} />}
                      {uploading[task.id] ? "SYNCING..." : "RESOLVE MISSION"}
                    </button>
                  </div>
                )}
                
                {task.status === 'Resolved' && (
                  <div className="w-full md:w-64 bg-emerald-50 border border-emerald-100 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center shadow-inner">
                     <CheckCircle2 className="text-emerald-500 mb-2" size={24} />
                     <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Operation Success</p>
                  </div>
                )}
              </div>
            ))
           )}
        </div>

        {/* Chat Column */}
        <div className="xl:col-span-1 sticky top-24">
           {activeChatReportId && (
             <button 
               onClick={() => { setActiveChatReportId(null); setActiveChatTitle("Global Intelligence"); }}
               className="mb-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-nexus-primary)] hover:underline flex items-center gap-2"
             >
               ← Back to Global Intelligence
             </button>
           )}
           <ChatBox user={user} reportId={activeChatReportId} title={activeChatTitle} />
        </div>
      </div>
    </div>
  );
}