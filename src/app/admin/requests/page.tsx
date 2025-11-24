"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/api/adminApi";
import { AnimeRequest } from "@/types/anime";

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<AnimeRequest[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  // Get token from localStorage (set during login)
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = getAuthToken();
        if (!token) {
          setError("Authentication required. Please log in.");
          return;
        }
        
        const response = await adminApi.getAnimeRequests(token);
        setRequests(response.results || response || []);
      } catch (err) {
        setError("Failed to fetch requests");
        console.error("Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const refetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }
      
      const response = await adminApi.getAnimeRequests(token);
      setRequests(response.results || response || []);
    } catch (err) {
      setError("Failed to fetch requests");
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredRequests.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRequests.map(req => Number(req.id)));
    }
  };

  const handleSelectRequest = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleBulkAction = async (action: "approved" | "rejected" | "pending" | "under_review") => {
    if (selectedIds.length === 0) return;
    
    try {
      setBulkLoading(true);
      
      const token = getAuthToken();
      if (!token) {
        alert("Authentication required. Please log in.");
        return;
      }
      
      await adminApi.bulkUpdateAnimeRequests(token, selectedIds, action);
      
      // Update local state
      setRequests(prev => prev.map(req => 
        selectedIds.includes(Number(req.id)) 
          ? { ...req, status: action }
          : req
      ));
      
      setSelectedIds([]);
      alert(`Successfully updated ${selectedIds.length} requests to ${action}`);
    } catch (err) {
      alert("Failed to update requests");
      console.error("Error updating requests:", err);
    } finally {
      setBulkLoading(false);
    }
  };

  const handleSingleUpdate = async (id: number, status: "approved" | "rejected") => {
    try {
      setUpdateLoading(id);
      
      const token = getAuthToken();
      if (!token) {
        alert("Authentication required. Please log in.");
        return;
      }
      
      await adminApi.updateAnimeRequest(token, String(id), { status });
      
      // Update local state
      setRequests(prev => prev.map(req => 
        Number(req.id) === id 
          ? { ...req, status }
          : req
      ));
      
      alert(`Request ${status} successfully`);
    } catch (err) {
      alert(`Failed to ${status} request`);
      console.error(`Error updating request:`, err);
    } finally {
      setUpdateLoading(null);
    }
  };

  // Helper function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  // Helper function to get display name
  const getRequestTitle = (req: AnimeRequest) => {
    return req.animeName || req.anime_name || 'Unnamed Request';
  };

  // Helper function to get user name
  const getUserName = (req: AnimeRequest) => {
    return req.user || req.userId || 'Unknown User';
  };

  // Helper function to get creation date
  const getCreationDate = (req: AnimeRequest) => {
    return formatDate(req.created_at || req.submittedAt);
  };

  // Filter requests
  const filteredRequests = requests.filter(req => {
    const statusMatch = statusFilter === "all" || req.status === statusFilter;
    const priorityMatch = priorityFilter === "all" || req.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex justify-center items-center h-64">
          <div className="text-white">Loading requests...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-red-400 mb-4">{error}</div>
          <button 
            onClick={refetchRequests}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Request Management ({filteredRequests.length})
        </h2>
        <div className="flex gap-2">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2 py-1 rounded bg-gray-800 text-white border border-gray-700 text-sm"
          >
            <option value="all">Status: All</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2 py-1 rounded bg-gray-800 text-white border border-gray-700 text-sm"
          >
            <option value="all">Priority: All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Bulk Action Toolbar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-blue-900/30 rounded-lg border border-blue-700">
          <span className="text-blue-200 text-sm">
            {selectedIds.length} item{selectedIds.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2 ml-auto">
            <button 
              onClick={() => handleBulkAction("approved")}
              disabled={bulkLoading}
              className="px-3 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded text-xs font-semibold"
            >
              {bulkLoading ? "..." : "Bulk Approve"}
            </button>
            <button 
              onClick={() => handleBulkAction("rejected")}
              disabled={bulkLoading}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded text-xs font-semibold"
            >
              {bulkLoading ? "..." : "Bulk Reject"}
            </button>
            <button 
              onClick={() => setSelectedIds([])}
              className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs font-semibold"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 rounded-xl overflow-hidden text-left text-sm md:text-base">
          <thead className="bg-gray-800 text-gray-200">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredRequests.length && filteredRequests.length > 0}
                  onChange={handleSelectAll}
                  className="rounded"
                />
              </th>
              <th className="p-3">Anime</th>
              <th className="p-3">User</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((req) => (
              <tr 
                key={req.id} 
                className={`border-b border-gray-800 hover:bg-gray-800/60 transition-colors ${
                  selectedIds.includes(Number(req.id)) ? 'bg-blue-900/20' : ''
                }`}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(Number(req.id))}
                    onChange={() => handleSelectRequest(Number(req.id))}
                    className="rounded"
                  />
                </td>
                <td className="p-3 font-semibold text-white">{getRequestTitle(req)}</td>
                <td className="p-3">{getUserName(req)}</td>
                <td className="p-3 capitalize">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    req.status === "pending" ? "bg-yellow-700 text-yellow-200" : 
                    req.status === "approved" ? "bg-green-700 text-green-200" : 
                    req.status === "rejected" ? "bg-red-700 text-red-200" :
                    "bg-blue-700 text-blue-200"
                  }`}>
                    {req.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-3">{getCreationDate(req)}</td>
                <td className="p-3 flex gap-2 flex-wrap">
                  <Link 
                    href={`/admin/requests/${req.id}`} 
                    className="px-2 py-1 bg-gray-700 hover:bg-gray-800 text-white rounded text-xs"
                  >
                    View
                  </Link>
                  <button 
                    onClick={() => handleSingleUpdate(Number(req.id), "approved")}
                    disabled={updateLoading === Number(req.id)}
                    className="px-2 py-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded text-xs"
                  >
                    {updateLoading === Number(req.id) ? "..." : "Approve"}
                  </button>
                  <button 
                    onClick={() => handleSingleUpdate(Number(req.id), "rejected")}
                    disabled={updateLoading === Number(req.id)}
                    className="px-2 py-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded text-xs"
                  >
                    {updateLoading === Number(req.id) ? "..." : "Reject"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* No results message */}
        {filteredRequests.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No requests found matching the selected filters.
          </div>
        )}

        {/* Mobile card layout */}
        <div className="md:hidden flex flex-col gap-4 mt-4">
          {filteredRequests.map((req) => (
            <div 
              key={req.id} 
              className={`bg-gray-900 rounded-xl p-4 flex flex-col gap-2 shadow ${
                selectedIds.includes(Number(req.id)) ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(Number(req.id))}
                  onChange={() => handleSelectRequest(Number(req.id))}
                  className="rounded"
                />
                <div className="font-bold text-white text-lg">{getRequestTitle(req)}</div>
              </div>
              <div className="text-gray-400 text-xs mb-1">User: {getUserName(req)}</div>
              <div className="flex gap-2 text-xs mb-1">
                <span className={`capitalize px-2 py-1 rounded font-bold ${
                  req.status === "pending" ? "bg-yellow-700 text-yellow-200" : 
                  req.status === "approved" ? "bg-green-700 text-green-200" : 
                  req.status === "rejected" ? "bg-red-700 text-red-200" :
                  "bg-blue-700 text-blue-200"
                }`}>
                  {req.status.replace('_', ' ')}
                </span>
              </div>
              <div className="text-gray-400 text-xs mb-1">{getCreationDate(req)}</div>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Link 
                  href={`/admin/requests/${req.id}`} 
                  className="px-2 py-1 bg-gray-700 hover:bg-gray-800 text-white rounded text-xs"
                >
                  View
                </Link>
                <button 
                  onClick={() => handleSingleUpdate(Number(req.id), "approved")}
                  disabled={updateLoading === Number(req.id)}
                  className="px-2 py-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded text-xs"
                >
                  {updateLoading === Number(req.id) ? "..." : "Approve"}
                </button>
                <button 
                  onClick={() => handleSingleUpdate(Number(req.id), "rejected")}
                  disabled={updateLoading === Number(req.id)}
                  className="px-2 py-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded text-xs"
                >
                  {updateLoading === Number(req.id) ? "..." : "Reject"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 