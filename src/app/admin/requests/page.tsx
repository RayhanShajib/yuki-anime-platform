"use client";

const mockRequests = [
  { id: 1, anime: "Chainsaw Man", user: "AnimeFan123", status: "pending", priority: "high", date: "2024-07-15" },
  { id: 2, anime: "Blue Lock", user: "OtakuQueen", status: "under_review", priority: "medium", date: "2024-07-14" },
  { id: 3, anime: "Solo Leveling", user: "MangaMaster", status: "approved", priority: "low", date: "2024-07-13" },
];

import Link from "next/link";

export default function AdminRequestsPage() {
  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Request Management</h2>
        <div className="flex gap-2">
          <select className="px-2 py-1 rounded bg-gray-800 text-white border border-gray-700 text-sm">
            <option>Status: All</option>
            <option>Pending</option>
            <option>Under Review</option>
            <option>Approved</option>
            <option>Completed</option>
            <option>Rejected</option>
          </select>
          <select className="px-2 py-1 rounded bg-gray-800 text-white border border-gray-700 text-sm">
            <option>Priority: All</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <button className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-semibold">Bulk Approve</button>
        <button className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold">Bulk Reject</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 rounded-xl overflow-hidden text-left text-sm md:text-base">
          <thead className="bg-gray-800 text-gray-200">
            <tr>
              <th className="p-3">Anime</th>
              <th className="p-3">User</th>
              <th className="p-3">Status</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockRequests.map((req) => (
              <tr key={req.id} className="border-b border-gray-800 hover:bg-gray-800/60 transition-colors">
                <td className="p-3 font-semibold text-white">{req.anime}</td>
                <td className="p-3">{req.user}</td>
                <td className="p-3 capitalize">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${req.status === "pending" ? "bg-yellow-700 text-yellow-200" : req.status === "approved" ? "bg-green-700 text-green-200" : "bg-blue-700 text-blue-200"}`}>{req.status.replace('_', ' ')}</span>
                </td>
                <td className="p-3 capitalize">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${req.priority === "high" ? "bg-red-700 text-red-200" : req.priority === "medium" ? "bg-yellow-700 text-yellow-200" : "bg-green-700 text-green-200"}`}>{req.priority}</span>
                </td>
                <td className="p-3">{req.date}</td>
                <td className="p-3 flex gap-2 flex-wrap">
                  <Link href={`/admin/requests/${req.id}`} className="px-2 py-1 bg-gray-700 hover:bg-gray-800 text-white rounded text-xs">View</Link>
                  <button className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs">Approve</button>
                  <button className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Mobile card layout */}
        <div className="md:hidden flex flex-col gap-4 mt-4">
          {mockRequests.map((req) => (
            <div key={req.id} className="bg-gray-900 rounded-xl p-4 flex flex-col gap-2 shadow">
              <div className="font-bold text-white text-lg">{req.anime}</div>
              <div className="text-gray-400 text-xs mb-1">User: {req.user}</div>
              <div className="flex gap-2 text-xs mb-1">
                <span className={`capitalize px-2 py-1 rounded font-bold ${req.status === "pending" ? "bg-yellow-700 text-yellow-200" : req.status === "approved" ? "bg-green-700 text-green-200" : "bg-blue-700 text-blue-200"}`}>{req.status.replace('_', ' ')}</span>
                <span className={`capitalize px-2 py-1 rounded font-bold ${req.priority === "high" ? "bg-red-700 text-red-200" : req.priority === "medium" ? "bg-yellow-700 text-yellow-200" : "bg-green-700 text-green-200"}`}>{req.priority}</span>
              </div>
              <div className="text-gray-400 text-xs mb-1">{req.date}</div>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Link href={`/admin/requests/${req.id}`} className="px-2 py-1 bg-gray-700 hover:bg-gray-800 text-white rounded text-xs">View</Link>
                <button className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs">Approve</button>
                <button className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs">Reject</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 