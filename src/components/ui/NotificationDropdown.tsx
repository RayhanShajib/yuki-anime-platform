import { useEffect, useRef, useState } from "react";

interface Notification {
  id: number;
  text: string;
  date: string;
  time: string;
  type?: "Anime" | "Community";
}

interface NotificationDropdownProps {
  notifications: Notification[];
  onRemove: (id: number) => void;
  onClose: () => void;
}
export function NotificationDropdown({
  notifications,
  onRemove,
  onClose,
}: NotificationDropdownProps) {
  const [selectedType, setSelectedType] = useState<"Anime" | "Community">(
    "Anime"
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);
  // Filter notifications by selected type
  const filteredNotifications = notifications.filter(
    (notif) => (notif.type || "Anime") === selectedType
  );
  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-4 w-80 bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-md shadow-lg z-50">
      <div className="py-2 px-2 max-h-96 overflow-y-auto">
        <div className="font-semibold text-white/90 px-2 pb-2 flex items-center justify-between text-lg ">
          <span>Notifications</span>
        </div>
        <div className="flex py-1 px-2 gap-2.5">
          <button
            className={`px-2 py-1 rounded text-md font-medium transition-colors w-full ${
              selectedType === "Anime"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => setSelectedType("Anime")}>
            Anime
          </button>
          <button
            className={`px-2 py-1 rounded text-md font-medium transition-colors w-full ${
              selectedType === "Community"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => setSelectedType("Community")}>
            Community
          </button>
        </div>
        {filteredNotifications.length === 0 ? (
          <div className="text-gray-400 text-sm px-2 py-4 text-center">
            No notifications
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className="flex items-center justify-between px-2 py-2 hover:bg-gray-800 rounded transition-colors group">
              <div>
                <div className="text-white/90 text-sm">{notif.text}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {notif.date} {notif.time}
                </div>
              </div>
              <button
                className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove notification"
                onClick={() => onRemove(notif.id)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
