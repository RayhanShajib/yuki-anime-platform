"use client";

import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/sections/FooterSection";
import {
  ArrowLeft,
  Calendar,
  Github,
  Globe,
  Instagram,
  Lock,
  Mail,
  MapPin,
  Save,
  Twitter,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Mock user data
const initialUserData = {
  username: "AnimeExplorer",
  email: "user@example.com",
  avatar: "https://i.pravatar.cc/150?img=5",
  bio: "Passionate anime enthusiast who loves exploring different genres and discovering hidden gems. Always up for a good discussion about character development and plot twists!",
  location: "Tokyo, Japan",
  website: "https://myanimeblog.com",
  joinDate: "2023-01-15",
  birthday: "1995-03-15",
  gender: "prefer-not-to-say",
  socialLinks: {
    twitter: "animeexplorer",
    github: "animeexplorer",
    instagram: "anime_explorer_95",
  },
  preferences: {
    profileVisibility: "public",
    showEmail: false,
    showBirthday: false,
    showLocation: true,
    allowMessages: true,
    showActivity: true,
    showFavorites: true,
    showStats: true,
  },
};

export default function ProfileEditPage() {
  const [userData, setUserData] = useState(initialUserData);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  const handleInputChange = (
    field: string,
    value: string | boolean,
    category?: string
  ) => {
    if (category) {
      setUserData((prev) => ({
        ...prev,
        [category]: {
          ...(prev[category as keyof typeof prev] as Record<
            string,
            string | boolean
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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
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
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-10 py-2 text-white/90 focus:outline-none focus:border-purple-500"
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
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-10 py-2 text-white/90 focus:outline-none focus:border-purple-500"
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
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-10 py-2 text-white/90 focus:outline-none focus:border-purple-500"
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
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
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
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
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
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-10 py-2 text-white/90 focus:outline-none focus:border-purple-500"
                    />
                  </div>
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
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-10 py-2 text-white/90 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Birthday
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      value={userData.birthday}
                      onChange={(e) =>
                        handleInputChange("birthday", e.target.value)
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-10 py-2 text-white/90 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gender
                  </label>
                  <select
                    value={userData.gender}
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white/90 focus:outline-none focus:border-purple-500">
                    <option value="prefer-not-to-say">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={userData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      placeholder="City, Country"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-10 py-2 text-white/90 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="url"
                      value={userData.website}
                      onChange={(e) =>
                        handleInputChange("website", e.target.value)
                      }
                      placeholder="https://your-website.com"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-10 py-2 text-white/90 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={userData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={4}
                  placeholder="Tell us about yourself and your anime interests..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white/90 focus:outline-none focus:border-purple-500 resize-none"
                />
                <p className="text-gray-400 text-sm mt-2">
                  {userData.bio.length}/500 characters
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-6">
                Social Links
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Twitter
                  </label>
                  <div className="relative">
                    <Twitter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={userData.socialLinks.twitter}
                      onChange={(e) =>
                        handleInputChange(
                          "twitter",
                          e.target.value,
                          "socialLinks"
                        )
                      }
                      placeholder="username"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-10 py-2 text-white/90 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    GitHub
                  </label>
                  <div className="relative">
                    <Github className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={userData.socialLinks.github}
                      onChange={(e) =>
                        handleInputChange(
                          "github",
                          e.target.value,
                          "socialLinks"
                        )
                      }
                      placeholder="username"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-10 py-2 text-white/90 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Instagram
                  </label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={userData.socialLinks.instagram}
                      onChange={(e) =>
                        handleInputChange(
                          "instagram",
                          e.target.value,
                          "socialLinks"
                        )
                      }
                      placeholder="username"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-10 py-2 text-white/90 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FooterSection />
    </div>
  );
}
