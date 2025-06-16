import React from "react";
import { FaEnvelopeOpenText, FaClock, FaCheckCircle, FaUserFriends, FaPlus } from "react-icons/fa";

const Dashboard = () => {
  // Dummy data (replace with API calls later)
  const messageStats = {
    drafts: 3,
    scheduled: 5,
    sent: 12,
  };

  const trusteeStats = {
    total: 4,
    registered: 2,
    pending: 2,
  };

  const reminders = [
    "2 messages have no trustee assigned.",
    "1 trustee has not registered yet.",
    "You have unscheduled messages.",
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Message Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard icon={<FaEnvelopeOpenText />} label="Drafts" value={messageStats.drafts} color="bg-gray-200" />
        <StatCard icon={<FaClock />} label="Scheduled" value={messageStats.scheduled} color="bg-blue-200" />
        <StatCard icon={<FaCheckCircle />} label="Sent" value={messageStats.sent} color="bg-green-200" />
      </div>

      {/* Trustee Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow">
          <h2 className="text-xl font-semibold mb-2">Trustee Overview</h2>
          <p>Total Trustees: {trusteeStats.total}</p>
          <p className="text-green-600">✔️ Registered: {trusteeStats.registered}</p>
          <p className="text-yellow-600">⏳ Pending: {trusteeStats.pending}</p>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Manage Trustees
          </button>
        </div>

        {/* Reminders */}
        <div className="bg-white rounded-2xl p-4 shadow">
          <h2 className="text-xl font-semibold mb-2">Reminders</h2>
          <ul className="list-disc pl-5 space-y-2">
            {reminders.map((reminder, idx) => (
              <li key={idx} className="text-sm text-gray-700">
                {reminder}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-4 shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <ActionButton icon={<FaPlus />} label="Create Message" />
          <ActionButton icon={<FaUserFriends />} label="Add Trustee" />
          <ActionButton icon={<FaClock />} label="Schedule Delivery" />
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ icon, label, value, color }) => (
  <div className={`rounded-2xl p-4 shadow ${color} flex items-center`}>
    <div className="text-3xl mr-4">{icon}</div>
    <div>
      <div className="text-lg font-bold">{value}</div>
      <div className="text-sm">{label}</div>
    </div>
  </div>
);

// Reusable Action Button
const ActionButton = ({ icon, label }) => (
  <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
    {icon}
    {label}
  </button>
);

export default Dashboard;
