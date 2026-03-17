"use client";

import { pageApi } from "@/lib/api/pageApi";
import { safeLocalStorage } from "@/lib/safeLocalStorage";
import { useEffect, useRef, useState } from "react";
import { Bookmark, CheckCircle, Clock, Play, X } from "lucide-react";
import { createPortal } from "react-dom";

interface StatusChangeDropdownProps {
  animeId: number;
  watchStatusId: number;
  animeTitle: string;
  currentStatus: string;
  onStatusChanged?: () => void;
}

type WatchStatus = 'watching' | 'completed' | 'drop' | 'on_hold' | 'plan_to_watch';

interface StatusOption {
  value: WatchStatus;
  label: string;
  icon: React.ReactNode;
}

const statusOptions: StatusOption[] = [
  {
    value: 'watching',
    label: 'Currently Watching',
    icon: <Play className="h-4 w-4" />,
  },
  {
    value: 'completed',
    label: 'Completed',
    icon: <CheckCircle className="h-4 w-4" />,
  },
  {
    value: 'plan_to_watch',
    label: 'Plan to Watch',
    icon: <Bookmark className="h-4 w-4" />,
  },
  {
    value: 'on_hold',
    label: 'On Hold',
    icon: <Clock className="h-4 w-4" />,
  },
  {
    value: 'drop',
    label: 'Dropped',
    icon: <X className="h-4 w-4" />,
  },
];

export function StatusChangeDropdown({
  animeId,
  watchStatusId,
  currentStatus,
  onStatusChanged,
}: StatusChangeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Mount state for portal
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update button position when dropdown opens
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.right - 240 + window.scrollX,
      });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleStatusSelect = async (newStatus: WatchStatus) => {
    const token = safeLocalStorage.getItem('access_token');

    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      setIsLoading(true);
      setIsOpen(false); // Close dropdown immediately

      // Use the watch status ID for the update endpoint and pass animeId in body
      await pageApi.updateWatchlist(token, watchStatusId, newStatus, animeId);

      if (onStatusChanged) {
        onStatusChanged();
      }
    } catch (error) {
      console.error('Error updating watchlist status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render dropdown as portal outside of overflow containers
  const dropdownPortal = isMounted && isOpen ? createPortal(
    <div
      ref={dropdownRef}
      className="absolute w-56 bg-gray-900/95 backdrop-blur-md rounded-lg shadow-2xl border border-gray-700/50 z-40 overflow-hidden animate-in fade-in-0 zoom-in-95"
      style={{
        top: `${buttonPosition.top}px`,
        left: `${buttonPosition.left}px`,
      }}
    >
      {statusOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => handleStatusSelect(option.value)}
          disabled={isLoading || option.value === currentStatus}
          className={`w-full px-4 py-3 flex items-center space-x-3 text-left transition-colors ${
            option.value === currentStatus
              ? 'bg-[#7760A9]/30 text-white/50 cursor-not-allowed'
              : 'text-white/90 hover:bg-[#7760A9] disabled:opacity-50 disabled:cursor-not-allowed border-b border-gray-700/30 last:border-b-0'
          }`}
        >
          <div className="text-pink flex-shrink-0">
            {option.icon}
          </div>
          <span className="text-sm font-medium">{option.label}</span>
          {option.value === currentStatus && (
            <div className="ml-auto">
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          )}
          {isLoading && (
            <div className="ml-auto animate-spin">
              <svg className="h-4 w-4 text-pink" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>,
    document.body
  ) : null;

  return (
    <>
      {/* Status Change Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="text-[#7760a9] hover:text-[#8b7ac9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Change status"
      >
        <CheckCircle className="h-5 w-5" />
      </button>

      {/* Dropdown rendered as portal */}
      {dropdownPortal}
    </>
  );
}
