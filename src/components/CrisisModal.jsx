import React from "react";
import { X, AlertTriangle, ShieldCheck, Activity } from "lucide-react";

export default function CrisisModal({ isOpen, onClose, data, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white/90 backdrop-blur-2xl w-full max-w-md rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <Activity className="animate-pulse" />
            <h2 className="text-xl font-bold">AI Crisis Intel</h2>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {loading ? (
            <div className="py-12 flex flex-col items-center gap-4 text-gray-500">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="font-semibold animate-pulse">Scanning live reports for patterns...</p>
            </div>
          ) : data ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-3xl bg-gray-50 border border-gray-100">
                <div className={`p-3 rounded-2xl ${data.severity === 'High' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  <AlertTriangle size={28} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Detected Crisis</p>
                  <p className="text-xl font-bold text-gray-800">{data.crisis}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 rounded-3xl bg-blue-50 border border-blue-100">
                    <p className="text-[10px] font-bold text-blue-400 uppercase">Severity</p>
                    <p className={`font-bold ${data.severity === 'High' ? 'text-red-500' : 'text-blue-600'}`}>{data.severity}</p>
                 </div>
                 <div className="p-4 rounded-3xl bg-indigo-50 border border-indigo-100">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase">Affected Area</p>
                    <p className="font-bold text-indigo-700 truncate">{data.area}</p>
                 </div>
              </div>

              <div className="p-6 rounded-[2rem] bg-slate-900 text-white relative overflow-hidden group">
                <ShieldCheck className="absolute -right-4 -bottom-4 text-white/5 group-hover:scale-150 transition-transform duration-700" size={120} />
                <p className="text-xs font-bold text-blue-400 uppercase mb-2">Recommended Action</p>
                <p className="relative z-10 font-medium text-slate-200 leading-relaxed">
                  {data.action}
                </p>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
              >
                Close Intel Report
              </button>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">Analysis failed. Please try again.</p>
          )}
        </div>
      </div>
    </div>
  );
}
