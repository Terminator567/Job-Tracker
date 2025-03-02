"use client";

import { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { doc, setDoc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [profileData, setProfileData] = useState({ name: "", bio: "", linkedin: "" });
  const [totalApplications, setTotalApplications] = useState(0);
  const [successRate, setSuccessRate] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        router.push("/auth");
      } else {
        setUser(currentUser);

        // Fetch User Profile Data
        const profileRef = doc(db, "users", currentUser.uid);
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          setProfileData(profileSnap.data());
        }

        // Fetch Job Data
        const q = query(collection(db, "jobs"), where("userId", "==", currentUser.uid));
        onSnapshot(q, (snapshot) => {
          const jobs = snapshot.docs.map((doc) => doc.data());
          setTotalApplications(jobs.length);
          const offers = jobs.filter((job) => job.status === "Offer").length;
          setSuccessRate(jobs.length > 0 ? Math.round((offers / jobs.length) * 100) : 0);
        });
      }
    });

    return () => unsubscribeAuth();
  }, [router]);

  const saveProfile = async () => {
    if (!user) return;
    await setDoc(doc(db, "users", user.uid), profileData);
    alert("Profile updated!");
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg text-gray-900 dark:text-gray-100">
      
      {/* 🔹 Navigation Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <Link href="/jobs">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Back to Jobs
          </button>
        </Link>
      </div>

      {/* 🔹 User Info Card */}
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-2">{user?.email || "Loading..."}</h2>
        <p className="text-gray-600 dark:text-gray-300">Total Applications: <strong>{totalApplications}</strong></p>
        <p className="text-gray-600 dark:text-gray-300">Success Rate: <strong>{successRate}%</strong></p>

        {/* 🔹 Success Rate Progress Bar */}
        <div className="w-full bg-gray-300 dark:bg-gray-700 rounded h-4 mt-4">
          <div
            className="h-4 rounded bg-green-500 transition-all"
            style={{ width: `${successRate}%` }}
          ></div>
        </div>
      </div>

      {/* 🔹 Editable Profile Fields */}
      <div className="mt-6 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-3">Edit Profile</h2>
        <input
          type="text"
          placeholder="Full Name"
          value={profileData.name}
          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
          className="border p-2 rounded w-full mb-3 text-gray-800"
        />
        <textarea
          placeholder="Bio"
          value={profileData.bio}
          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
          className="border p-2 rounded w-full mb-3 text-gray-800"
        />
        <input
          type="text"
          placeholder="LinkedIn Profile URL"
          value={profileData.linkedin}
          onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
          className="border p-2 rounded w-full mb-3 text-gray-800"
        />
        <button
          onClick={saveProfile}
          className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Save Profile
        </button>
      </div>

      {/* 🔹 Logout Button */}
      <button
        onClick={() => {
          auth.signOut();
          router.push("/auth");
        }}
        className="mt-6 w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
}
