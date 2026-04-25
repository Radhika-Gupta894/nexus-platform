import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase/config";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { AlertCircle, Shield, MapPin, Filter, Layers, Flame, CheckCircle2 } from "lucide-react";

// 🏎️ Custom Heatmap Component (using vanilla leaflet.heat)
function Heatmap({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;
    
    // Ensure L is on window for the heatmap plugin if it expects it
    if (typeof window !== "undefined") {
      window.L = L;
    }

    // Dynamically import leaflet.heat to avoid build-time issues with window/L
    let heatLayer;
    
    const initHeat = async () => {
      try {
        await import("leaflet.heat");
        if (L.heatLayer) {
          heatLayer = L.heatLayer(points, {
            radius: 25,
            blur: 15,
            max: 1.0,
            gradient: {
              0.4: 'blue',
              0.6: 'cyan',
              0.7: 'lime',
              0.8: 'yellow',
              1.0: 'red'
            }
          }).addTo(map);
        }
      } catch (err) {
        console.error("Failed to load heatmap layer:", err);
      }
    };

    initHeat();

    return () => {
      if (heatLayer) {
        map.removeLayer(heatLayer);
      }
    };
  }, [map, points]);

  return null;
}

// 🖌️ Custom Marker Factory for Premium Aesthetics
const createCustomIcon = (color) => {
  return new L.DivIcon({
    className: "custom-nexus-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 15px ${color};
        animation: pulse-marker 1.5s infinite;
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const icons = {
  High: createCustomIcon("#ef4444"), // Red
  Medium: createCustomIcon("#f97316"), // Orange
  Low: createCustomIcon("#22c55e"), // Green
};

// 🗺️ Auto-Center Helper (Smooth Transitions)
function RecenterMap({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 6, { animate: true, duration: 2 });
  }, [coords, map]);
  return null;
}

export default function UrgencyMap({ user }) {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showHeatmap, setShowHeatmap] = useState(false);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    // 📡 Realtime Intelligence Stream from NEXUS Core
    const q = query(collection(db, "reports"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            ...d,
            lat: d.lat || 20.5937,
            lng: d.lng || 78.9629
          };
        })
        .filter((report) => {
          // Rule: Public reports visible on map. Private reports hidden from public users. Admins can still see all.
          if (isAdmin) return true;
          return report.privacy !== "Private";
        });
      setReports(data);
    });
    return () => unsubscribe();
  }, [isAdmin]);

  const filteredReports = useMemo(() => {
    if (filter === "All") return reports;
    return reports.filter((r) => r.urgency?.toLowerCase() === filter.toLowerCase());
  }, [reports, filter]);

  const heatmapPoints = useMemo(() => {
    return reports.map((r) => [r.lat, r.lng, r.urgency?.toLowerCase() === "high" ? 1 : 0.5]);
  }, [reports]);

  return (
    <div className="relative w-full h-[600px] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl bg-slate-950 group">
      {/* 🚀 Dark Mode Map Layer */}
      <MapContainer
        center={[20.5937, 78.9629]} // India Center
        zoom={5}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", background: "#020617" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {showHeatmap && <Heatmap points={heatmapPoints} />}

        {filteredReports.map((report) => {
          const urgency = report.urgency || "Low";
          const formattedUrgency = urgency.charAt(0).toUpperCase() + urgency.slice(1).toLowerCase();
          
          return (
            <Marker
              key={report.id}
              position={[report.lat, report.lng]}
              icon={icons[formattedUrgency] || icons.Low}
            >
            <Popup className="nexus-popup">
              <div className="p-4 bg-slate-900 text-white rounded-2xl min-w-[200px] border border-white/10 glassmorphism shadow-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-2 rounded-lg ${report.urgency?.toLowerCase() === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    <AlertCircle size={16} />
                  </div>
                  <h3 className="font-black text-sm uppercase tracking-wider">{report.type}</h3>
                </div>
                
                <div className="space-y-2 text-xs">
                   <p className="flex items-center gap-2 text-blue-100/60"><MapPin size={12} /> {report.location}</p>
                   <p className="flex items-center gap-2 font-bold"><Layers size={12} /> Urgency: <span className={report.urgency?.toLowerCase() === 'high' ? 'text-red-400' : 'text-emerald-400'}>{report.urgency}</span></p>
                   <p className="flex items-center gap-2"><Shield size={12} /> Agent: <span className="text-blue-300 font-medium">{report.assignedTo || "Unassigned"}</span></p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                   <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${report.status?.toLowerCase() === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                     {report.status}
                   </span>
                   {report.status === 'Resolved' && <CheckCircle2 size={14} className="text-emerald-400" />}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
      </MapContainer>

      {/* 🔮 Glassmorphism UI Controls */}
      <div className="absolute top-6 left-6 z-[1000] flex flex-col gap-4">
         <div className="bg-slate-950/40 backdrop-blur-3xl border border-white/10 p-2 rounded-2xl flex gap-1 shadow-2xl">
            {["All", "High", "Medium", "Low"].map((u) => (
              <button
                key={u}
                onClick={() => setFilter(u)}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === u ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-white/10 text-white/60'}`}
              >
                {u}
              </button>
            ))}
         </div>

         <button 
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`flex items-center justify-center gap-3 w-fit bg-slate-950/40 backdrop-blur-3xl border border-white/10 p-3 rounded-2xl shadow-2xl transition-all ${showHeatmap ? 'text-orange-400 border-orange-500/30' : 'text-white/60 hover:text-white'}`}
         >
           <Flame size={18} className={showHeatmap ? 'animate-pulse' : ''} />
           <span className="text-[10px] font-black uppercase tracking-[0.2em]">{showHeatmap ? "Neural Heatmap Active" : "View Heatmap"}</span>
         </button>
      </div>

      {/* 🏆 Legend Box */}
      <div className="absolute bottom-10 right-10 z-[1000] bg-slate-950/60 backdrop-blur-3xl border border-white/10 p-6 rounded-[2rem] shadow-2xl min-w-[180px]">
         <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-5">Intelligence Key</h4>
         <div className="space-y-4">
            <div className="flex items-center gap-4">
               <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]" />
               <span className="text-[10px] font-bold text-white uppercase tracking-widest">High Urgency</span>
            </div>
            <div className="flex items-center gap-4">
               <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_10px_#f97316]" />
               <span className="text-[10px] font-bold text-white uppercase tracking-widest">Medium Urgency</span>
            </div>
            <div className="flex items-center gap-4">
               <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
               <span className="text-[10px] font-bold text-white uppercase tracking-widest">Low Urgency</span>
            </div>
         </div>
      </div>

      {/* 🎨 Global Marker Style Injector */}
      <style>{`
        @keyframes pulse-marker {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
          100% { transform: scale(1); opacity: 1; }
        }
        .nexus-popup .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .nexus-popup .leaflet-popup-tip {
          background: #0f172a !important;
        }
        .nexus-popup .leaflet-popup-content {
          margin: 0 !important;
          width: auto !important;
        }
        .glassmorphism {
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          background-color: rgba(15, 23, 42, 0.7);
        }
      `}</style>
    </div>
  );
}
