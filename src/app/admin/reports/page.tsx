'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/api/adminApi';
import { EpisodeReport, EpisodeReportListResponse, ReportSeverity } from '@/types/anime';
import { ReportStatusBadge } from '@/components/ui/ReportStatusBadge';
import { ReportTypeTag } from '@/components/ui/ReportTypeTag';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<EpisodeReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const limit = 20;

  const getAuthToken = useCallback(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }, []);

  const fetchReports = useCallback(async (severity: string, page: number) => {
    const token = getAuthToken();
    if (!token) {
      setError('Authentication token not found. Please login.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const offset = (page - 1) * limit;
      const data: EpisodeReportListResponse = await adminApi.getAllEpisodeReports(
        token,
        severity,
        limit.toString(),
        offset.toString()
      );

      setReports(data.results || []);
      setTotalCount(data.count || 0);
      setHasNext(!!data.next);
      setHasPrevious(!!data.previous);
    } catch (error: unknown) {
      console.error('Error fetching reports:', error);
      setError('Failed to fetch episode reports. Please try again.');
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [getAuthToken, limit]);

  useEffect(() => {
    fetchReports(selectedSeverity, currentPage);
  }, [selectedSeverity, currentPage, fetchReports]);

  const handleSeverityChange = (severity: string) => {
    setSelectedSeverity(severity);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleNextPage = () => {
    if (hasNext) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (hasPrevious) {
      setCurrentPage(prev => Math.max(1, prev - 1));
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getDisplayedRange = () => {
    const start = (currentPage - 1) * limit + 1;
    const end = Math.min(currentPage * limit, totalCount);
    return { start, end };
  };

  const { start, end } = getDisplayedRange();

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="ml-2 text-white">Loading episode reports...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Episode Reports ({totalCount})
        </h2>
        
        {/* Filters */}
        <div className="flex items-center gap-2">
          <label htmlFor="severity-filter" className="text-gray-200 text-sm">
            Severity:
          </label>
          <select
            id="severity-filter"
            value={selectedSeverity}
            onChange={(e) => handleSeverityChange(e.target.value)}
            className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-1 text-sm"
          >
            <option value="">All Severities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div className="text-gray-400 text-sm">
          {totalCount > 0 ? (
            <>Showing {start}-{end} of {totalCount} reports</>
          ) : (
            'No reports found'
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-900/50 border border-red-600 text-red-200 px-4 py-3 rounded-lg mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-200">Error Loading Reports</h3>
              <div className="mt-2 text-sm text-red-300">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => fetchReports(selectedSeverity, currentPage)}
                  className="bg-red-700 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium text-red-100"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reports Table */}
      {!error && reports.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 rounded-xl overflow-hidden text-left text-sm md:text-base">
              <thead className="bg-gray-800 text-gray-200">
                <tr>
                  <th className="p-3">Report ID</th>
                  <th className="p-3">Episode</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-b border-gray-800 hover:bg-gray-800/60 transition-colors">
                    <td className="p-3 text-white font-semibold">#{report.id}</td>
                    <td className="p-3">
                      <div>
                        {report.anime_title && (
                          <div className="font-medium text-white truncate max-w-32">{report.anime_title}</div>
                        )}
                        <div className="text-gray-400">
                          Episode {report.episode_number || report.episode}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <ReportTypeTag reportType={report.report_type} />
                    </td>
                    <td className="p-3">
                      {report.severity ? (
                        <ReportStatusBadge severity={report.severity as ReportSeverity} />
                      ) : (
                        <span className="text-gray-400 text-xs">No severity</span>
                      )}
                    </td>
                    <td className="p-3 text-gray-200">{report.user}</td>
                    <td className="p-3 text-gray-400">{formatDate(report.created_at)}</td>
                    <td className="p-3">
                      <Link
                        href={`/admin/reports/${report.id}`}
                        className="px-2 py-1 bg-gray-700 hover:bg-gray-800 text-white rounded text-xs transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
            <button
              onClick={handlePreviousPage}
              disabled={!hasPrevious}
              className="flex items-center gap-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded text-sm transition-colors"
            >
              Previous
            </button>

            <span className="px-3 py-2 text-gray-400 text-sm">
              Page {currentPage}
            </span>

            <button
              onClick={handleNextPage}
              disabled={!hasNext}
              className="flex items-center gap-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded text-sm transition-colors"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Empty State */}
      {!error && reports.length === 0 && !loading && (
        <div className="bg-gray-900 rounded-lg p-12 text-center">
          <div className="mx-auto w-24 h-24 text-gray-400 mb-4 text-4xl">
            📋
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No Reports Found</h3>
          <p className="text-sm text-gray-400 mb-4">
            {selectedSeverity 
              ? `No ${selectedSeverity} severity reports found.`
              : 'No episode reports have been submitted yet.'
            }
          </p>
          {selectedSeverity && (
            <button
              onClick={() => handleSeverityChange('')}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}