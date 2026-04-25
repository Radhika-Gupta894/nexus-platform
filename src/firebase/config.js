import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔐 Firebase Config (from .env)
const firebaseConfig = {
  apiKey: "AIzaSyC2OMCx9eWdZtQLNU5xTKwpy-CMdUvnIcw",
  authDomain: "nexus-editorial-intelligence.firebaseapp.com",
  projectId: "nexus-editorial-intelligence",
  storageBucket: "nexus-editorial-intelligence.firebasestorage.app",
  messagingSenderId: "249061943142",
  appId: "1:249061943142:web:2afd83e05e464390358aa7"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);