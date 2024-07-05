import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6n-USXKOmlIpiO8qH6ZkZrCAqbbxBam4",
  authDomain: "todoapplab1.firebaseapp.com",
  projectId: "todoapplab1",
  storageBucket: "todoapplab1.appspot.com",
  messagingSenderId: "830369429292",
  appId: "1:830369429292:web:9b1f1c5375a48f76d01e89",
  measurementId: "G-DV31DR6HTX"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);