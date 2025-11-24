'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { adminApi } from '@/lib/api/adminApi';
import { EpisodeReport, ReportSeverity } from '@/types/anime';
import { ReportStatusBadge } from '@/components/ui/ReportStatusBadge';
import { ReportTypeTag } from '@/components/ui/ReportTypeTag';

interface AdminReportDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function AdminReportDetailsPage({ params }: AdminReportDetailsPageProps) {
  const router = useRouter();
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [report, setReport] = useState<EpisodeReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Resolve params first
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  const getAuthToken = useCallback(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }, []);

  const fetchReportDetails = useCallback(async (reportId: string) => {
    const token = getAuthToken();
    if (!token) {
      setError('Authentication token not found. Please login.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data: EpisodeReport = await adminApi.getEpisodeReportDetails(
        token,
        parseInt(reportId, 10)
      );

      setReport(data);
    } catch (error: unknown) {
      console.error('Error fetching report details:', error);
      setError('Failed to fetch report details. Please try again.');
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, [getAuthToken]);

  useEffect(() => {
    if (resolvedParams?.id) {
      fetchReportDetails(resolvedParams.id);
    }
  }, [resolvedParams?.id, fetchReportDetails]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const handleBackClick = () => {
    router.push('/admin/reports');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="ml-2 text-white">Loading report details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto w-full">
        <button
          onClick={handleBackClick}
          className="inline-flex items-center px-3 py-2 border border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-200 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-6 transition-colors"
        >
          ← Back to Reports
        </button>

        <div className="bg-red-900/50 border border-red-600 text-red-200 px-4 py-3 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-200">Error Loading Report</h3>
              <div className="mt-2 text-sm text-red-300">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => resolvedParams?.id && fetchReportDetails(resolvedParams.id)}
                  className="bg-red-700 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium text-red-100"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto w-full">
        <button
          onClick={handleBackClick}
          className="inline-flex items-center px-3 py-2 border border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-200 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-6 transition-colors"
        >
          ← Back to Reports
        </button>

        <div className="bg-gray-900 rounded-lg p-6 text-center">
          <div className="mx-auto w-24 h-24 text-gray-400 mb-4 text-4xl">
            📋
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Report Not Found</h3>
          <p className="text-sm text-gray-400">
            The requested report could not be found or may have been deleted.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full">
      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="inline-flex items-center px-3 py-2 border border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-200 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-6 transition-colors"
      >
        ← Back to Reports
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Report #{report.id}</h2>
          {report.severity && (
            <ReportStatusBadge severity={report.severity as ReportSeverity} />
          )}
        </div>
        <p className="mt-2 text-sm text-gray-400">
          Submitted {formatDate(report.created_at)}
        </p>
      </div>

      <div className="space-y-6">
        {/* Report Details Card */}
        <div className="bg-gray-900 rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-white mb-4">
              Report Details
            </h3>
            
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-400">Report Type</dt>
                <dd className="mt-1">
                  <ReportTypeTag reportType={report.report_type} />
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-400">Severity</dt>
                <dd className="mt-1">
                  {report.severity ? (
                    <ReportStatusBadge severity={report.severity as ReportSeverity} />
                  ) : (
                    <span className="text-gray-500 text-sm">Not specified</span>
                  )}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-400">Submitted by</dt>
                <dd className="mt-1 text-sm text-gray-200">{report.user}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-400">Created Date</dt>
                <dd className="mt-1 text-sm text-gray-200">{formatDate(report.created_at)}</dd>
              </div>
              
              {report.updated_at && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-400">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-200">{formatDate(report.updated_at)}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Episode Information Card */}
        <div className="bg-gray-900 rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-white mb-4">
              Episode Information
            </h3>
            
            <div className="flex items-start space-x-4">
              {report.episode_thumbnail && (
                <div className="flex-shrink-0">
                  <Image
                    src={report.episode_thumbnail}
                    alt="Episode thumbnail"
                    width={120}
                    height={68}
                    className="rounded-md object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                {report.anime_title && (
                  <p className="text-lg font-medium text-white mb-1">
                    {report.anime_title}
                  </p>
                )}
                
                <p className="text-sm text-gray-400 mb-2">
                  Episode {report.episode_number || report.episode}
                  {report.episode_title && `: ${report.episode_title}`}
                </p>
                
                {report.episode && (
                  <Link
                    href={`/watch/${report.episode}`}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-200 bg-blue-900/30 hover:bg-blue-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Watch Episode →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Report Message Card */}
        {report.other_text && (
          <div className="bg-gray-900 rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-white mb-4">
                Additional Details
              </h3>
              
              <div className="bg-gray-800 rounded-md p-4">
                <p className="text-sm text-gray-200 whitespace-pre-wrap">
                  {report.other_text}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Report Metadata */}
        <div className="bg-gray-900 rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-white mb-4">
              System Information
            </h3>
            
            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-3">
              <div>
                <dt className="text-sm font-medium text-gray-400">Report ID</dt>
                <dd className="mt-1 text-sm text-gray-200">#{report.id}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-400">Episode ID</dt>
                <dd className="mt-1 text-sm text-gray-200">{report.episode}</dd>
              </div>
              
              {report.user_id && (
                <div>
                  <dt className="text-sm font-medium text-gray-400">User ID</dt>
                  <dd className="mt-1 text-sm text-gray-200">{report.user_id}</dd>
                </div>
              )}
              
              {report.anime_id && (
                <div>
                  <dt className="text-sm font-medium text-gray-400">Anime ID</dt>
                  <dd className="mt-1 text-sm text-gray-200">{report.anime_id}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Note about read-only */}
        <div className="bg-blue-900/30 border border-blue-700 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-blue-400">ℹ️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-200">
                This is a read-only view of the episode report. 
                Report management features are not currently available.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}