"use client";

import { useState, useEffect } from "react";
import { safeLocalStorage } from "@/lib/safeLocalStorage";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/api/adminApi";
import { AnimeRequest } from "@/types/anime";

export default function AdminViewRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const [request, setRequest] = useState<AnimeRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [requestId, setRequestId] = useState<string>("");
  
  const router = useRouter();
  
  // Get token from localStorage (set during login)
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return safeLocalStorage.getItem('access_token');
    }
    return null;
  };

  useEffect(() => {
    const initializeParams = async () => {
      const resolvedParams = await params;
      setRequestId(resolvedParams.id);
    };
    
    initializeParams();
  }, [params]);

  useEffect(() => {
    if (requestId) {
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const token = getAuthToken();
          if (!token) {
            setError("Authentication required. Please log in.");
            return;
          }
          
          const response = await adminApi.getAnimeRequestDetails(token, Number(requestId));
          setRequest(response);
          setSelectedStatus(response.status || "pending");
        } catch (err) {
          setError("Failed to fetch request details");
          console.error("Error fetching request details:", err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }
  }, [requestId]);

  const fetchRequestDetails = async () => {
    if (!requestId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }
      
      const response = await adminApi.getAnimeRequestDetails(token, Number(requestId));
      setRequest(response);
      setSelectedStatus(response.status || "pending");
    } catch (err) {
      setError("Failed to fetch request details");
      console.error("Error fetching request details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status: "approved" | "rejected" | "under_review" | "completed") => {
    if (!request) return;
    
    try {
      setUpdateLoading(true);
      
      const token = getAuthToken();
      if (!token) {
        alert("Authentication required. Please log in.");
        return;
      }
      
      await adminApi.updateAnimeRequest(token, String(request.id), { status });
      
      // Update local state
      setRequest(prev => prev ? { ...prev, status } : null);
      setSelectedStatus(status);
      
      alert(`Request ${status} successfully`);
    } catch (err) {
      alert(`Failed to update request status`);
      console.error("Error updating request:", err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/admin/requests");
  };

  // Helper functions
  const getRequestTitle = (req: AnimeRequest) => {
    return req.animeName || req.anime_name || 'Unnamed Request';
  };

  const getUserName = (req: AnimeRequest) => {
    return req.user || req.userId || 'Unknown User';
  };

  const getDescription = (req: AnimeRequest) => {
    return req.description || req.additionalDetails || 'No description provided';
  };

  const getReferenceLink = (req: AnimeRequest) => {
    return req.reference_link || req.malLink;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const getCreationDate = (req: AnimeRequest) => {
    return formatDate(req.created_at || req.submittedAt);
  };

  const getUpdateDate = (req: AnimeRequest) => {
    return formatDate(req.updated_at || req.updatedAt);
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto w-full">
        <div className="flex justify-center items-center h-64">
          <div className="text-white">Loading request details...</div>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="max-w-md mx-auto w-full">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-red-400 mb-4">{error || "Request not found"}</div>
          <div className="flex gap-2">
            <button 
              onClick={fetchRequestDetails}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Retry
            </button>
            <button 
              onClick={handleBack}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {getRequestTitle(request)}
        </h2>
        <div className="text-gray-400 text-sm mb-2">
          Request ID: #{request.id}
        </div>
        <div className="text-gray-400 text-sm mb-2">
          Requested by: {getUserName(request)}
        </div>
        
        {/* Status and dates */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`capitalize px-3 py-1 rounded-lg font-bold text-sm ${
            request.status === "pending" ? "bg-yellow-700 text-yellow-200" : 
            request.status === "approved" ? "bg-green-700 text-green-200" : 
            request.status === "rejected" ? "bg-red-700 text-red-200" :
            request.status === "completed" ? "bg-purple-700 text-purple-200" :
            "bg-blue-700 text-blue-200"
          }`}>
            {request.status.replace('_', ' ')}
          </span>
          {request.priority && (
            <span className={`capitalize px-3 py-1 rounded-lg font-bold text-sm ${
              request.priority === "high" ? "bg-red-700 text-red-200" : 
              request.priority === "medium" ? "bg-yellow-700 text-yellow-200" : 
              "bg-green-700 text-green-200"
            }`}>
              {request.priority} Priority
            </span>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-gray-400 text-xs">Created Date</div>
            <div className="text-white text-sm">{getCreationDate(request)}</div>
          </div>
          <div>
            <div className="text-gray-400 text-xs">Last Updated</div>
            <div className="text-white text-sm">{getUpdateDate(request)}</div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <div className="font-semibold text-white mb-2">Description</div>
          <div className="text-gray-300 text-sm bg-gray-800 p-3 rounded-lg">
            {getDescription(request)}
          </div>
        </div>

        {/* Reference Link */}
        {getReferenceLink(request) && (
          <div className="mb-6">
            <div className="font-semibold text-white mb-2">Reference Link</div>
            <a 
              href={getReferenceLink(request)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm break-all"
            >
              {getReferenceLink(request)}
            </a>
          </div>
        )}

        {/* Status Update Section */}
        <div className="mb-6">
          <div className="font-semibold text-white mb-3">Update Status</div>
          <div className="flex flex-wrap gap-2">
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded"
              disabled={updateLoading}
            >
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
            <button 
              onClick={() => handleStatusUpdate(selectedStatus as "approved" | "rejected" | "under_review" | "completed")}
              disabled={updateLoading || selectedStatus === request.status}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded font-semibold text-sm"
            >
              {updateLoading ? "Updating..." : "Update Status"}
            </button>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex gap-2 mb-6">
          <button 
            onClick={() => handleStatusUpdate("approved")}
            disabled={updateLoading || request.status === "approved"}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded font-semibold text-sm"
          >
            {updateLoading ? "..." : "Quick Approve"}
          </button>
          <button 
            onClick={() => handleStatusUpdate("rejected")}
            disabled={updateLoading || request.status === "rejected"}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded font-semibold text-sm"
          >
            {updateLoading ? "..." : "Quick Reject"}
          </button>
        </div>

        {/* Back Button */}
        <div className="flex gap-2 pt-4 border-t border-gray-700">
          <button 
            type="button" 
            onClick={handleBack} 
            className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded font-semibold text-sm"
          >
            Back to Requests
          </button>
        </div>
      </div>
    </div>
  );
} 