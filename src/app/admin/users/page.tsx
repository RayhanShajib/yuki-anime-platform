"use client";

import Link from "next/link";
import { safeLocalStorage } from "@/lib/safeLocalStorage";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { adminApi } from "@/lib/api/adminApi";
import type { UserData, UserListResponse, DeleteUserCredentials, BanUserData, BanResponse } from "@/lib/api/adminApi";

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <tr key={i} className="border-b border-gray-800 animate-pulse">
          <td className="p-3">
            <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
          </td>
          <td className="p-3">
            <div className="h-4 bg-gray-700 rounded w-24"></div>
          </td>
          <td className="p-3">
            <div className="h-4 bg-gray-700 rounded w-32"></div>
          </td>
          <td className="p-3">
            <div className="h-4 bg-gray-700 rounded w-16"></div>
          </td>
          <td className="p-3">
            <div className="h-4 bg-gray-700 rounded w-20"></div>
          </td>
          <td className="p-3">
            <div className="flex gap-2">
              <div className="h-6 bg-gray-700 rounded w-12"></div>
              <div className="h-6 bg-gray-700 rounded w-12"></div>
              <div className="h-6 bg-gray-700 rounded w-16"></div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

// Mobile loading skeleton
function MobileLoadingSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-900 rounded-xl p-4 animate-pulse flex gap-4">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex-shrink-0"></div>
          <div className="flex-1">
            <div className="h-5 bg-gray-700 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-48 mb-1"></div>
            <div className="h-3 bg-gray-700 rounded w-24 mb-1"></div>
            <div className="h-3 bg-gray-700 rounded w-20 mb-2"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-gray-700 rounded w-12"></div>
              <div className="h-6 bg-gray-700 rounded w-12"></div>
              <div className="h-6 bg-gray-700 rounded w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </>
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

