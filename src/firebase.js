// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC0co2hBRgGRhyveQRcpoUiSOIFft9MqsA",
  authDomain: "financial-planner-app-7b255.firebaseapp.com",
  projectId: "financial-planner-app-7b255",
  storageBucket: "financial-planner-app-7b255.firebasestorage.app",
  messagingSenderId: "889385402973",
  appId: "1:889385402973:web:ed7724c0bbc1f2c16103b4",
  measurementId: "G-EC4HR5Q2PD"
};

// 🚀 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Firebase Auth & Firestore Export
export const auth = getAuth(app);
export const db = getFirestore(app);
