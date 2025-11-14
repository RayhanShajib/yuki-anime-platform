"use client";

import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/sections/FooterSection";
import { pageApi } from "@/lib/api/pageApi";
import {
  ArrowLeft,
  Lock,
  Mail,
  Save,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// Default user data structure (based on API response)
const defaultUserData = {
  username: "",
  email: "",
  avatar: "/placeholder-avatar.jpg",
  preferences: {
    preferred_title_lang: "en",
    preferred_video_lang: "sub",
    skip_seconds: 10,
    bookmarks_per_page: 25,
    hide_bookmarks: false,
    hide_profile_activities: false,
  },
};

export default function ProfileEditPage() {
  const [userData, setUserData] = useState(defaultUserData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  // Load profile data on component mount
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("access_token");
        
        if (!token) {
          setError("Please log in to edit your profile");
          setIsLoading(false);
          return;
        }

        const profileData = await pageApi.getProfilePageData(token);
        
        // Map API response to form state
        setUserData((prev) => ({
          ...prev,
          username: profileData.username || "",
          email: profileData.email || "",
          avatar: profileData.avatar || "/placeholder-avatar.jpg",
          preferences: {
            ...prev.preferences,
            preferred_title_lang: profileData.preferred_title_lang || "en",
            preferred_video_lang: profileData.preferred_video_lang || "sub",
            skip_seconds: profileData.skip_seconds || 10,
            bookmarks_per_page: profileData.bookmarks_per_page || 25,
            hide_bookmarks: profileData.hide_bookmarks || false,
            hide_profile_activities: profileData.hide_profile_activities || false,
          },
        }));

        console.log("Profile data loaded:", profileData);
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, []);

  const handleInputChange = (
    field: string,
    value: string | boolean | number,
    category?: string
  ) => {
    if (category) {
      setUserData((prev) => ({
        ...prev,
        [category]: {
          ...(prev[category as keyof typeof prev] as Record<
            string,
            string | boolean | number
          >),
          [field]: value,
        },
      }));
    } else {
      setUserData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSave = async () => {
  setIsSaving(true);
  setError(null);
  setValidationErrors(null);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Please log in to update your profile");
        setIsSaving(false);
        return;
      }

      // Build settings payload from form state
      const settingsPayload = {
        username: userData.username,
        email: userData.email,
        preferred_title_lang: userData.preferences.preferred_title_lang,
        preferred_video_lang: userData.preferences.preferred_video_lang,
        skip_seconds: userData.preferences.skip_seconds,
        bookmarks_per_page: userData.preferences.bookmarks_per_page,
        hide_bookmarks: userData.preferences.hide_bookmarks,
        hide_profile_activities:
          userData.preferences.hide_profile_activities,
      } as Record<string, unknown>;

      const updated = await pageApi.updateProfileSettings(
        token,
        settingsPayload
      );

      // Update local form state from server response where available
      if (updated) {
        setUserData((prev) => ({
          ...prev,
          username: (updated.username as string) || prev.username,
          email: (updated.email as string) || prev.email,
          avatar: (updated.avatar as string) || prev.avatar,
          preferences: {
            ...prev.preferences,
            preferred_title_lang:
              (updated.preferred_title_lang as string) ||
              prev.preferences.preferred_title_lang,
            preferred_video_lang:
              (updated.preferred_video_lang as string) ||
              prev.preferences.preferred_video_lang,
            skip_seconds:
              (updated.skip_seconds as number) || prev.preferences.skip_seconds,
            bookmarks_per_page:
              (updated.bookmarks_per_page as number) ||
              prev.preferences.bookmarks_per_page,
            hide_bookmarks:
              typeof updated.hide_bookmarks === "boolean"
                ? updated.hide_bookmarks
                : prev.preferences.hide_bookmarks,
            hide_profile_activities:
              typeof updated.hide_profile_activities === "boolean"
                ? updated.hide_profile_activities
                : prev.preferences.hide_profile_activities,
          },
        }));
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      // If API returned validation errors in err.data, surface them inline
      if (
        err &&
        typeof err === "object" &&
        (err as any).data &&
        typeof (err as any).data === "object"
      ) {
        setValidationErrors((err as any).data as Record<string, string[]>);
      } else {
        // Unexpected error - log for debugging and show generic message
        // eslint-disable-next-line no-console
        console.error("Failed to save profile settings:", err);
        setError("Failed to save profile settings. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };
  const handlePasswordInputChange = (field: string, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setPasswordError("");
  };


  const handlePasswordSave = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New password and confirm password do not match");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long");
      return;
    }
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setIsPasswordModalOpen(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };
  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6 flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-red-400">{error}</span>
            </div>
          )}

          {!isLoading && (
            <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Link
                href="/profile"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors touch-manipulation">
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm sm:text-base">Back to Profile</span>
              </Link>
              <div className="hidden sm:block w-px h-6 bg-gray-600"></div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Edit Profile
              </h1>
            </div>

            <div className="flex gap-4 flex-wrap">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center justify-center space-x-2 btn-purple disabled:bg-blue-800 text-white/90 px-4 sm:px-3 py-3 sm:py-1 rounded-lg transition-colors m-auto sm:m-0 sm:w-auto min-h-[48px] text-sm sm:text-base touch-manipulation">
                <Save className="h-4 w-4" />
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </button>
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="flex items-center justify-center space-x-2 btn-purple text-white/90 px-4 sm:px-3 py-3 sm:py-1 rounded-lg transition-colors min-h-[48px] text-sm sm:text-base touch-manipulation"
              >
                <Lock className="h-4 w-4" />
                <span>Change Password</span>
              </button>
            </div>
          </div>

          {/* Success Message */}
          {saved && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-6 flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-400">
                Profile updated successfully!
              </span>
            </div>
          )}

          {/* Password Change Modal */}
          {isPasswordModalOpen && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-purple rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold text-white mb-4">
                  Change Password
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Old Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="password"
                        value={passwordData.oldPassword}
                        onChange={(e) =>
                          handlePasswordInputChange("oldPassword", e.target.value)
                        }
                        className="w-full bg-purple border border-gray-600 rounded-lg px-10 py-2 text-white/90 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          handlePasswordInputChange("newPassword", e.target.value)
                        }
                        className="w-full bg-purple border border-gray-600 rounded-lg px-10 py-2 text-white/90 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          handlePasswordInputChange(
                            "confirmPassword",
                            e.target.value
                          )
                        }
                        className="w-full bg-purple border border-gray-600 rounded-lg px-10 py-2 text-white/90 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                  {passwordError && (
                    <div className="text-red-400 text-sm">{passwordError}</div>
                  )}
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="px-4 py-2 bg-gray-600 text-white/90 rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordSave}
                    disabled={isSaving}
                    className="flex items-center justify-center space-x-2 btn-purple disabled:bg-blue-800 text-white/90 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isSaving ? "Saving..." : "Save Password"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div className="space-y-8">
            {/* Avatar Section */}
            <div className="bg-gradient-to-r from-purple-900/20 to-purple-900/20 rounded-lg p-6 border border-purple-800/30">
              <h2 className="text-xl font-bold text-white mb-6">
                Profile Picture
              </h2>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-purple-600 overflow-hidden">
                    <Image
                      src={userData.avatar}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                      priority
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-gray-300 mb-4">
                    Upload a new profile picture. Recommended size is 400x400
                    pixels.
                  </p>
                  <button
                    className="bg-gray-700 text-white/90 px-4 py-2 rounded-lg transition-colors opacity-60"
                    style={{ cursor: "not-allowed" }}
                    disabled>
                    Choose File
                  </button>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-purple rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-6">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={userData.username}
                      onChange={(e) =>
                        handleInputChange("username", e.target.value)
                      }
                      className="w-full bg-purple border border-gray-600 rounded-lg px-10 py-2 text-white/90 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  {validationErrors?.username && (
                    <div className="text-red-400 text-sm mt-2">
                      {validationErrors.username[0]}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-full bg-purple border border-gray-600 rounded-lg px-10 py-2 text-white/90 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  {validationErrors?.email && (
                    <div className="text-red-400 text-sm mt-2">
                      {validationErrors.email[0]}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-purple rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-6">
                Preferences
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preferred Title Language
                  </label>
                  <select
                    value={userData.preferences.preferred_title_lang}
                    onChange={(e) =>
                      handleInputChange(
                        "preferred_title_lang",
                        e.target.value,
                        "preferences"
                      )
                    }
                    className="w-full bg-purple border border-gray-600 rounded-lg px-3 py-2 text-white/90 focus:outline-none focus:border-purple-500">
                    <option value="en">English</option>
                    <option value="jp">Japanese (Romaji)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preferred Video Language
                  </label>
                  <select
                    value={userData.preferences.preferred_video_lang}
                    onChange={(e) =>
                      handleInputChange(
                        "preferred_video_lang",
                        e.target.value,
                        "preferences"
                      )
                    }
                    className="w-full bg-purple border border-gray-600 rounded-lg px-3 py-2 text-white/90 focus:outline-none focus:border-purple-500">
                    <option value="sub">Subtitled</option>
                    <option value="dub">Dubbed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Skip Intro/Outro (seconds)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={userData.preferences.skip_seconds}
                    onChange={(e) =>
                      handleInputChange(
                        "skip_seconds",
                        parseInt(e.target.value),
                        "preferences"
                      )
                    }
                    className="w-full bg-purple border border-gray-600 rounded-lg px-3 py-2 text-white/90 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bookmarks Per Page
                  </label>
                  <select
                    value={userData.preferences.bookmarks_per_page}
                    onChange={(e) =>
                      handleInputChange(
                        "bookmarks_per_page",
                        parseInt(e.target.value),
                        "preferences"
                      )
                    }
                    className="w-full bg-purple border border-gray-600 rounded-lg px-3 py-2 text-white/90 focus:outline-none focus:border-purple-500">
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                    <option value="100">100 per page</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userData.preferences.hide_bookmarks}
                    onChange={(e) =>
                      handleInputChange(
                        "hide_bookmarks",
                        e.target.checked,
                        "preferences"
                      )
                    }
                    className="w-4 h-4 rounded border-gray-600 bg-purple"
                  />
                  <span className="text-gray-300">Hide Bookmarks</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userData.preferences.hide_profile_activities}
                    onChange={(e) =>
                      handleInputChange(
                        "hide_profile_activities",
                        e.target.checked,
                        "preferences"
                      )
                    }
                    className="w-4 h-4 rounded border-gray-600 bg-purple"
                  />
                  <span className="text-gray-300">Hide Profile Activities</span>
                </label>
              </div>
            </div>

          </div>
            </>
          )}
        </div>
      </main>
      <FooterSection />
    </div>
  );
}
