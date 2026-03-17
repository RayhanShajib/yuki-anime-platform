"use client";

import Image from "next/image";
import { safeLocalStorage } from "@/lib/safeLocalStorage";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminApi } from "@/lib/api/adminApi";
import type { UserData, UpdateUserData } from "@/lib/api/adminApi";

// Loading component
function LoadingState() {
  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-6 animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-64 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-48"></div>
      </div>
      
      <div className="bg-gray-900 rounded-xl p-6 animate-pulse space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gray-700 rounded-full"></div>
          <div className="flex-1">
            <div className="h-6 bg-gray-700 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-32"></div>
          </div>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i}>
              <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
              <div className="h-10 bg-gray-700 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get('username') || 'Unknown User';
  
  const [user, setUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<UpdateUserData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Resolve async params
  useEffect(() => {
    params.then(resolvedParams => {
      setUserId(resolvedParams.id);
    });
  }, [params]);

  // Authentication helper
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return safeLocalStorage.getItem('access_token');
    }
    return null;
  };

  // Load user data for editing
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const token = getAuthToken();
        if (!token) {
          throw new Error('Authentication required. Please login again.');
        }

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // For demonstration, create a mock user based on the ID
        const mockUser: UserData = {
          id: parseInt(userId),
          username: username,
          email: `${username.toLowerCase()}@example.com`,
          first_name: "John",
          last_name: "Doe", 
          role: parseInt(userId) === 1 ? "admin" : "user",
          avatar: null,
          preferred_title_lang: "en",
          preferred_video_lang: "sub",
          skip_seconds: 10,
          bookmarks_per_page: 20,
          hide_bookmarks: false,
          hide_profile_activities: false,
          // Add ban-related fields for demonstration
          is_banned: parseInt(userId) === 2, // Mock user ID 2 as banned
          ban_expires: parseInt(userId) === 2 ? "2024-12-31T23:59:59Z" : undefined,
          ban_type: parseInt(userId) === 2 ? "temporary" : undefined
        };
        
        setUser(mockUser);
        
        // Initialize form data
        setFormData({
          email: mockUser.email,
          first_name: mockUser.first_name,
          last_name: mockUser.last_name,
          role: mockUser.role,
          preferred_title_lang: mockUser.preferred_title_lang,
          preferred_video_lang: mockUser.preferred_video_lang,
          skip_seconds: mockUser.skip_seconds,
          bookmarks_per_page: mockUser.bookmarks_per_page,
          hide_bookmarks: mockUser.hide_bookmarks,
          hide_profile_activities: mockUser.hide_profile_activities
        });
        
        console.log("✅ User Edit - Data loaded:", mockUser);
      } catch (err) {
        console.error('❌ User Edit - Error loading user:', err);
        setError(err instanceof Error ? err.message : 'Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId, username]);

  // Handle form field changes
  const handleInputChange = (field: keyof UpdateUserData, value: string | number | boolean) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      setHasChanges(true);
      setSaveError(null);
      return newData;
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !hasChanges) return;

    const token = getAuthToken();
    if (!token) {
      setSaveError('Authentication required. Please login again.');
      return;
    }

    try {
      setSaving(true);
      setSaveError(null);
      
      console.log("💾 User Edit - Saving changes:", {
        userId: user.id,
        changes: formData
      });
      
      // Filter out unchanged fields
      const changedFields: UpdateUserData = {};
      Object.entries(formData).forEach(([key, value]) => {
        const typedKey = key as keyof UpdateUserData;
        if (user[typedKey] !== value) {
          changedFields[typedKey] = value as never;
        }
      });
      
      console.log("📝 User Edit - Fields to update:", changedFields);
      
      // Call the API
      const updatedUser = await adminApi.updateUser(user.id, changedFields, token);
      
      console.log("✅ User Edit - Update successful:", updatedUser);
      
      // Update local state
      setUser(updatedUser);
      setHasChanges(false);
      
      // Show success and redirect
      alert(`User "${user.username}" has been updated successfully.`);
      router.push(`/admin/users/${user.id}?username=${encodeURIComponent(user.username)}`);
      
    } catch (err) {
      console.error('❌ User Edit - Error saving changes:', err);
      setSaveError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (hasChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        router.back();
      }
    } else {
      router.back();
    }
  };

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'bg-red-600';
      case 'moderator': return 'bg-blue-600';
      case 'vip': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error || !user) {
    return (
      <div className="max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => router.back()}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Edit User</h1>
        </div>
        
        <div className="bg-red-900/20 border border-red-600 rounded-lg p-6">
          <h3 className="text-red-400 font-semibold text-lg mb-2">Error Loading User</h3>
          <p className="text-red-300 mb-4">{error || 'User not found'}</p>
          <div className="flex gap-3">
            <button 
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={handleCancel}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Edit User</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-6 shadow space-y-6">
        {/* User Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-gray-800">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.username}
              width={80}
              height={80}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-white font-semibold text-xl">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-white">{user.username}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${getRoleBadgeColor(user.role)}`}>
                {user.role.toUpperCase()}
              </span>
              <span className="text-gray-400 text-sm">ID: {user.id}</span>
              {user.is_banned && (
                <span className="px-2 py-1 rounded text-xs font-semibold text-white bg-red-600">
                  BANNED
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Ban Warning */}
        {user.is_banned && (
          <div className="bg-red-900/20 border border-red-600 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 text-red-400 mt-0.5">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-red-400 font-semibold">User is Currently Banned</h4>
                <div className="text-red-300 text-sm mt-1 space-y-1">
                  <p>
                    <strong>Ban Type:</strong> {user.ban_type === 'permanent' ? 'Permanent Ban' : 'Temporary Ban'}
                  </p>
                  {user.ban_expires && user.ban_type !== 'permanent' && (
                    <p>
                      <strong>Ban Expires:</strong> {new Date(user.ban_expires).toLocaleString()}
                    </p>
                  )}
                  <p className="mt-2">
                    <strong>⚠️ Important:</strong> While this user is banned, they cannot access the platform. 
                    However, you can still edit their account information and preferences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Error */}
        {saveError && (
          <div className="bg-red-900/20 border border-red-600 rounded p-3">
            <p className="text-red-300 text-sm">{saveError}</p>
          </div>
        )}

        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={formData.first_name || ''}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={formData.last_name || ''}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="Enter last name"
              />
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="Enter email address"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                User Role
              </label>
              <select
                value={formData.role || ''}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
              >
                <option value="user">User</option>
                <option value="vip">VIP</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Title Language
              </label>
              <select
                value={formData.preferred_title_lang || ''}
                onChange={(e) => handleInputChange('preferred_title_lang', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
              >
                <option value="en">English</option>
                <option value="jp">Japanese</option>
                <option value="romaji">Romaji</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Video Language
              </label>
              <select
                value={formData.preferred_video_lang || ''}
                onChange={(e) => handleInputChange('preferred_video_lang', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
              >
                <option value="sub">Subtitled</option>
                <option value="dub">Dubbed</option>
                <option value="raw">Raw</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Auto-Skip Seconds
              </label>
              <input
                type="number"
                min="0"
                max="60"
                value={formData.skip_seconds || 0}
                onChange={(e) => handleInputChange('skip_seconds', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Bookmarks Per Page
              </label>
              <input
                type="number"
                min="10"
                max="100"
                value={formData.bookmarks_per_page || 20}
                onChange={(e) => handleInputChange('bookmarks_per_page', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Privacy Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
              <div>
                <span className="text-white font-medium">Hide Bookmarks</span>
                <p className="text-gray-400 text-sm">Hide bookmarks from other users</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hide_bookmarks || false}
                  onChange={(e) => handleInputChange('hide_bookmarks', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
              <div>
                <span className="text-white font-medium">Hide Profile Activities</span>
                <p className="text-gray-400 text-sm">Hide activity from profile page</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hide_profile_activities || false}
                  onChange={(e) => handleInputChange('hide_profile_activities', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 border-t border-gray-800">
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white rounded transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !hasChanges}
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}