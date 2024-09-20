import { collection, addDoc, onSnapshot, getFirestore, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "./firebase";

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
        reject(new Error(`Failed to listen to checkout session: ${error.message}`));
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
          console.log("Subscription snapshot", snapshot.docs.length);
          if (snapshot.docs.length === 0) {
            console.log("No active or trialing subscriptions found");
            resolve(false);
          } else {
            console.log("Active or trialing subscription found");
            resolve(true);
          }
          unsubscribe();
        },
        reject
      );
    });
  };