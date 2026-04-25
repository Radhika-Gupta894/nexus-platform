# NEXUS Platform

AI-powered civic intelligence platform for citizens, volunteers, NGOs, and administrators to report issues, analyze urgency, assign help faster, and manage operations in real time.

---

## 🚀 Overview

NEXUS solves the problem of scattered complaint/report systems by combining:

- Public issue reporting
- AI-powered urgency detection
- Real-time dashboards
- Volunteer assignment
- Live map monitoring
- Role-based access control
- Chat between users and volunteers
- Analytics for decision-makers

This platform is designed for:

- Government bodies
- NGOs
- Disaster response teams
- Community organizations
- Smart city operations

---

## ✨ Core Features

### 👤 Role-Based Login

Three user roles:

1. Citizen / User  
2. Intelligence Volunteer  
3. Platform Administrator

Each role sees only their own dashboard and tools.

---

### 📝 Smart Reporting System

Users can submit reports such as:

- Water shortage
- Garbage issue
- Road damage
- Medical emergency
- Power outage
- Flood / disaster alerts

Includes:

- Text reports
- Image upload
- Voice input (optional)
- Location tagging

---

### 🤖 AI Intelligence Engine

Gemini AI powers:

- Report category detection
- Urgency detection (High / Medium / Low)
- Summary generation
- Crisis clustering
- Smart assistance chat

---

### 🗺️ Live Map System

Visualize issues by urgency:

- 🔴 High Priority
- 🟡 Medium Priority
- 🟢 Low Priority

Includes:

- Marker clustering
- Heatmap (optional)
- Public / private visibility

---

### 🧑‍🤝‍🧑 Volunteer Operations

Volunteers can:

- View assigned tasks
- Accept tasks
- Upload proof of completion
- Chat with users
- Share availability

---

### 🛡️ Admin Control Center

Admins can:

- Manage all reports
- Assign volunteers
- Change privacy settings
- Monitor analytics
- Manage users
- System configuration

---

### 💬 Real-Time Chat

Direct communication between:

- User ↔ Assigned Volunteer
- Volunteer ↔ Admin (optional)

Powered by Firestore real-time updates.

---

## 🏗️ Tech Stack

### Frontend

- React JS
- React Router
- CSS / Tailwind (optional)

### Backend

- Firebase Authentication
- Firestore Database
- Firebase Storage

### AI

- Google Gemini API

### Maps

- Google Maps API / Leaflet

---

## 📁 Project Structure

```bash
src/
 ┣ components/
 ┣ pages/
 ┣ ai/
 ┃ ┗ gemini.js
 ┣ firebase/
 ┃ ┣ config.js
 ┃ ┣ auth.js
 ┃ ┗ services.js
 ┣ routes/
 ┣ styles/
 ┗ App.jsx
