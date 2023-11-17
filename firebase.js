import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCuuxN3UFIKEHBkitSTsGvX1cd98kF6R7E",
  authDomain: "react-notes-2a563.firebaseapp.com",
  projectId: "react-notes-2a563",
  storageBucket: "react-notes-2a563.appspot.com",
  messagingSenderId: "66254241113",
  appId: "1:66254241113:web:36e5ed82f70ae79006a048"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
export const notesCollection = collection(db, "notes")