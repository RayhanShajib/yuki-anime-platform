"use client";

const mockNotifications = [
  { id: 1, type: "system", message: "Scheduled maintenance at 2AM UTC", target: "All Users", date: "2024-07-16", status: "sent" },
  { id: 2, type: "targeted", message: "New romance anime released!", target: "Romance Fans", date: "2024-07-15", status: "scheduled" },
  { id: 3, type: "user", message: "Your request for 'Chainsaw Man' is approved", target: "AnimeFan123", date: "2024-07-14", status: "sent" },
];

import Link from "next/link";

export default function AdminNotificationsPage() {
  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Notification Management</h2>
        <div className="flex gap-2">
          <select className="px-2 py-1 rounded bg-gray-800 text-white border border-gray-700 text-sm">
            <option>Type: All</option>
            <option>System</option>
            <option>Targeted</option>
            <option>User</option>
          </select>
          <Link href="/admin/notifications/add" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold text-sm">Create Notification</Link>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 rounded-xl overflow-hidden text-left text-sm md:text-base">
          <thead className="bg-gray-800 text-gray-200">
            <tr>
              <th className="p-3">Type</th>
              <th className="p-3">Message</th>
              <th className="p-3">Target</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockNotifications.map((n) => (
              <tr key={n.id} className="border-b border-gray-800 hover:bg-gray-800/60 transition-colors">
                <td className="p-3 capitalize">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${n.type === "system" ? "bg-blue-700 text-blue-200" : n.type === "targeted" ? "bg-green-700 text-green-200" : "bg-purple-700 text-purple-200"}`}>{n.type}</span>
                </td>
                <td className="p-3 max-w-[200px] truncate">{n.message}</td>
                <td className="p-3">{n.target}</td>
                <td className="p-3">{n.date}</td>
                <td className="p-3 capitalize">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${n.status === "sent" ? "bg-green-700 text-green-200" : "bg-yellow-700 text-yellow-200"}`}>{n.status}</span>
                </td>
                <td className="p-3 flex gap-2 flex-wrap">
                  <Link href={`/admin/notifications/${n.id}`} className="px-2 py-1 bg-gray-700 hover:bg-gray-800 text-white rounded text-xs">View</Link>
                  <button className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Mobile card layout */}
        <div className="md:hidden flex flex-col gap-4 mt-4">
          {mockNotifications.map((n) => (
            <div key={n.id} className="bg-gray-900 rounded-xl p-4 flex flex-col gap-2 shadow">
              <div className="flex gap-2 text-xs mb-1">
                <span className={`capitalize px-2 py-1 rounded font-bold ${n.type === "system" ? "bg-blue-700 text-blue-200" : n.type === "targeted" ? "bg-green-700 text-green-200" : "bg-purple-700 text-purple-200"}`}>{n.type}</span>
                <span className={`capitalize px-2 py-1 rounded font-bold ${n.status === "sent" ? "bg-green-700 text-green-200" : "bg-yellow-700 text-yellow-200"}`}>{n.status}</span>
              </div>
              <div className="text-gray-400 text-xs mb-1">{n.message}</div>
              <div className="text-gray-400 text-xs mb-1">Target: {n.target}</div>
              <div className="text-gray-400 text-xs mb-1">{n.date}</div>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Link href={`/admin/notifications/${n.id}`} className="px-2 py-1 bg-gray-700 hover:bg-gray-800 text-white rounded text-xs">View</Link>
                <button className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 