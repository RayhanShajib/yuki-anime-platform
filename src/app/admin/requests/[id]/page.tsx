"use client";

import { useRouter } from "next/navigation";

const mockRequest = {
  id: 1,
  anime: "Chainsaw Man",
  user: "AnimeFan123",
  status: "pending",
  priority: "high",
  date: "2024-07-15",
  comment: "Please add this anime, it's very popular!"
};

export default function AdminViewRequestPage() {
  const router = useRouter();
  function handleBack() {
    router.push("/admin/requests");
  }
  return (
    <div className="max-w-md mx-auto w-full">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{mockRequest.anime}</h2>
        <div className="text-gray-400 text-sm mb-2">Requested by: {mockRequest.user}</div>
        <div className="flex gap-2 mb-2">
          <span className={`capitalize px-2 py-1 rounded font-bold text-xs ${mockRequest.status === "pending" ? "bg-yellow-700 text-yellow-200" : mockRequest.status === "approved" ? "bg-green-700 text-green-200" : "bg-blue-700 text-blue-200"}`}>{mockRequest.status}</span>
          <span className={`capitalize px-2 py-1 rounded font-bold text-xs ${mockRequest.priority === "high" ? "bg-red-700 text-red-200" : mockRequest.priority === "medium" ? "bg-yellow-700 text-yellow-200" : "bg-green-700 text-green-200"}`}>{mockRequest.priority}</span>
        </div>
        <div className="text-gray-400 text-sm mb-2">Date: {mockRequest.date}</div>
        <div className="mb-4">
          <div className="font-semibold text-white mb-1">User Comment</div>
          <div className="text-gray-300 text-sm">{mockRequest.comment}</div>
        </div>
        <div className="flex gap-2 mt-6">
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold text-sm">Approve</button>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold text-sm">Reject</button>
          <button type="button" onClick={handleBack} className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded font-semibold text-sm">Back</button>
        </div>
      </div>
    </div>
  );
} 