// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "authentication-mern-7c2bf.firebaseapp.com",
  projectId: "authentication-mern-7c2bf",
  storageBucket: "authentication-mern-7c2bf.firebasestorage.app",
  messagingSenderId: "350853264854",
  appId: "1:350853264854:web:deaa8750627a8582fce077"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);