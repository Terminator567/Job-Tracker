import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

// Your Firebase Config (Replace with your actual Firebase config)
const firebaseConfig = {
    apiKey: "AIzaSyBwlpkLjAQX04_bxTuWTi96CjE3pZz2wbY",
    authDomain: "job-tracker-b02b0.firebaseapp.com",
    projectId: "job-tracker-b02b0",
    storageBucket: "job-tracker-b02b0.firebasestorage.app",
    messagingSenderId: "422368904462",
    appId: "1:422368904462:web:e6d450ebd1e73276fa035f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut };
