"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState("Yuki Anime Platform");
  const [theme, setTheme] = useState("dark");

  return (
    <div className="max-w-xl mx-auto w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Settings</h2>
      <form className="bg-gray-900 rounded-xl p-6 text-gray-300 shadow flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-200">Site Name</label>
          <input
            type="text"
            value={siteName}
            onChange={e => setSiteName(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-200">Theme</label>
          <select
            value={theme}
            onChange={e => setTheme(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
        <button
          type="button"
          className="w-full py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold text-lg transition-colors"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
} 