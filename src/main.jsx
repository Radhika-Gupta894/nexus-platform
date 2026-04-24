import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// 🚀 Kill stale Service Workers / PWA Cache during development
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
      console.log("🧹 Service Worker Unregistered (Force Dev Freshness)");
    }
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);