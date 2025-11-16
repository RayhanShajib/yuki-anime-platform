import { useEffect, useRef, useState } from "react";

interface Notification {
  id: number;
  text: string;
  date: string;
  time: string;
  type?: "Anime" | "Community";
  isRead?: boolean;
}

interface NotificationDropdownProps {
  notifications: Notification[];
  onRemove: (id: number) => void;
  onMarkRead?: (id: number) => void;
  onClose: () => void;
}
export function NotificationDropdown({
  notifications,
  onRemove,
  onMarkRead,
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
      className="w-full bg-purple backdrop-blur-md border border-gray-700/50 rounded-md shadow-lg z-50">
      <div className="py-2 px-2 max-h-96 overflow-y-auto">
        <div className="font-semibold text-white/90 px-2 pb-2 flex items-center justify-between text-lg txt-para">
          <span>Notifications</span>
        </div>
        <div className="flex py-1 px-2 gap-2.5">
          <button
            className={`px-2 py-1 rounded text-md font-medium transition-colors w-[150px] txt-small ${
              selectedType === "Anime"
                ? "btn-purple text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => setSelectedType("Anime")}>
            Anime ({notifications.filter(n => (n.type || "Anime") === "Anime").length})
          </button>
          <button
            className={`px-2 py-1 rounded text-md font-medium transition-colors w-[150px] txt-small ${
              selectedType === "Community"
                ? "btn-purple text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => setSelectedType("Community")}>
            Community ({notifications.filter(n => (n.type || "Anime") === "Community").length})
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
              className={`flex items-center justify-between px-2 py-2 rounded transition-colors group ${
                notif.isRead ? 'hover:bg-gray-800' : 'bg-gray-800/50 hover:bg-gray-800 border-l-2 border-pink-500'
              }`}>
              <div className="flex-1">
                <div className={`text-sm txt-small flex items-center gap-2 ${
                  notif.isRead ? 'text-white/90' : 'text-white font-semibold'
                }`}>
                  {!notif.isRead && <span className="inline-block w-2 h-2 bg-pink-500 rounded-full"></span>}
                  {notif.text}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {notif.date} {notif.time}
                </div>
              </div>
              {!notif.isRead ? (
                <button
                  className="ml-2 text-gray-400 hover:text-green-400 transition-colors txt-small flex-shrink-0"
                  title="Mark as read"
                  onClick={() => {
                    if (onMarkRead) {
                      onMarkRead(notif.id);
                      return;
                    }
                    onRemove && onRemove(notif.id);
                  }}>
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </button>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
