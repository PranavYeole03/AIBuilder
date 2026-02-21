// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "genai-386a1.firebaseapp.com",
  projectId: "genai-386a1",
  storageBucket: "genai-386a1.firebasestorage.app",
  messagingSenderId: "643441435373",
  appId: "1:643441435373:web:d6cafd68ce3c612d3ea2e4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider=new GoogleAuthProvider()

export {auth,provider}