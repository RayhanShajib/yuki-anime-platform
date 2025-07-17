"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const mockGenre = { name: "Action" };

export default function AdminEditGenrePage() {
  const [name, setName] = useState(mockGenre.name);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Genre updated! (mock)");
  }

  function handleCancel() {
    router.push("/admin/genres");
  }

  return (
    <div className="max-w-md mx-auto w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Edit Genre</h2>
      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-6 text-gray-300 shadow flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-200">Genre Name</label>
          <input
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex gap-4">
          <button type="submit" className="flex-1 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold text-lg transition-colors">Save</button>
          <button type="button" onClick={handleCancel} className="flex-1 py-2 rounded bg-gray-700 hover:bg-gray-800 text-white font-semibold text-lg transition-colors">Cancel</button>
        </div>
      </form>
    </div>
  );
} 