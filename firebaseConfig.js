// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDvUrVzJgQrrHMc7SApFesp-GYM4lmFfyc",
  authDomain: "myfirstfb-8d1fe.firebaseapp.com",
  projectId: "myfirstfb-8d1fe",
  storageBucket: "myfirstfb-8d1fe.appspot.com",
  messagingSenderId: "252779675010",
  appId: "1:252779675010:web:7a8e8a226baea49b3c239b",
  measurementId: "G-BT328K57JQ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const database = getFirestore(app);
export const userAuth = getAuth(app);
export const userAuthWithGoogle = new GoogleAuthProvider();
export const storage = getStorage(app);
