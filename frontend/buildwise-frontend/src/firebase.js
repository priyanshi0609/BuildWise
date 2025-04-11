// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // ✅ import GoogleAuthProvider
import { getFirestore } from "firebase/firestore"; // ✅ import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGwaGGByMoECmGyYHp5DyGOjBrAO7edQI",
  authDomain: "buildwise-4e031.firebaseapp.com",
  projectId: "buildwise-4e031",
  storageBucket: "buildwise-4e031.firebasestorage.app",
  messagingSenderId: "181869931039",
  appId: "1:181869931039:web:22bb3a674c6657ca68432a",
  measurementId: "G-RDN70EQCB0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ Setup Auth and Google Provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider(); // ✅ create provider
// Initialize Firestore
const db = getFirestore(app);

// ✅ Export them
export { auth, provider ,db};
