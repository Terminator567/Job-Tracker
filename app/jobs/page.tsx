"use client";

import { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function JobTracker() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [newJob, setNewJob] = useState({ company: "", position: "", status: "Applied", deadline: "" });
  const [sortField, setSortField] = useState("deadline"); // Default sort by deadline
  const [sortDirection, setSortDirection] = useState("asc"); // Default ascending order
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // ✅ Ensure Firestore listener starts ONLY after authentication is confirmed
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        router.push("/auth");
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribeAuth();
  }, [router]);

  useEffect(() => {
    if (!user) return; // ✅ Prevents listener from running before authentication

    const q = query(
      collection(db, "jobs"),
      where("userId", "==", user.uid),
      orderBy(sortField, sortDirection as "asc" | "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setJobs(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [user, sortField, sortDirection]);

  const addJob = async () => {
    if (!newJob.company || !newJob.position || !newJob.deadline) return alert("All fields are required.");
    if (!user) return alert("User not authenticated");

    await addDoc(collection(db, "jobs"), { ...newJob, userId: user.uid });
    setNewJob({ company: "", position: "", status: "Applied", deadline: "" });
  };

  const deleteJob = async (id: string) => {
    await deleteDoc(doc(db, "jobs", id));
  };

  const updateJobStatus = async (id: string, newStatus: string) => {
    await updateDoc(doc(db, "jobs", id), { status: newStatus });
  };

  const updateJobDeadline = async (id: string, newDeadline: string) => {
    await updateDoc(doc(db, "jobs", id), { deadline: newDeadline });
  };

  const toggleSort = (field: string) => {
    setSortField(field);
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      
      {/* 🔹 Header with Profile Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Tracker</h1>
        <Link href="/profile">
          <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
            View Profile
          </button>
        </Link>
      </div>

      {/* 🔹 Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full text-gray-800"
        />
      </div>

      {/* 🔹 Job Entry Form */}
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <input
          type="text"
          placeholder="Company"
          value={newJob.company}
          onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
          className="border p-2 rounded mr-2 text-gray-800"
        />
        <input
          type="text"
          placeholder="Position"
          value={newJob.position}
          onChange={(e) => setNewJob({ ...newJob, position: e.target.value })}
          className="border p-2 rounded mr-2 text-gray-800"
        />
        <input
          type="date"
          value={newJob.deadline}
          onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
          className="border p-2 rounded mr-2 text-gray-800"
        />
        <button onClick={addJob} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Add Job
        </button>
      </div>

      {/* 🔹 Job Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 cursor-pointer" onClick={() => toggleSort("company")}>
              Company {sortField === "company" && (sortDirection === "asc" ? "▲" : "▼")}
            </th>
            <th className="border p-2 cursor-pointer" onClick={() => toggleSort("position")}>
              Position {sortField === "position" && (sortDirection === "asc" ? "▲" : "▼")}
            </th>
            <th className="border p-2">Status</th>
            <th className="border p-2 cursor-pointer" onClick={() => toggleSort("deadline")}>
              Deadline {sortField === "deadline" && (sortDirection === "asc" ? "▲" : "▼")}
            </th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredJobs.map((job) => (
            <tr key={job.id}>
              <td className="border p-2">{job.company}</td>
              <td className="border p-2">{job.position}</td>
              <td className="border p-2">
                <select
                  value={job.status}
                  onChange={(e) => updateJobStatus(job.id, e.target.value)}
                  className="border p-1 rounded text-gray-800"
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </td>
              <td className="border p-2">
                <input
                  type="date"
                  value={job.deadline || ""}
                  onChange={(e) => updateJobDeadline(job.id, e.target.value)}
                  className="border p-1 rounded text-gray-800"
                />
              </td>
              <td className="border p-2">
                <button onClick={() => deleteJob(job.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
