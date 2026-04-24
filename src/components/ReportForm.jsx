import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { analyzeReport, parseCleanJSON } from "../ai/gemini";
import Tesseract from "tesseract.js";
import { assignVolunteer } from "../utils/assignVolunteer";
import { checkDuplicate } from "../utils/checkDuplicate";
import { Mic, Camera, Send, Sparkles, AlertTriangle, MapPin } from "lucide-react";
import ChatBox from "./ChatBox"; // ADDED
import { calculateIntelligenceUrgency } from "../utils/urgencyEngine";

export default function ReportForm({ user }) {
  const [formData, setFormData] = useState({ type: "", description: "", location: "" });
  const [coords, setCoords] = useState({ lat: 23.2599, lng: 77.4126 }); // Default to Bhopal/India
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 📍 Capture Live Geolocation
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn("Geolocation blocked or failed:", err)
      );
    }
  }, []);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech recognition not supported");
    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.start();
    setListening(true);
    recognition.onresult = (event) => {
      setFormData({ ...formData, description: event.results[0][0].transcript });
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageLoading(true);
    try {
      const result = await Tesseract.recognize(file, "eng");
      setFormData({ ...formData, description: result.data.text });
      setImageLoading(false);
    } catch (error) {
      console.error(error);
      setImageLoading(false);
      alert("Image scan failed");
    }
  };

  const runAI = async () => {
    if (!formData.description) return alert("Please provide a description first");
    setLoading(true);
    try {
      const result = await analyzeReport(formData.description);
      const clean = parseCleanJSON(result);
      setAiData(clean);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("AI Intelligence analysis failed. Check API key.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      const duplicate = await checkDuplicate(formData);
      if (duplicate) {
        setSubmitting(false);
        return alert("🛑 DUPLICATE: This issue has already been reported at this location.");
      }
      const volunteer = await assignVolunteer(formData);
      
      // 🚀 Smart Urgency Intelligence (AI + Local Keyword Backup)
      const finalUrgency = calculateIntelligenceUrgency(
        `${formData.type} ${formData.description}`,
        aiData?.urgency
      );

      await addDoc(collection(db, "reports"), {
        ...formData,
        lat: coords.lat,
        lng: coords.lng,
        category: aiData?.category || "General",
        urgency: finalUrgency,
        summary: aiData?.summary || "Direct manual report",
        assignedTo: volunteer ? volunteer.name : "No Volunteer",
        assignedToEmail: volunteer ? volunteer.email : "",
        status: "Pending",
        privacy: "Public",
        creatorEmail: user?.email || "anonymous",
        createdAt: new Date().toISOString()
      });

      alert("Report Successfully Dispatched to NEXUS Intelligence 🚀");
      setFormData({ type: "", description: "", location: "" });
      setAiData(null);
    } catch (error) {
      console.error(error);
      alert("Submission failed. check console for logs.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-1000 pb-20">
      <div className="premium-card p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
           <AlertTriangle size={120} className="text-[var(--color-nexus-primary)]" />
        </div>

        <div className="relative z-10">
          <h2 className="text-3xl font-black text-[var(--color-nexus-text)] flex items-center gap-4 mb-2">
            <span className="p-3 bg-red-50 rounded-2xl text-red-500 animate-pulse"><AlertTriangle size={24} /></span>
            Report Civic Hazard
          </h2>
          <p className="text-[var(--color-nexus-text-muted)] text-sm mb-10">Hello, <span className="text-[var(--color-nexus-primary)] font-bold">{user?.name || "Operative"}</span>. Dispatch intelligence directly to authorities.</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-[var(--color-nexus-primary)] uppercase tracking-widest ml-1">Hazard Category</label>
                 <input
                   name="type"
                   placeholder="e.g. Water Leakage, Road Block"
                   value={formData.type}
                   onChange={handleChange}
                   required
                   className="nexus-input"
                 />
               </div>
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-[var(--color-nexus-primary)] uppercase tracking-widest ml-1">Detection Zone</label>
                 <div className="relative">
                   <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-nexus-text-muted)]" size={18} />
                   <input
                     name="location"
                     placeholder="Street name or landmark"
                     value={formData.location}
                     onChange={handleChange}
                     required
                     className="nexus-input pl-12"
                   />
                 </div>
               </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-[var(--color-nexus-primary)] uppercase tracking-widest ml-1">Intelligence Input</label>
              <div className="flex flex-wrap gap-4 mb-4">
                 <button
                   type="button"
                   onClick={startListening}
                   className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all ${listening ? 'bg-red-500 text-white animate-pulse' : 'bg-[var(--color-nexus-light)] text-[var(--color-nexus-primary)] hover:bg-blue-100'}`}
                 >
                   <Mic size={18} />
                   {listening ? "Capturing Voice..." : "Voice Input (Hindi)"}
                 </button>
                 
                 <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} id="image-ocr" />
                 <button 
                   type="button" 
                   onClick={() => document.getElementById('image-ocr').click()}
                   className="flex items-center gap-3 px-6 py-3 rounded-2xl font-bold bg-[var(--color-nexus-light)] text-[var(--color-nexus-primary)] hover:bg-blue-100 transition-all"
                 >
                   <Camera size={18} />
                   {imageLoading ? "Scanning..." : "Scan from Photo"}
                 </button>
              </div>
              
              <textarea
                name="description"
                placeholder="Provide specific details about the situation..."
                value={formData.description}
                onChange={handleChange}
                required
                className="nexus-input h-32 resize-none"
              />
            </div>

            <button
              type="button"
              onClick={runAI}
              className="w-full p-4 bg-white border border-[var(--color-nexus-primary)] text-[var(--color-nexus-primary)] rounded-2xl font-bold flex items-center justify-center gap-4 hover:bg-[var(--color-nexus-light)] transition-all shadow-sm"
              disabled={loading}
            >
              {loading ? <div className="w-5 h-5 border-2 border-[var(--color-nexus-primary)] border-t-transparent rounded-full animate-spin" /> : <Sparkles size={18} />}
              {loading ? "Decrypting Patterns..." : "Enhance with Gemini AI Intelligence"}
            </button>

            {aiData && (
              <div className="p-8 bg-[var(--color-nexus-light)]/50 rounded-[2rem] border border-[var(--color-nexus-border)] animate-in zoom-in duration-500 shadow-inner">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="text-[var(--color-nexus-primary)] font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
                     <Sparkles size={14} /> AI Context Analysis
                   </h3>
                   <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${(aiData?.urgency || 'Low').toLowerCase().includes('high') ? 'bg-red-100 text-red-600 border-red-200' : 'bg-blue-100 text-blue-600 border-blue-200'}`}>
                     {aiData?.urgency || 'Determining...'} Urgency
                   </span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <p className="text-[var(--color-nexus-text)] text-sm leading-relaxed italic font-medium opacity-80">"{aiData.summary}"</p>
                  <div className="pt-4 border-t border-[var(--color-nexus-border)] text-[10px] text-[var(--color-nexus-text-muted)] font-black uppercase tracking-widest">
                    Auto-categorized as: <span className="text-[var(--color-nexus-primary)] underline">{aiData.category}</span>
                  </div>
                </div>
              </div>
            )}

            <button 
              type="submit"
              disabled={submitting}
              className="nexus-btn-primary w-full p-6 text-lg flex items-center justify-center gap-4 hover:scale-[1.01]"
            >
              {submitting ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={24} />}
              {submitting ? "DISPATCHING..." : "DISPATCH FINAL INTELLIGENCE 🚀"}
            </button>
          </form>
        </div>
      </div>

      <ChatBox user={user} />
    </div>
  );
}
