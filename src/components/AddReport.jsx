import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { analyzeReport, parseCleanJSON } from "../ai/gemini";
import Tesseract from "tesseract.js";
import { assignVolunteer } from "../utils/assignVolunteer";
import { checkDuplicate } from "../utils/checkDuplicate";

const AddReport = () => {
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    location: ""
  });

  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [listening, setListening] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
    } catch {
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
      setLoading(false);
      console.error("AI Analysis Error:", error);
      alert("AI Analysis failed: " + (error.message || "Unknown error"));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.type || !formData.description || !formData.location) {
      return alert("Please fill in all required fields first.");
    }

    setSubmitting(true);
    console.log("📝 Submitting report to Firestore...");

    try {
      // 🕵️ Duplicate Intelligence Check
      const duplicate = await checkDuplicate(formData);
      if (duplicate) {
        setSubmitting(false);
        return alert("🛑 DUPLICATE DETECTED: This issue has already been reported at this location. Our teams are already on it!");
      }

      const volunteer = await assignVolunteer(formData);
      console.log("👥 Volunteer Assigned:", volunteer ? volunteer.name : "None");

      const docRef = await addDoc(collection(db, "reports"), {
        ...formData,
        category: aiData?.category || "General",
        urgency: aiData?.urgency || "Low",
        summary: aiData?.summary || "No summary provided",
        assignedTo: volunteer ? volunteer.name : "Unassigned",
        status: "Pending",
        createdAt: serverTimestamp()
      });

      console.log("✅ Document written with ID: ", docRef.id);
      alert("Success! Your smart report has been submitted 🚀");
      
      setFormData({ type: "", description: "", location: "" });
      setAiData(null);
    } catch (error) {
      console.error("🚨 Submission Error:", error);
      alert("Submission failed. Check console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white">Submit Smart Report 🚨</h1>
        <p className="text-blue-100 mt-2">AI-powered crisis analysis, Voice input, and OCR scanning</p>
      </div>

      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl border border-white/20 w-full max-w-3xl">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-blue-100 mb-2 ml-1">Problem Type</label>
              <input 
                name="type" 
                placeholder="e.g. Water, Safety, Health"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-4 bg-white/10 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-100 mb-2 ml-1">Location</label>
              <input 
                name="location" 
                placeholder="Area or Street name"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-4 bg-white/10 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-blue-100 mb-2 ml-1">Input Tools</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={startListening}
                className={`flex-1 p-4 rounded-2xl font-bold transition-all ${listening ? 'bg-red-500 animate-pulse' : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'}`}
              >
                🎤 {listening ? "Listening..." : "Speak Description"}
              </button>
              <label className="flex-1 cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <div className="p-4 rounded-2xl font-bold bg-white/10 border border-white/20 text-white text-center hover:bg-white/20 transition-all">
                   📷 {imageLoading ? "Scanning..." : "Upload & Scan Image"}
                </div>
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-blue-100 mb-2 ml-1">Detailed Description</label>
            <textarea 
              name="description" 
              placeholder="What is the issue? Use voice or type here..."
              value={formData.description}
              onChange={handleChange}
              className="w-full p-4 bg-white/10 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-400 transition h-32 resize-none"
              required
            />
          </div>

          <button
            type="button"
            onClick={runAI}
            className="w-full py-4 mb-6 bg-blue-500 text-white rounded-2xl font-bold text-lg hover:bg-blue-600 transition shadow-lg shadow-blue-500/20 disabled:opacity-50"
            disabled={loading || submitting}
          >
            {loading ? "🤖 AI Analyzing..." : "🤖 Run AI Intelligence Check"}
          </button>

          {aiData && (
            <div className="p-6 bg-black/20 rounded-2xl border border-white/10 mb-6">
              <h3 className="text-blue-300 font-bold mb-3 uppercase tracking-wider text-sm">AI Analysis Results</h3>
              <div className="grid grid-cols-2 gap-4">
                <p className="text-white"><span className="text-blue-200">Category:</span> {aiData.category}</p>
                <p className="text-white"><span className="text-blue-200">Urgency:</span> <span className={aiData.urgency?.toLowerCase() === 'high' ? 'text-red-400' : 'text-yellow-400'}>{aiData.urgency}</span></p>
                <p className="col-span-2 text-white italic">"{aiData.summary}"</p>
              </div>
            </div>
          )}

          <button 
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-bold text-xl hover:shadow-xl hover:shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            {submitting ? "🚀 Submitting..." : "Submit Final Smart Report 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddReport;