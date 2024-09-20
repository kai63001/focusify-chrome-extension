import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCjpXAdxEcYae3onUktALZUCELY2LzMyzM",
  authDomain: "focusify-8913c.firebaseapp.com",
  projectId: "focusify-8913c",
  storageBucket: "focusify-8913c.appspot.com",
  messagingSenderId: "645900642895",
  appId: "1:645900642895:web:5aca40acf8ff098df1d83a",
  measurementId: "G-ZX7KCPL3DY",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
