import {
  collection,
  addDoc,
  onSnapshot,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "./firebase";
import { getFunctions, httpsCallable } from "firebase/functions";

// Add this function at the top of the file
function encrypt(text, key) {
  return btoa(text.split('').map((c, i) => 
    String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
  ).join(''));
}

function decrypt(encoded, key) {
  return atob(encoded).split('').map((c, i) => 
    String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
  ).join('');
}

export const getCheckoutUrl = async (priceId) => {
  const auth = getAuth(app);
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User is not authenticated");

  const db = getFirestore(app);
  const checkoutSessionRef = collection(
    db,
    "customers",
    userId,
    "checkout_sessions"
  );

  let docRef;
  try {
    docRef = await addDoc(checkoutSessionRef, {
      price: priceId,
      success_url: window.location.origin,
      cancel_url: window.location.origin,
    });
  } catch (error) {
    throw new Error(`Failed to create checkout session: ${error.message}`);
  }

  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(
      docRef,
      (snap) => {
        const { error, url } = snap.data() || {};
        if (error) {
          unsubscribe();
          reject(new Error(`An error occurred: ${error.message}`));
        }
        if (url) {
          console.log("Stripe Checkout URL:", url);
          unsubscribe();
          resolve(url);
        }
      },
      (error) => {
        unsubscribe();
        reject(
          new Error(`Failed to listen to checkout session: ${error.message}`)
        );
      }
    );

    // Ensure unsubscribe is called if the promise is not resolved or rejected within a timeout
    setTimeout(() => {
      unsubscribe();
      reject(new Error("Timeout: Failed to get checkout URL"));
    }, 60000); // 60 seconds timeout
  });
};

export const getPremiumStatus = async () => {
  const auth = getAuth(app);
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User not logged in");

  const now = new Date().getTime();
  const encryptionKey = 'theworldisundertome';
  const storageKey = 't0aqk323a'; //? random key
  
  const encryptedData = localStorage.getItem(storageKey);
  let lastCheck = null;
  if (encryptedData) {
    try {
      lastCheck = JSON.parse(decrypt(encryptedData, encryptionKey));
    } catch (error) {
      console.error('Error decrypting data:', error);
    }
  }

  const oneDayInMs = 24 * 60 * 60 * 1000;

  if (lastCheck && (now - lastCheck.time < oneDayInMs)) {
    return lastCheck.isPremium;
  }

  // If more than a day has passed or no data, check Firestore
  const db = getFirestore(app);
  const subscriptionsRef = collection(db, "customers", userId, "subscriptions");
  const q = query(
    subscriptionsRef,
    where("status", "in", ["trialing", "active"])
  );

  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const isPremium = snapshot.docs.length > 0;
        
        // Encrypt and store the result
        const dataToStore = JSON.stringify({ time: now, isPremium });
        const encryptedDataToStore = encrypt(dataToStore, encryptionKey);
        localStorage.setItem(storageKey, encryptedDataToStore);
        
        resolve(isPremium);
        unsubscribe();
      },
      reject
    );
  });
};

export const getPortalUrl = async () => {
  const auth = getAuth(app);
  const user = auth.currentUser;

  let dataWithUrl;
  try {
    const functions = getFunctions(app, "us-central1");
    const functionRef = httpsCallable(
      functions,
      "ext-firestore-stripe-payments-createPortalLink"
    );
    const { data } = await functionRef({
      customerId: user?.uid,
      returnUrl: window.location.origin,
    });

    // Add a type to the data
    dataWithUrl = data;
    console.log("Reroute to Stripe portal: ", dataWithUrl.url);
  } catch (error) {
    console.error(error);
  }

  return new Promise((resolve, reject) => {
    if (dataWithUrl.url) {
      resolve(dataWithUrl.url);
    } else {
      reject(new Error("No url returned"));
    }
  });
};
