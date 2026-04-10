import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3IwhF1KKEUqEUfmD-6E9sxDcYG9Ucdxo",
  authDomain: "civilezy-game.firebaseapp.com",
  projectId: "civilezy-game",
  storageBucket: "civilezy-game.firebasestorage.app",
  messagingSenderId: "825762820361",
  appId: "1:825762820361:web:ff837632c8d4b73c72e3d8",
  measurementId: "G-15N9KC2HC8",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
