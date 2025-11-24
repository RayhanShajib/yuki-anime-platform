"use client";

import { useState } from "react";
import { X, AlertCircle, Send, Loader2 } from "lucide-react";
import { ReportType, REPORT_TYPE_LABELS, EpisodeReportPayload } from "@/types/anime";

interface EpisodeReportModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  onSubmitAction: (data: EpisodeReportPayload) => Promise<void>;
  episodeId: number;
  episodeTitle?: string;
  isLoading: boolean;
  error?: string | null;
}

export default function EpisodeReportModal({
  isOpen,
  onCloseAction,
  onSubmitAction,
  episodeId,
  episodeTitle,
  isLoading,
  error,
}: EpisodeReportModalProps) {
  const [selectedType, setSelectedType] = useState<ReportType | "">("");
  const [otherDetails, setOtherDetails] = useState("");
  const [description, setDescription] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation
    if (!selectedType) {
      setValidationError("Please select a report type");
      return;
    }

    if (selectedType === "other" && !otherDetails.trim()) {
      setValidationError("Please provide details for the issue");
      return;
    }

    // Prepare submission data
    const reportData: EpisodeReportPayload = {
      report_type: selectedType,
      other_text: selectedType === "other" ? otherDetails.trim() : description.trim(),
    };

    try {
      await onSubmitAction(reportData);
      // Reset form on successful submission
      setSelectedType("");
      setOtherDetails("");
      setDescription("");
    } catch (err) {
      // Error is handled by parent component
      console.error("Report submission error:", err);
    }
  };

  const handleClose = () => {
    setSelectedType("");
    setOtherDetails("");
    setDescription("");
    setValidationError(null);
    onCloseAction();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <h2 className="text-xl font-bold text-white">Report Episode Issue</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Episode Info */}
          <div className="mb-4 p-3 bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-300">
              <span className="font-medium text-white">Episode ID:</span> {episodeId}
            </p>
            {episodeTitle && (
              <p className="text-sm text-gray-300 mt-1">
                <span className="font-medium text-white">Title:</span> {episodeTitle}
              </p>
            )}
          </div>

          {/* Error Messages */}
          {(validationError || error) && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
              <p className="text-red-300 text-sm">{validationError || error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Report Type Selection */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Select Issue Type <span className="text-red-400">*</span>
              </label>
              <div className="space-y-2">
                {(Object.keys(REPORT_TYPE_LABELS) as ReportType[]).map((type) => (
                  <label
                    key={type}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedType === type
                        ? "bg-red-600/20 border-red-500/50 text-red-300"
                        : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportType"
                      value={type}
                      checked={selectedType === type}
                      onChange={(e) => setSelectedType(e.target.value as ReportType)}
                      className="sr-only"
                      disabled={isLoading}
                    />
                    <div
                      className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                        selectedType === type
                          ? "border-red-400 bg-red-400"
                          : "border-gray-400"
                      }`}
                    >
                      {selectedType === type && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className="text-sm">{REPORT_TYPE_LABELS[type]}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Other Details (shown only when "other" is selected) */}
            {selectedType === "other" && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Describe the Issue <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={otherDetails}
                  onChange={(e) => setOtherDetails(e.target.value)}
                  placeholder="Please describe the issue you're experiencing..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 resize-none"
                  rows={3}
                  disabled={isLoading}
                  required
                />
              </div>
            )}

            {/* Additional Description (optional for non-other types) */}
            {selectedType && selectedType !== "other" && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Additional Details (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Any additional information about the issue..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 resize-none"
                  rows={2}
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                disabled={isLoading || !selectedType}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Report
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <p className="text-blue-300 text-sm">
              <strong>Note:</strong> Your report helps us improve video quality and fix playback issues. 
              We review all reports and work to resolve problems as quickly as possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}