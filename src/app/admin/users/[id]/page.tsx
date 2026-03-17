"use client";

import Link from "next/link";
import { safeLocalStorage } from "@/lib/safeLocalStorage";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminApi } from "@/lib/api/adminApi";
import type { UserData, DeleteUserCredentials } from "@/lib/api/adminApi";

// Loading component
function LoadingState() {
  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-6 animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-64 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-48"></div>
      </div>
      
      <div className="bg-gray-900 rounded-xl p-6 animate-pulse">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 bg-gray-700 rounded-full"></div>
          <div className="flex-1">
            <div className="h-6 bg-gray-700 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-32 mb-1"></div>
            <div className="h-4 bg-gray-700 rounded w-24"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="h-5 bg-gray-700 rounded w-32 mb-3"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-4 bg-gray-700 rounded w-full"></div>
              ))}
            </div>
          </div>
          <div>
            <div className="h-5 bg-gray-700 rounded w-32 mb-3"></div>
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-4 bg-gray-700 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Delete confirmation modal
function DeleteModal({ 
  user, 
  isOpen, 
  onClose, 
  onConfirm 
}: {
  user: UserData | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (credentials: DeleteUserCredentials) => void;
}) {
  const [credentials, setCredentials] = useState<DeleteUserCredentials>({
    username: '',
    password: ''
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.username && credentials.password) {
      setIsDeleting(true);
      try {
        await onConfirm(credentials);
      } finally {
        setIsDeleting(false);
        setCredentials({ username: '', password: '' });
      }
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Confirm User Deletion</h3>
        <p className="text-gray-300 mb-4">
          Are you sure you want to delete user <span className="font-semibold text-red-400">{user.username}</span>? 
          This action cannot be undone.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Admin Username
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
              placeholder="Enter your admin username"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Admin Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
              placeholder="Enter your admin password"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isDeleting || !credentials.username || !credentials.password}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded transition-colors"
            >
              {isDeleting ? 'Deleting...' : 'Delete User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get('username') || 'Unknown User';
  
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    user: UserData | null;
  }>({ isOpen: false, user: null });
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

  // For now, we'll simulate user details since we don't have a getSingleUser endpoint
  // In a real implementation, you would call adminApi.getSingleUser(userId, token)
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
        await new Promise(resolve => setTimeout(resolve, 1000));
        
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
        
        console.log("✅ User Detail - Data loaded:", mockUser);
      } catch (err) {
        console.error('❌ User Detail - Error loading user:', err);
        setError(err instanceof Error ? err.message : 'Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId, username]);

  // Handle user deletion
  const handleDeleteUser = async (user: UserData) => {
    setDeleteModal({ isOpen: true, user });
  };

  const confirmDeleteUser = async (credentials: DeleteUserCredentials) => {
    const token = getAuthToken();
    if (!token || !deleteModal.user) {
      alert('Authentication required. Please login again.');
      return;
    }

    try {
      console.log("🗑️ User Detail - Delete operation:", {
        userId: deleteModal.user.id,
        username: deleteModal.user.username
      });
      
      await adminApi.deleteUser(deleteModal.user.id, credentials, token);
      console.log("✅ User Detail - Delete successful, redirecting...");
      
      // Show success notification and redirect
      alert(`User "${deleteModal.user.username}" has been deleted successfully.`);
      router.push('/admin/users');
      
      console.log("🎉 User Detail - Delete operation completed successfully");
    } catch (err) {
      console.error('❌ User Detail - Error deleting user:', err);
      
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      alert(`Failed to delete user: ${errorMessage}`);
    } finally {
      setDeleteModal({ isOpen: false, user: null });
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

  // Get ban status badge
  const getBanStatusBadge = (user: UserData) => {
    if (user.is_banned) {
      const isPermanent = user.ban_type === 'permanent' || !user.ban_expires;
      if (isPermanent) {
        return (
          <span className="px-3 py-1 rounded text-sm font-semibold text-white bg-red-600">
            PERMANENTLY BANNED
          </span>
        );
      } else {
        const expiresDate = user.ban_expires ? new Date(user.ban_expires) : null;
        return (
          <span className="px-3 py-1 rounded text-sm font-semibold text-white bg-orange-600">
            TEMPORARILY BANNED
            {expiresDate && (
              <span className="ml-1 text-xs">
                (until {expiresDate.toLocaleDateString()})
              </span>
            )}
          </span>
        );
      }
    }
    return (
      <span className="px-3 py-1 rounded text-sm font-semibold text-white bg-green-600">
        ACTIVE
      </span>
    );
  };

  // Get user display name
  const getUserDisplayName = (user: UserData) => {
    if (user.first_name || user.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return user.username;
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error || !user) {
    return (
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-6">
          <Link 
            href="/admin/users"
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
          >
            ← Back to Users
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-white">User Details</h1>
        </div>
        
        <div className="bg-red-900/20 border border-red-600 rounded-lg p-6">
          <h3 className="text-red-400 font-semibold text-lg mb-2">Error Loading User</h3>
          <p className="text-red-300 mb-4">{error || 'User not found'}</p>
          <div className="flex gap-3">
            <Link 
              href="/admin/users"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
            >
              Back to Users
            </Link>
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
    <div className="max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href="/admin/users"
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
        >
          ← Back to Users
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-white">User Details</h1>
      </div>

      {/* User Profile Card */}
      <div className="bg-gray-900 rounded-xl p-6 shadow">
        {/* User Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
          <div className="flex items-center gap-4">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.username}
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-white font-semibold text-2xl">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-white">{user.username}</h2>
              <p className="text-gray-300 text-sm mb-1">{user.email}</p>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded text-sm font-semibold text-white ${getRoleBadgeColor(user.role)}`}>
                  {user.role.toUpperCase()}
                </span>
                <span className="text-gray-400 text-sm">ID: {user.id}</span>
              </div>
              <div className="flex items-center gap-2">
                {getBanStatusBadge(user)}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 sm:ml-auto">
            <Link 
              href={`/admin/users/${user.id}/edit?username=${encodeURIComponent(user.username)}`}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Edit User
            </Link>
            <button 
              onClick={() => handleDeleteUser(user)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
            >
              Delete User
            </button>
          </div>
        </div>

        {/* User Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-400">Full Name</label>
                <p className="text-white">{getUserDisplayName(user) || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Username</label>
                <p className="text-white">{user.username}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Email Address</label>
                <p className="text-white">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">User Role</label>
                <p className="text-white">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Preferences & Settings */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Preferences & Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-400">Preferred Title Language</label>
                <p className="text-white">{user.preferred_title_lang.toUpperCase()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Preferred Video Language</label>
                <p className="text-white">{user.preferred_video_lang.toUpperCase()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Auto-Skip Seconds</label>
                <p className="text-white">{user.skip_seconds}s</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Bookmarks Per Page</label>
                <p className="text-white">{user.bookmarks_per_page}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ban Information */}
        {user.is_banned && (
          <div className="mt-6 pt-6 border-t border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Ban Information</h3>
            <div className="bg-red-900/20 border border-red-600 rounded-lg p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-red-400">Ban Status</label>
                  <p className="text-white font-semibold">
                    {user.ban_type === 'permanent' ? 'Permanently Banned' : 'Temporarily Banned'}
                  </p>
                </div>
                {user.ban_expires && user.ban_type !== 'permanent' && (
                  <div>
                    <label className="text-sm font-medium text-red-400">Ban Expires</label>
                    <p className="text-white">
                      {new Date(user.ban_expires).toLocaleString()}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-red-400">Ban Type</label>
                  <p className="text-white capitalize">{user.ban_type || 'Unknown'}</p>
                </div>
                {user.ban_expires && user.ban_type !== 'permanent' && (
                  <div>
                    <label className="text-sm font-medium text-red-400">Time Remaining</label>
                    <p className="text-white">
                      {(() => {
                        const now = new Date();
                        const expires = new Date(user.ban_expires);
                        const diff = expires.getTime() - now.getTime();
                        
                        if (diff <= 0) return 'Expired';
                        
                        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        
                        if (days > 0) return `${days} days, ${hours} hours`;
                        return `${hours} hours`;
                      })()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Privacy Settings */}
        <div className="mt-6 pt-6 border-t border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">Privacy Settings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
              <span className="text-gray-300">Hide Bookmarks</span>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                user.hide_bookmarks ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
              }`}>
                {user.hide_bookmarks ? 'Hidden' : 'Visible'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
              <span className="text-gray-300">Hide Profile Activities</span>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                user.hide_profile_activities ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
              }`}>
                {user.hide_profile_activities ? 'Hidden' : 'Visible'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        user={deleteModal.user}
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
        onConfirm={confirmDeleteUser}
      />
    </div>
  );
}