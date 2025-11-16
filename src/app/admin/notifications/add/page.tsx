"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ChangeEvent, FormEvent } from "react";
import { adminApi } from "@/lib/api/adminApi";

export default function AdminAddNotificationPage() {
  const [form, setForm] = useState({
    source: "Admin",
    content: "",
    users: "", // comma-separated usernames, e.g. "alex,john,alice"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Build users array from comma-separated input
    const usersArr = form.users
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // Get admin token from localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (!token) {
      setError("You must be logged in as an admin to send notifications.");
      return;
    }

    try {
      setLoading(true);
      await adminApi.pushNotification(form.source, form.content, usersArr, token);
      setSuccess("Notification sent successfully.");
      // navigate back after small delay
      setTimeout(() => router.push("/admin/notifications"), 800);
    } catch (err: unknown) {
      // Try to surface API error details
      let msg = "Failed to send notification.";
      // @ts-ignore
      if (err && typeof err === "object" && (err as any).data) {
        // @ts-ignore
        const d = (err as any).data;
        if (typeof d === "string") msg = d;
        else if (typeof d === "object") {
          const parts: string[] = [];
          for (const k of Object.keys(d)) {
            const val = (d as any)[k];
            if (Array.isArray(val)) parts.push(`${k}: ${val.join(", ")}`);
            else parts.push(`${k}: ${String(val)}`);
          }
          msg = parts.join("; ") || msg;
        }
      }
      setError(msg);
      // eslint-disable-next-line no-console
      console.error("pushNotification failed:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    router.push("/admin/notifications");
  }

  return (
    <div className="max-w-md mx-auto w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Create Notification</h2>
      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-6 text-gray-300 shadow flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-200">Source</label>
          <input
            name="source"
            value={form.source}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-200">Content</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={4}
            required
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-200">Users (comma-separated usernames)</label>
          <input
            name="users"
            value={form.users}
            onChange={handleChange}
            placeholder="alex, john, alice (leave empty to broadcast to all)"
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <p className="text-xs text-gray-500 mt-1">Provide comma-separated usernames to target; leave empty to send to all users (broadcast).</p>
        </div>

        {error && <div className="text-red-400 text-sm">{error}</div>}
        {success && <div className="text-green-400 text-sm">{success}</div>}

        <div className="flex gap-4">
          <button disabled={loading} type="submit" className="flex-1 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold text-lg transition-colors disabled:opacity-60">{loading ? "Sending..." : "Send"}</button>
          <button type="button" onClick={handleCancel} className="flex-1 py-2 rounded bg-gray-700 hover:bg-gray-800 text-white font-semibold text-lg transition-colors">Cancel</button>
        </div>
      </form>
    </div>
  );
}