// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "neuraforge-ai-toolkit",
  "appId": "1:640531317465:web:b89b92a7902719900df4c8",
  "storageBucket": "neuraforge-ai-toolkit.firebasestorage.app",
  "apiKey": "AIzaSyD4fMV2AY5aKBF50sMXr6jJVhSL4OxVq-k",
  "authDomain": "neuraforge-ai-toolkit.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "640531317465"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
