import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { auth } from "./config";
export { auth };
const provider = new GoogleAuthProvider();

export const loginWithGoogle = () => signInWithPopup(auth, provider);

export const registerWithEmail = (email, password) => 
  createUserWithEmailAndPassword(auth, email, password);

export const loginWithEmail = (email, password) => 
  signInWithEmailAndPassword(auth, email, password);

export const logout = () => signOut(auth);