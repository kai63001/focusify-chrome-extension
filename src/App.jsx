import { useState, useEffect, lazy, Suspense } from "react";
import "./App.css";
import Background from "./components/Background";
import Login from "./components/Login";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "./libs/firebase";

const Controller = lazy(() => import("./components/drag/Controller"));

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
        <Suspense>
          <Controller />
        </Suspense>
      ) : (
        <Login onLogin={(user) => setUser(user)} />
      )}
    </>
  );
}

export default App;