"use client";

import { useState } from "react";
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "../../firebase";
import { useRouter } from "next/navigation";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleAuth = async () => {
    setError("");
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push("/"); // Redirect to main page after login/signup
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{isLogin ? "Login" : "Sign Up"}</h2>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border rounded mb-3 text-gray-800"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border rounded mb-3 text-gray-800"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <button
        onClick={handleAuth}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {isLogin ? "Login" : "Sign Up"}
      </button>

      <p className="text-sm text-gray-700 mt-4">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <span className="text-blue-600 cursor-pointer" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Sign Up" : "Login"}
        </span>
      </p>
    </div>
  );
}
