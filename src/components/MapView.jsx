import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 📍 Define Icons
const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const yellowIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const FALLBACK_LAT = 23.2599;
const FALLBACK_LNG = 77.4126;

const MapView = ({ user }) => {
  const [reports, setReports] = useState([]);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "reports"), (snapshot) => {
      const data = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter((report) => {
          // Rule: Public reports visible on map. Private reports hidden from public users. Admins can still see all.
          if (isAdmin) return true;
          return report.privacy !== "Private";
        });
      setReports(data);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const getIcon = (report) => {
    if (report.status?.toLowerCase() === "resolved") return greenIcon;
    if (report.urgency?.toLowerCase() === "high") return redIcon;
    return yellowIcon;
  };

  return (
    <div style={{ marginTop: "25px", borderRadius: "18px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
      <MapContainer
        center={[FALLBACK_LAT, FALLBACK_LNG]}
        zoom={6}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[
              report.lat || FALLBACK_LAT,
              report.lng || FALLBACK_LNG
            ]}
            icon={getIcon(report)}
          >
            <Popup>
              <div style={{ color: "#333", minWidth: "150px" }}>
                <h3 style={{ margin: "0 0 5px 0", color: "#1e3c72" }}>{report.type || "General Issue"}</h3>
                <p style={{ margin: "5px 0" }}><b>Location:</b> {report.location || "Unknown"}</p>
                <p style={{ margin: "5px 0" }}><b>Status:</b> <span style={{ color: report.status === 'Resolved' ? 'green' : '#f39c12', fontWeight: 'bold' }}>{report.status || "Pending"}</span></p>
                <p style={{ margin: "5px 0" }}><b>Urgency:</b> <span style={{ color: report.urgency?.toLowerCase() === 'high' ? 'red' : '#333' }}>{report.urgency || "Low"}</span></p>
                {report.assignedTo && <p style={{ margin: "5px 0", fontSize: "12px", color: "#666" }}>Assigned to: {report.assignedTo}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;