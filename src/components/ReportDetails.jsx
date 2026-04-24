import { Shield, ShieldOff, Lock, User, MapPin, AlertTriangle, CheckCircle2, Clock, X } from "lucide-react";

export default function ReportDetails({ report, user, onClose }) {
  if (!report) return null;

  const isAdmin = user?.role === "admin";
  const isAssigned = report.assignedToEmail === user?.email;
  const isCreator = report.creatorEmail === user?.email;
  // Note: NGO member role check if applicable
  const isNGOMember = user?.role === "ngo";

  const isPublic = report.privacy === "Public" || !report.privacy;
  const hasAccess = isAdmin || isAssigned || isNGOMember || isCreator || isPublic;

  if (!hasAccess && report.privacy === "Private") {
    return (
      <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full text-center shadow-2xl border border-red-100 animate-in zoom-in duration-300">
           <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <Lock size={40} />
           </div>
           <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Access Restricted</h2>
           <p className="text-slate-500 text-sm mb-8 font-medium">This report is classified as <span className="text-red-600 font-bold">PRIVATE</span>. Only authorized personnel can access these records.</p>
           <button 
             onClick={onClose}
             className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all shadow-lg"
           >
             Return to Dashboard
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500 border border-slate-100">
        
        {/* Header Section */}
        <div className={`p-8 flex items-center justify-between ${report.privacy === 'Private' ? 'bg-red-50' : 'bg-emerald-50'}`}>
           <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${report.privacy === 'Private' ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]'}`}>
                 {report.privacy === 'Private' ? <ShieldOff size={24} /> : <Shield size={24} />}
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">{report.type || "Intelligence Report"}</h2>
                <div className="flex items-center gap-3 mt-2">
                   <span className={`text-[10px] font-black uppercase tracking-widest ${report.privacy === 'Private' ? 'text-red-600' : 'text-emerald-600'}`}>
                      {report.privacy || "Public"} Access Mode
                   </span>
                   <div className="w-1 h-1 bg-slate-300 rounded-full" />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {report.id.substring(0,8)}</span>
                </div>
              </div>
           </div>
           <button onClick={onClose} className="p-3 hover:bg-white/50 rounded-2xl transition-all text-slate-400 hover:text-slate-900">
              <X size={24} strokeWidth={3} />
           </button>
        </div>

        <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
           {/* Primary Details */}
           <div className="space-y-8">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational Context</label>
                 <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 italic text-slate-700 leading-relaxed font-medium">
                    "{report.description || report.summary || "No description provided."}"
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Urgency Level</label>
                    <div className={`flex items-center gap-2 font-black uppercase text-sm ${report.urgency?.toLowerCase() === 'high' ? 'text-red-600' : 'text-emerald-600'}`}>
                       <AlertTriangle size={16} /> {report.urgency || "Low"}
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Mission Status</label>
                    <div className="flex items-center gap-2 font-black uppercase text-sm text-slate-900">
                       <CheckCircle2 size={16} className="text-blue-500" /> {report.status || "Pending"}
                    </div>
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Intelligence Summary (AI Generated)</label>
                 <p className="text-slate-600 text-sm leading-relaxed">{report.summary || "Standard manual report without AI synthesis."}</p>
              </div>
           </div>

           {/* Meta Information */}
           <div className="space-y-8">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Deployment Zone</label>
                 <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl text-blue-700 font-bold text-sm border border-blue-100">
                    <MapPin size={18} />
                    {report.location}
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                       <User size={18} className="text-slate-400" />
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Assigned Operative</p>
                          <p className="text-sm font-bold text-slate-900 mt-1">{report.assignedTo || "Unassigned"}</p>
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                       <Clock size={18} className="text-slate-400" />
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Detection Timestamp</p>
                          <p className="text-sm font-bold text-slate-900 mt-1">{new Date(report.createdAt).toLocaleString()}</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Action Rules based on Public Mode */}
              {!isAdmin && !isAssigned && isPublic && (
                <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                   <p className="text-amber-800 text-xs font-medium leading-relaxed">
                     <span className="font-black uppercase tracking-widest block mb-1">Public Access Mode</span>
                     You are viewing this intelligence in read-only mode. Tactical operations (assigning, completing, or editing) are restricted to authorized personnel.
                   </p>
                </div>
              )}
           </div>
        </div>

        {/* Footer Actions */}
        <div className="px-10 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-4">
              {isAdmin && (
                <span className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Admin View</span>
              )}
           </div>
           <button 
             onClick={onClose}
             className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-sm"
           >
             Close Intel
           </button>
        </div>
      </div>
    </div>
  );
}
