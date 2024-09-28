import { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { app } from "../libs/firebase";
import toast, { Toaster } from "react-hot-toast";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const auth = getAuth(app);
  const db = getFirestore(app);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isForgotPassword) {
        await sendPasswordResetEmail(auth, email);
        toast.success("Password reset email sent!");
        setIsForgotPassword(false);
        return;
      }

      let userCredential;
      if (isNewUser) {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        try {
          await setDoc(doc(db, "users", userCredential.user.uid), {
            name,
            email,
          });
          localStorage.setItem("userName", name);
        } catch (docError) {
          toast.error("Error creating user document:", docError);
          console.error("Error creating user document:", docError);
        }
      } else {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );


        // get user name from  getDoc
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        if (userDoc.exists()) {
          localStorage.setItem("userName", userDoc.data().name);
        }
      }
      onLogin(userCredential.user);
    } catch (error) {
      if (error.message.includes("email-already-in-use")) {
        toast.error("Email already in use");
      } else if (error.message.includes("auth/invalid")) {
        toast.error("Invalid email or password");
      } else {
        toast.error(error.message);
      }
      console.error("Error:", error);
    }
  };

  const renderForm = () => {
    if (isForgotPassword) {
      return (
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 mb-4 bg-[#333333] text-white rounded"
            required
          />
          <button
            type="submit"
            className="w-full p-2 bg-[#ed974d] text-white rounded hover:bg-[#d88339]"
          >
            Reset Password
          </button>
        </>
      );
    }

    return (
      <>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 mb-4 bg-[#333333] text-white rounded"
          required
        />
        {isNewUser && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full p-2 mb-4 bg-[#333333] text-white rounded"
            required
          />
        )}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 mb-4 bg-[#333333] text-white rounded"
          required
        />
        <button
          type="submit"
          className="w-full p-2 bg-[#ed974d] text-white rounded hover:bg-[#d88339]"
        >
          {isNewUser ? "Create Account" : "Login"}
        </button>
      </>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#221B15]/90 backdrop-blur-lg p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-white">
          {isForgotPassword ? "Reset Password" : isNewUser ? "Create Account" : "Login"}
        </h2>
        <form onSubmit={handleSubmit}>
          {renderForm()}
        </form>
        {!isForgotPassword && (
          <button
            onClick={() => setIsNewUser(!isNewUser)}
            className="w-full mt-4 p-2 bg-transparent border border-[#ed974d] text-[#ed974d] rounded hover:bg-[#ed974d] hover:text-white"
          >
            {isNewUser
              ? "Already have an account? Login"
              : "New user? Create account"}
          </button>
        )}
        {!isNewUser && !isForgotPassword && (
          <button
            onClick={() => setIsForgotPassword(true)}
            className="w-full mt-4 p-2 bg-transparent text-[#ed974d] hover:underline"
          >
            Forgot Password?
          </button>
        )}
        {isForgotPassword && (
          <button
            onClick={() => setIsForgotPassword(false)}
            className="w-full mt-4 p-2 bg-transparent text-[#ed974d] hover:underline"
          >
            Back to Login
          </button>
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default Login;
