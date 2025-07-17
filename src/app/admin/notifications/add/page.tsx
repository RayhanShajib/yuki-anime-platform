"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ChangeEvent, FormEvent } from "react";

export default function AdminAddNotificationPage() {
  const [form, setForm] = useState({
    type: "system",
    message: "",
    target: "",
  });
  const router = useRouter();

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    alert("Notification created! (mock)");
  }

  function handleCancel() {
    router.push("/admin/notifications");
  }

  return (
    <div className="max-w-md mx-auto w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Create Notification</h2>
      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-6 text-gray-300 shadow flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-200">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="system">System</option>
            <option value="targeted">Targeted</option>
            <option value="user">User</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-200">Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={3}
            required
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-200">Target (user, group, or all)</label>
          <input
            name="target"
            value={form.target}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex gap-4">
          <button type="submit" className="flex-1 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold text-lg transition-colors">Create</button>
          <button type="button" onClick={handleCancel} className="flex-1 py-2 rounded bg-gray-700 hover:bg-gray-800 text-white font-semibold text-lg transition-colors">Cancel</button>
        </div>
      </form>
    </div>
  );
} 