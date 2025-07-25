"use client";
import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/sections/FooterSection";
import { useState } from "react";

const initialNotifications = [
  {
    id: 1,
    text: "Your profile was updated successfully.",
    date: "2025-07-25",
    time: "10:30 AM",
  },
  {
    id: 2,
    text: "New anime episode released!",
    date: "2025-07-24",
    time: "08:15 PM",
  },
  {
    id: 3,
    text: "Password changed.",
    date: "2025-07-23",
    time: "02:45 PM",
  },
];

const NotificationPage = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleRemove = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="pt-16 bg-black">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Notifications</h1>
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-2 sm:p-4 border border-gray-700 hover:bg-gray-800/70 transition-colors cursor-pointer">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">
                  {notification.date} &bull; {notification.time}
                </span>
                <button
                  type="button"
                  aria-label="Remove notification"
                  className="ml-2 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                  onClick={() => handleRemove(notification.id)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7m3 4v6m4-6v6"
                    />
                  </svg>
                </button>
              </div>
              <div className="text-md sm:text-md font-semibold text-white">
                {notification.text}
              </div>
            </li>
          ))}
        </ul>
      </main>
      <FooterSection />
    </div>
  );
};

export default NotificationPage;
