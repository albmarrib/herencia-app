import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDt7u7WDkRuzdJo1BTFVSmE_JqH-okiZsg",
  authDomain: "legado-app-4c8ad.firebaseapp.com",
  projectId: "legado-app-4c8ad",
  storageBucket: "legado-app-4c8ad.firebasestorage.app",
  messagingSenderId: "295064250475",
  appId: "1:295064250475:web:36c669deb785130bda692e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
