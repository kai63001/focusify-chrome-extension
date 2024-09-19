import { useState, useEffect } from "react";
import "./App.css";
import Background from "./components/Background";
import Controller from "./components/drag/Controller";
import Login from "./components/Login";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "./libs/firebase";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Background />
      {user ? (
        <Controller />
      ) : (
        <Login onLogin={(user) => setUser(user)} />
      )}
    </>
  );
}

export default App;