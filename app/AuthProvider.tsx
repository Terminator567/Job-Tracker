"use client"; // ✅ Required for client components

import { auth, signOut } from "../firebase";
import { useState, useEffect, createContext, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // ✅ Import Link for Navigation

export const AuthContext = createContext<any>(null);

export default function AuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/auth"); // Redirect to login page
  };

  return (
    <AuthContext.Provider value={{ user, handleLogout }}>
      <nav className="p-4 bg-gray-800 text-white flex justify-between items-center">
        <h1 className="text-xl font-bold">Job Tracker</h1>
        <div className="flex gap-4">
          <Link href="/jobs" className="hover:underline">Jobs</Link>
          <Link href="/stats" className="hover:underline">Stats</Link>
          {user ? (
            <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
              Logout
            </button>
          ) : (
            <Link href="/auth" className="bg-blue-500 px-4 py-2 rounded">
              Login
            </Link>
          )}
        </div>
      </nav>
      <main className="p-6">{children}</main>
    </AuthContext.Provider>
  );
}
