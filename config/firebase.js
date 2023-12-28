// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5YRF_ziZ-dEUpGhC2w5QQ0FdNOIjmVMQ",
  authDomain: "ukproject-a7059.firebaseapp.com",
  projectId: "ukproject-a7059",
  storageBucket: "ukproject-a7059.appspot.com",
  messagingSenderId: "938603841935",
  appId: "1:938603841935:web:8badd47478844dde46a3fa",
  measurementId: "G-14BLVGLE59"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);