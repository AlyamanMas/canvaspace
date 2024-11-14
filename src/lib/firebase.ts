// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBM9vcG8V2EcXQKU_2jdyCrVzKiUYTDlDw",
  authDomain: "canvaspace-c77a0.firebaseapp.com",
  projectId: "canvaspace-c77a0",
  storageBucket: "canvaspace-c77a0.firebasestorage.app",
  messagingSenderId: "956720684850",
  appId: "1:956720684850:web:2909f31a699ae75d5d412b",
  measurementId: "G-KHPV2Z2WM6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
