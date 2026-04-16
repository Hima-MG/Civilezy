import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
   apiKey: "AIzaSyCUlG0PY7rlbJva9R2_eIpY0gG_l9wovFw",
  authDomain: "civilezy-game-e0fcf.firebaseapp.com",
  projectId: "civilezy-game-e0fcf",
  storageBucket: "civilezy-game-e0fcf.firebasestorage.app",
  messagingSenderId: "995432566904",
  appId: "1:995432566904:web:f044e9dd9f82e885eddd8d",
  measurementId: "G-6MHNPGGE9N"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
