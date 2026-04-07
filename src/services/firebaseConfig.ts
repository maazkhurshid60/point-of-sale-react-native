import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuration from Flutter firebase_options.dart
const firebaseConfig = {
  apiKey: "AIzaSyAY8Rs8Gim0iQBI67dUdsLPDbuhmf6-jMc",
  authDomain: "ownerspos.firebaseapp.com",
  projectId: "ownerspos",
  storageBucket: "ownerspos.appspot.com",
  messagingSenderId: "905646809594",
  appId: "1:905646809594:android:3380f743e69ec78c118443",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const firestore = getFirestore(app);
export const storage = getStorage(app);

export default app;

