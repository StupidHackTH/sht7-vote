import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAATPVLpBmHIveRanQVlvwxs9MKjvPtH5w",
  authDomain: "sht7-vote.firebaseapp.com",
  projectId: "sht7-vote",
  storageBucket: "sht7-vote.appspot.com",
  messagingSenderId: "1013031378641",
  appId: "1:1013031378641:web:d8284d3264980d28fceff0",
  measurementId: "G-GN50TX0WZL",
};

export const app = initializeApp(firebaseConfig);
