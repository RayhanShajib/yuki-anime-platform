"use client";

import { AlertCircle, CheckCircle, Send } from "lucide-react";
import { useState } from "react";

interface FormData {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    category: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const categories = [
    { value: "technical", label: "Technical Support" },
    { value: "content", label: "Content Issues" },
    { value: "partnership", label: "Partnership Inquiries" },
    { value: "feedback", label: "General Feedback" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would normally send the data to your backend
      console.log("Form submitted:", formData);

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        category: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setSubmitStatus("error");
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };

  const isFormValid =
    formData.name &&
    formData.email &&
    formData.category &&
    formData.subject &&
    formData.message;

  return (
    <div className="bg-secondary/40 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Send us a Message
        </h2>
        <p className="text-gray-300">
          Fill out the form below and we&apos;ll get back to you as soon as
          possible.
        </p>
      </div>

      {submitStatus === "success" && (
        <div className="mb-6 p-4 bg-green-900/30 border border-green-700/50 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <p className="text-green-300">
            Message sent successfully! We&apos;ll get back to you soon.
          </p>
        </div>
      )}

      {submitStatus === "error" && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-300">
            There was an error sending your message. Please try again.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name and Email Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-background/50 border border-gray-600 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none text-white placeholder-gray-400 transition-colors"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-background/50 border border-gray-600 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none text-white placeholder-gray-400 transition-colors"
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-300 mb-2">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 bg-background/50 border border-gray-600 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none text-white transition-colors">
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option
                key={category.value}
                value={category.value}
                className="bg-background">
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-300 mb-2">
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 bg-background/50 border border-gray-600 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none text-white placeholder-gray-400 transition-colors"
            placeholder="Brief description of your inquiry"
          />
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-300 mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={6}
            className="w-full px-4 py-3 bg-background/50 border border-gray-600 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none text-white placeholder-gray-400 transition-colors resize-vertical"
            placeholder="Please provide detailed information about your inquiry..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="w-full bg-primary hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send Message
            </>
          )}
        </button>
      </form>

      {/* Additional Info */}
      <div className="mt-8 p-4 bg-blue-900/20 rounded-lg border border-blue-700/30">
        <p className="text-sm text-gray-300">
          <strong className="text-blue-400">Note:</strong> For urgent technical
          issues, please email us directly at{" "}
          <a
            href="mailto:support@yuki.fr"
            className="text-primary hover:text-blue-400">
            support@yuki.fr
          </a>
          or join our Discord server for immediate community assistance.
        </p>
      </div>
    </div>
  );
}
