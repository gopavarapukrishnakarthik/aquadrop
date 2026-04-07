// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfZNd64fMRzpwEGuxNTFnEWfb0-hpkagM",
  authDomain: "bluecan-delivery.firebaseapp.com",
  projectId: "bluecan-delivery",
  storageBucket: "bluecan-delivery.firebasestorage.app",
  messagingSenderId: "1031525785919",
  appId: "1:1031525785919:web:a4d8dcd7b75a1a76dfb38a",
  measurementId: "G-646NCKYJVR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore database
export const db = getFirestore(app);

// Authentication
export const auth = getAuth(app);

export default app;