// Ban user modal
function BanUserModal({ 
  user, 
  isOpen, 
  onClose, 
  onConfirm 
}: {
  user: UserData | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (banData: BanUserData) => void;
}) {
  const [banData, setBanData] = useState<BanUserData>({
    user: '',
    days: undefined,
    permanent_ban: false
  });
  const [isBanning, setIsBanning] = useState(false);
  const [banType, setBanType] = useState<'7days' | '30days' | 'permanent'>('7days');

  // Update ban data when user or ban type changes
  useEffect(() => {
    if (user) {
      const newBanData: BanUserData = {
        user: user.username,
        permanent_ban: false
      };

      switch (banType) {
        case '7days':
          newBanData.days = 7;
          break;
        case '30days':
          newBanData.days = 30;
          break;
        case 'permanent':
          newBanData.permanent_ban = true;
          delete newBanData.days;
          break;
      }

      setBanData(newBanData);
    }
  }, [user, banType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (banData.user) {
      setIsBanning(true);
      try {
        await onConfirm(banData);
      } finally {
        setIsBanning(false);
        setBanType('7days');
      }
    }
  };

  const getBanDescription = () => {
    switch (banType) {
      case '7days':
        return 'User will be banned for 7 days.';
      case '30days':
        return 'User will be banned for 30 days.';
      case 'permanent':
        return 'User will be permanently banned from the platform.';
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Ban User</h3>
        <p className="text-gray-300 mb-4">
          You are about to ban user <span className="font-semibold text-orange-400">{user.username}</span>.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Select Ban Duration:
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value="7days"
                  checked={banType === '7days'}
                  onChange={(e) => setBanType(e.target.value as '7days')}
                  className="w-4 h-4 text-orange-600 bg-gray-800 border-gray-600 focus:ring-orange-500 focus:ring-2"
                />
                <span className="text-white">7 days</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value="30days"
                  checked={banType === '30days'}
                  onChange={(e) => setBanType(e.target.value as '30days')}
                  className="w-4 h-4 text-orange-600 bg-gray-800 border-gray-600 focus:ring-orange-500 focus:ring-2"
                />
                <span className="text-white">30 days</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value="permanent"
                  checked={banType === 'permanent'}
                  onChange={(e) => setBanType(e.target.value as 'permanent')}
                  className="w-4 h-4 text-red-600 bg-gray-800 border-gray-600 focus:ring-red-500 focus:ring-2"
                />
                <span className="text-white">Permanent ban</span>
              </label>
            </div>
          </div>

          <div className="bg-gray-800 p-3 rounded text-sm text-gray-300">
            {getBanDescription()}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isBanning}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isBanning}
              className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white rounded transition-colors"
            >
              {isBanning ? 'Banning...' : 'Ban User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  // State management
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    user: UserData | null;
  }>({ isOpen: false, user: null });
  const [banModal, setBanModal] = useState<{
    isOpen: boolean;
    user: UserData | null;
  }>({ isOpen: false, user: null });

  // Authentication helper
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return safeLocalStorage.getItem('access_token');
    }
    return null;
  };

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }
      
      console.log("👥 User Admin - Fetching users:", {
        limit,
        offset,
        searchTerm: searchTerm.trim() || undefined
      });
      
      const response: UserListResponse = await adminApi.getUserList(
        limit,
        offset,
        token
      );
      
      console.log("📋 User Admin - Response received:", response);
      
      // Handle paginated response structure
      if (response && typeof response === 'object' && 'results' in response) {
        // Filter users by search term on the frontend for now
        let filteredUsers = response.results;
        if (searchTerm.trim()) {
          const search = searchTerm.toLowerCase().trim();
          filteredUsers = response.results.filter(user => 
            user.username.toLowerCase().includes(search) ||
            user.email.toLowerCase().includes(search) ||
            user.first_name.toLowerCase().includes(search) ||
            user.last_name.toLowerCase().includes(search)
          );
        }
        
        setUsers(filteredUsers);
        setTotalCount(searchTerm.trim() ? filteredUsers.length : response.count);
        console.log("✅ User Admin - Data processed:", {
          userCount: filteredUsers.length,
          totalCount: searchTerm.trim() ? filteredUsers.length : response.count
        });
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (err) {
      console.error('❌ User Admin - Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [limit, offset, searchTerm]);

  // Initial load and refresh when dependencies change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
      console.log("🗑️ User Admin - Delete operation:", {
        userId: deleteModal.user.id,
        username: deleteModal.user.username
      });
      
      await adminApi.deleteUser(deleteModal.user.id, credentials, token);
      console.log("✅ User Admin - Delete successful, refreshing list...");
      
      // Refresh the list after successful deletion
      await fetchUsers();
      
      // Show success notification
      alert(`User "${deleteModal.user.username}" has been deleted successfully.`);
      console.log("🎉 User Admin - Delete operation completed successfully");
    } catch (err) {
      console.error('❌ User Admin - Error deleting user:', err);
      
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      alert(`Failed to delete user: ${errorMessage}`);
    } finally {
      setDeleteModal({ isOpen: false, user: null });
    }
  };

  // Handle user banning
  const handleBanUser = async (user: UserData) => {
    setBanModal({ isOpen: true, user });
  };

  const confirmBanUser = async (banData: BanUserData) => {
    const token = getAuthToken();
    if (!token || !banModal.user) {
      alert('Authentication required. Please login again.');
      return;
    }

    try {
      console.log("🔒 User Admin - Ban operation:", {
        userId: banModal.user.id,
        username: banModal.user.username,
        banData
      });
      
      const response: BanResponse = await adminApi.banUser(banData, token);
      console.log("✅ User Admin - Ban successful:", response);
      
      // Refresh the list after successful ban
      await fetchUsers();
      
      // Show success notification
      const banTypeText = banData.permanent_ban ? 'permanently banned' : `banned for ${banData.days} days`;
      alert(`User "${banModal.user.username}" has been ${banTypeText}.`);
      console.log("🎉 User Admin - Ban operation completed successfully");
    } catch (err) {
      console.error('❌ User Admin - Error banning user:', err);
      
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      alert(`Failed to ban user: ${errorMessage}`);
    } finally {
      setBanModal({ isOpen: false, user: null });
    }
  };

  // Handle search with debouncing
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setOffset(0); // Reset to first page when searching
  }, []);

  // Handle pagination
  const handlePagination = (newOffset: number) => {
    setOffset(newOffset);
  };

  // Calculate pagination info
  const hasNext = offset + limit < totalCount;
  const hasPrevious = offset > 0;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(totalCount / limit);

  // Get user display name
  const getUserDisplayName = (user: UserData) => {
    if (user.first_name || user.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return user.username;
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
          <span className="px-2 py-1 rounded text-xs font-semibold text-white bg-red-600">
            BANNED
          </span>
        );
      } else {
        return (
          <span className="px-2 py-1 rounded text-xs font-semibold text-white bg-orange-600">
            TEMP BAN
          </span>
        );
      }
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">User Management</h2>
        <div className="text-sm text-gray-400">
          {!loading && (
            <span>Total Users: {totalCount.toLocaleString()}</span>
          )}
        </div>
      </div>

      {/* Search and Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search users by name, username, or email..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        
        {/* Results info */}
        <div className="text-sm text-gray-400">
          {!loading && (
            <span>
              Showing {Math.min(limit, users.length)} of {totalCount} users
              {searchTerm && ` for "${searchTerm}"`}
            </span>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 bg-red-900/20 border border-red-600 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-red-400 font-semibold">Error Loading Users</h3>
              <p className="text-red-300 text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={fetchUsers}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full bg-gray-900 rounded-xl overflow-hidden text-left text-sm">
          <thead className="bg-gray-800 text-gray-200">
            <tr>
              <th className="p-4 font-semibold">User</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <LoadingSkeleton />
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">
                  {searchTerm ? 
                    `No users found for "${searchTerm}"` : 
                    'No users available'
                  }
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/60 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.username}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-white">{user.username}</div>
                        <div className="text-xs text-gray-400">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300 max-w-[200px] truncate">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-gray-300 max-w-[150px] truncate">
                    {getUserDisplayName(user)}
                  </td>
                  <td className="p-4">
                    {getBanStatusBadge(user) || (
                      <span className="px-2 py-1 rounded text-xs font-semibold text-white bg-green-600">
                        ACTIVE
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link 
                        href={`/admin/users/${user.id}?username=${encodeURIComponent(user.username)}`}
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs transition-colors"
                      >
                        View
                      </Link>
                      <Link 
                        href={`/admin/users/${user.id}/edit?username=${encodeURIComponent(user.username)}`}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors"
                      >
                        Edit
                      </Link>
                      {!user.is_banned && (
                        <button 
                          onClick={() => handleBanUser(user)}
                          className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs transition-colors"
                        >
                          Ban
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteUser(user)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="lg:hidden flex flex-col gap-4">
        {loading ? (
          <MobileLoadingSkeleton />
        ) : users.length === 0 ? (
          <div className="bg-gray-900 rounded-xl p-6 text-center text-gray-400">
            {searchTerm ? 
              `No users found for "${searchTerm}"` : 
              'No users available'
            }
          </div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="bg-gray-900 rounded-xl p-4 shadow">
              <div className="flex gap-4 mb-4">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.username}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-lg">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-lg">{user.username}</div>
                  <div className="text-gray-400 text-sm mb-1 truncate">{user.email}</div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                    {getBanStatusBadge(user) || (
                      <span className="px-2 py-1 rounded text-xs font-semibold text-white bg-green-600">
                        ACTIVE
                      </span>
                    )}
                    <span className="text-gray-400 text-xs">ID: {user.id}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1 text-sm mb-3">
                <div className="text-gray-400">
                  <span className="text-gray-500">Name:</span> {getUserDisplayName(user)}
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Link 
                  href={`/admin/users/${user.id}?username=${encodeURIComponent(user.username)}`}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs transition-colors"
                >
                  View
                </Link>
                <Link 
                  href={`/admin/users/${user.id}/edit?username=${encodeURIComponent(user.username)}`}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors"
                >
                  Edit
                </Link>
                {!user.is_banned && (
                  <button 
                    onClick={() => handleBanUser(user)}
                    className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs transition-colors"
                  >
                    Ban
                  </button>
                )}
                <button 
                  onClick={() => handleDeleteUser(user)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && !searchTerm && totalCount > limit && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePagination(Math.max(0, offset - limit))}
              disabled={!hasPrevious}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded text-sm transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => handlePagination(offset + limit)}
              disabled={!hasNext}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded text-sm transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        user={deleteModal.user}
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
        onConfirm={confirmDeleteUser}
      />

      {/* Ban User Modal */}
      <BanUserModal
        user={banModal.user}
        isOpen={banModal.isOpen}
        onClose={() => setBanModal({ isOpen: false, user: null })}
        onConfirm={confirmBanUser}
      />
    </div>
  );
}