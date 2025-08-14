"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState } from "react";

interface RequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestModal({ open, onOpenChange }: RequestModalProps) {
  const [formData, setFormData] = useState({
    animeName: "",
    malLink: "",
    additionalDetails: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.animeName.trim()) {
      alert("Please enter an anime name");
      return;
    }

    if (!captchaVerified) {
      alert("Please complete the CAPTCHA verification");
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would implement the actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

      // Reset form and close modal on success
      setFormData({
        animeName: "",
        malLink: "",
        additionalDetails: "",
      });
      setCaptchaVerified(false);
      onOpenChange(false);
      alert("Request submitted successfully!");
    } catch {
      alert("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle escape key to close modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && !isSubmitting) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay with higher z-index than navbar */}
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] animate-in fade-in-0 duration-300" />

        {/* Modal Content */}
        <Dialog.Content
          className="fixed left-[50%] top-[50%] z-[201] w-full max-w-md md:max-w-lg translate-x-[-50%] translate-y-[-50%] bg-gray-900 border border-gray-700 rounded-lg shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300 mx-4 max-h-[90vh] overflow-auto"
          onKeyDown={handleKeyDown}>
          <div className="p-4 md:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <Dialog.Title className="text-xl md:text-2xl font-bold text-white">
                Send Request
              </Dialog.Title>
              <Dialog.Close className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-gray-800">
                <X className="w-5 h-5" />
              </Dialog.Close>
            </div>

            {/* Subtitle */}
            <p className="text-gray-500 text-[14px] mb-4 leading-relaxed">
              If you can&apos;t find your favourite anime in our library, please
              submit a request. We will try to make it available as soon as
              possible.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Anime Name Field */}
              <div>
                <input
                  type="text"
                  id="animeName"
                  name="animeName"
                  value={formData.animeName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter anime name..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none transition-all"
                />
              </div>

              {/* MAL/AL/AniDB Link Field */}
              <div>
                <input
                  type="url"
                  id="malLink"
                  name="malLink"
                  value={formData.malLink}
                  onChange={handleInputChange}
                  placeholder="https://myanimelist.net/anime/..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none transition-all"
                />
              </div>

              {/* Additional Details Field */}
              <div>
                <textarea
                  id="additionalDetails"
                  name="additionalDetails"
                  value={formData.additionalDetails}
                  onChange={handleInputChange}
                  rows={4}
                  maxLength={1000}
                  placeholder="Provide any additional information about your request..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none transition-all resize-none"
                />
                <div className="text-right text-xs text-gray-400 mt-1">
                  {formData.additionalDetails.length}/1000 characters
                </div>
              </div>


              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !captchaVerified}
                  className="w-full px-6 py-3 bg-accent hover:bg-accent/90 disabled:bg-accent/50 disabled:cursor-not-allowed text-white font-medium rounded-md transition-all text-base focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900">
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
