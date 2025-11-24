"use client";

import { pageApi } from "@/lib/api/pageApi";
import * as Dialog from "@radix-ui/react-dialog";
import { AlertCircle, CheckCircle, X } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";
import { useState } from "react";

interface RequestModalProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

type NotificationType = "success" | "error" | null;

export function RequestModal({ open, onOpenChangeAction }: RequestModalProps) {
  const [formData, setFormData] = useState({
    animeName: "",
    malLink: "",
    additionalDetails: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [notification, setNotification] = useState<{
    type: NotificationType;
    message: string;
  }>({ type: null, message: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.animeName.trim()) {
      errors.animeName = "Anime name is required";
    }

    if (!captchaVerified) {
      errors.captcha = "Please complete the CAPTCHA verification";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      setNotification({
        type: "error",
        message: "Please fix the errors below",
      });
      return;
    }

    // Check if user is authenticated
    const token = localStorage.getItem("access_token");
    if (!token) {
      setNotification({
        type: "error",
        message: "Please log in to submit a request",
      });
      setFieldErrors({ auth: "Not authenticated" });
      return;
    }

    setIsSubmitting(true);
    setNotification({ type: null, message: "" });

    try {
      await pageApi.createAnimeRequest(
        token,
        formData.animeName,
        formData.malLink,
        formData.additionalDetails
      );

      // Reset form and close modal on success
      setFormData({
        animeName: "",
        malLink: "",
        additionalDetails: "",
      });
      setCaptchaVerified(false);
      setFieldErrors({});

      setNotification({
        type: "success",
        message: "Request submitted successfully! We'll review it soon.",
      });

      // Close modal after a short delay to show success message
      setTimeout(() => {
        onOpenChangeAction(false);
        setNotification({ type: null, message: "" });
      }, 2000);
    } catch (error: unknown) {
      console.error("Error submitting request:", error);

      let errorMessage = "Failed to submit request. Please try again.";

      if (error && typeof error === "object") {
        const apiError = error as {
          status?: number;
          message?: string;
          data?: unknown;
        };

        // Log error details for debugging
        console.error("API Error Details:", {
          status: apiError.status,
          message: apiError.message,
          data: apiError.data,
        });

        if (apiError.status === 400) {
          errorMessage =
            "Invalid request. Please check your inputs and try again.";
        } else if (apiError.status === 401) {
          errorMessage = "Your session has expired. Please log in again.";
        } else if (apiError.status === 403) {
          errorMessage = "You don't have permission to submit requests.";
        } else if (apiError.status === 429) {
          errorMessage = "Too many requests. Please wait a moment and try again.";
        } else if (apiError.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (apiError.message) {
          errorMessage = apiError.message;
        }
      } else if (error instanceof Error) {
        console.error("Error message:", error.message);
        errorMessage = error.message;
      }

      setNotification({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle escape key to close modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && !isSubmitting) {
      onOpenChangeAction(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChangeAction}>
      <Dialog.Portal>
        {/* Overlay with higher z-index than navbar */}
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] animate-in fade-in-0 duration-300" />

        {/* Modal Content */}
        <Dialog.Content
          className="fixed left-[50%] top-[50%] z-[201] w-[90%] max-w-md md:max-w-lg translate-x-[-50%] translate-y-[-50%] bg-[#171125] border border-gray-700 rounded-lg shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300 overflow-auto max-h-[90vh]"
          onKeyDown={handleKeyDown}>
          <div className="p-4 md:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <Dialog.Title className="text-xl md:text-2xl font-bold text-white">
                Send Request
              </Dialog.Title>
              <Dialog.Close
                disabled={isSubmitting}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-gray-800 disabled:opacity-50">
                <X className="w-5 h-5" />
              </Dialog.Close>
            </div>

            {/* Subtitle */}
            <p className="text-gray-500 text-[14px] mb-4 leading-relaxed">
              If you can&apos;t find your favourite anime in our library, please
              submit a request. We will try to make it available as soon as
              possible.
            </p>

            {/* Notification Messages */}
            {notification.type && (
              <div
                className={`mb-4 p-3 rounded-md flex items-start gap-2 ${
                  notification.type === "success"
                    ? "bg-green-900/30 border border-green-700 text-green-100"
                    : "bg-red-900/30 border border-red-700 text-red-100"
                }`}>
                {notification.type === "success" ? (
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                )}
                <span className="text-sm">{notification.message}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Anime Name Field */}
              <div className="w-full">
                <label
                  htmlFor="animeName"
                  className="block text-sm font-medium text-gray-300 mb-1">
                  Anime Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="animeName"
                  name="animeName"
                  value={formData.animeName}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  required
                  placeholder="Enter anime name..."
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white placeholder-gray-500 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    fieldErrors.animeName
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-600 focus:border-accent"
                  }`}
                />
                {fieldErrors.animeName && (
                  <p className="text-xs text-red-400 mt-1">
                    {fieldErrors.animeName}
                  </p>
                )}
              </div>

              {/* MAL/AL/AniDB Link Field */}
              <div className="w-full">
                <label
                  htmlFor="malLink"
                  className="block text-sm font-medium text-gray-300 mb-1">
                  MAL/AniList Link{" "}
                  <span className="text-gray-500">(Optional)</span>
                </label>
                <input
                  type="url"
                  id="malLink"
                  name="malLink"
                  value={formData.malLink}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="https://myanimelist.net/anime/..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:border-accent"
                />
              </div>

              {/* Additional Details Field */}
              <div className="w-full">
                <label
                  htmlFor="additionalDetails"
                  className="block text-sm font-medium text-gray-300 mb-1">
                  Additional Details{" "}
                  <span className="text-gray-500">(Optional)</span>
                </label>
                <textarea
                  id="additionalDetails"
                  name="additionalDetails"
                  value={formData.additionalDetails}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  rows={4}
                  maxLength={1000}
                  placeholder="Provide any additional information about your request..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:border-accent resize-none"
                />
                <div className="text-right text-xs text-gray-400 mt-1">
                  {formData.additionalDetails.length}/1000 characters
                </div>
              </div>

              {/* Cloudflare Turnstile CAPTCHA */}
              <div className="w-full">
                {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? (
                  <Turnstile
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                    onSuccess={() => setCaptchaVerified(true)}
                    onError={() => setCaptchaVerified(false)}
                    onExpire={() => setCaptchaVerified(false)}
                  />
                ) : (
                  <div className="bg-yellow-900/30 border border-yellow-700 rounded-md p-3 text-yellow-100 text-sm">
                    CAPTCHA site key not configured. Please add NEXT_PUBLIC_TURNSTILE_SITE_KEY to .env.local
                  </div>
                )}
              </div>

              {/* CAPTCHA Notice */}
              {fieldErrors.captcha && (
                <div className="bg-red-900/30 border border-red-700 rounded-md p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-400" />
                  <p className="text-xs text-red-100">{fieldErrors.captcha}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !captchaVerified}
                  className="w-full px-6 py-3 btn-purple disabled:btn-purple disabled:cursor-not-allowed text-white font-medium rounded-md transition-all text-base focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900">
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending Request...</span>
                    </div>
                  ) : (
                    "Send Request"
                  )}
                </button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
