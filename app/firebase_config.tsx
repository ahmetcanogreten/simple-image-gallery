import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCSRjiqi9_AFs3cmOIc1tEGhUM9RS5q_qY",
    authDomain: "simple-image-gallery-6c593.firebaseapp.com",
    projectId: "simple-image-gallery-6c593",
    storageBucket: "simple-image-gallery-6c593.appspot.com",
    messagingSenderId: "56943954290",
    appId: "1:56943954290:web:6c05e10ebbcdc13c5ef5eb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
