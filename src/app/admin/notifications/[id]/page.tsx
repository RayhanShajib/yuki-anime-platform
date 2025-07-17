"use client";

import { useRouter } from "next/navigation";

const mockNotification = {
  id: 1,
  type: "system",
  message: "Scheduled maintenance at 2AM UTC",
  target: "All Users",
  date: "2024-07-16",
  status: "sent"
};

export default function AdminViewNotificationPage() {
  const router = useRouter();
  function handleBack() {
    router.push("/admin/notifications");
  }
  return (
    <div className="max-w-md mx-auto w-full">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Notification</h2>
        <div className="flex gap-2 mb-2">
          <span className={`capitalize px-2 py-1 rounded font-bold text-xs ${mockNotification.type === "system" ? "bg-blue-700 text-blue-200" : mockNotification.type === "targeted" ? "bg-green-700 text-green-200" : "bg-purple-700 text-purple-200"}`}>{mockNotification.type}</span>
          <span className={`capitalize px-2 py-1 rounded font-bold text-xs ${mockNotification.status === "sent" ? "bg-green-700 text-green-200" : "bg-yellow-700 text-yellow-200"}`}>{mockNotification.status}</span>
        </div>
        <div className="text-gray-400 text-sm mb-2">Target: {mockNotification.target}</div>
        <div className="text-gray-400 text-sm mb-2">Date: {mockNotification.date}</div>
        <div className="mb-4">
          <div className="font-semibold text-white mb-1">Message</div>
          <div className="text-gray-300 text-sm">{mockNotification.message}</div>
        </div>
        <div className="flex gap-2 mt-6">
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold text-sm">Delete</button>
          <button type="button" onClick={handleBack} className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded font-semibold text-sm">Back</button>
        </div>
      </div>
    </div>
  );
} 