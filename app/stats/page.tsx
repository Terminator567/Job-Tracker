"use client";

import { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement,
  Title, Tooltip, Legend,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

export default function JobStats() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [filterCompany, setFilterCompany] = useState("");

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(collection(db, "jobs"), where("userId", "==", auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const jobList = snapshot.docs.map((doc) => doc.data());
      setJobs(jobList);
      setFilteredJobs(jobList);
    });

    return () => unsubscribe();
  }, []);

  // Count jobs by status
  const jobStatusCounts = {
    Applied: filteredJobs.filter((job) => job.status === "Applied").length,
    Interview: filteredJobs.filter((job) => job.status === "Interview").length,
    Offer: filteredJobs.filter((job) => job.status === "Offer").length,
    Rejected: filteredJobs.filter((job) => job.status === "Rejected").length,
  };

  // Jobs grouped by month
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const jobsByMonth = new Array(12).fill(0);
  filteredJobs.forEach((job) => {
    const jobMonth = new Date(job.deadline).getMonth();
    jobsByMonth[jobMonth] += 1;
  });

  // Chart Data
  const barChartData = {
    labels: ["Applied", "Interview", "Offer", "Rejected"],
    datasets: [
      {
        label: "Job Applications by Status",
        data: Object.values(jobStatusCounts),
        backgroundColor: ["#3b82f6", "#facc15", "#22c55e", "#ef4444"],
      },
    ],
  };

  const pieChartData = {
    labels: ["Applied", "Interview", "Offer", "Rejected"],
    datasets: [
      {
        data: Object.values(jobStatusCounts),
        backgroundColor: ["#3b82f6", "#facc15", "#22c55e", "#ef4444"],
      },
    ],
  };

  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: "Applications Per Month",
        data: jobsByMonth,
        fill: false,
        borderColor: "#3b82f6",
        tension: 0.1,
      },
    ],
  };

  // Filtering function
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const company = e.target.value;
    setFilterCompany(company);
    setFilteredJobs(jobs.filter((job) => job.company.toLowerCase().includes(company.toLowerCase())));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Job Statistics</h1>

      {/* 🔍 Filter By Company */}
      <input
        type="text"
        placeholder="Filter by Company"
        value={filterCompany}
        onChange={handleFilterChange}
        className="border p-2 rounded w-full mb-4 text-gray-800"
      />

      {/* 📊 Bar Chart (Job Status Counts) */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6 shadow">
        <h2 className="text-xl font-bold mb-2">Job Applications by Status</h2>
        <Bar data={barChartData} />
      </div>

      {/* 🥧 Pie Chart (Job Status Percentage) */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6 shadow">
        <h2 className="text-xl font-bold mb-2">Job Status Breakdown</h2>
        <Pie data={pieChartData} />
      </div>

      {/* 📅 Line Chart (Applications Over Time) */}
      <div className="bg-gray-100 p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-2">Applications Over Time</h2>
        <Line data={lineChartData} />
      </div>
    </div>
  );
}
