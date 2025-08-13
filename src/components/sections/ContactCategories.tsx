"use client";

import { Bug, Handshake, Heart, Mail, MessageCircle } from "lucide-react";

interface Category {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  email: string;
  examples: string[];
}

const categories: Category[] = [
  {
    icon: Bug,
    title: "Technical Support",
    description: "Get help with bugs, playback issues, and account problems",
    email: "support@yuki.fr",
    examples: [
      "Video playback issues",
      "Login problems",
      "App crashes",
      "Account recovery",
    ],
  },
  {
    icon: MessageCircle,
    title: "Content Issues",
    description:
      "Report missing content, incorrect information, or quality issues",
    email: "support@yuki.fr",
    examples: [
      "Missing episodes",
      "Wrong subtitles",
      "Poor video quality",
      "Incorrect metadata",
    ],
  },
  {
    icon: Handshake,
    title: "Partnership Inquiries",
    description:
      "Explore business partnerships and content licensing opportunities",
    email: "partnerships@yuki.fr",
    examples: [
      "Content licensing",
      "Studio partnerships",
      "Distribution deals",
      "Business collaboration",
    ],
  },
  {
    icon: Heart,
    title: "General Feedback",
    description: "Share your suggestions, compliments, and general questions",
    email: "support@yuki.fr",
    examples: [
      "Feature requests",
      "UI/UX feedback",
      "Compliments",
      "General questions",
    ],
  },
];

export function ContactCategories() {
  return (
    <section className="py-16 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            How Can We Help You?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Choose the category that best describes your inquiry to get the
            fastest response
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-secondary/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-primary/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/20 rounded-lg mb-4">
                <category.icon className="w-6 h-6 text-primary" />
              </div>

              <h3 className="text-xl font-semibold text-white mb-2">
                {category.title}
              </h3>

              <p className="text-gray-300 text-sm mb-4">
                {category.description}
              </p>

              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-4 h-4 text-primary" />
                <a
                  href={`mailto:${category.email}`}
                  className="text-primary hover:text-blue-400 transition-colors text-sm font-medium">
                  {category.email}
                </a>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-2 font-medium">
                  Examples:
                </p>
                <ul className="text-xs text-gray-400 space-y-1">
                  {category.examples.map((example, idx) => (
                    <li key={idx} className="flex items-center gap-1">
                      <span className="w-1 h-1 bg-primary rounded-full flex-shrink-0"></span>
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
