"use client";

import { Clock, Mail, MessageCircle, Users } from "lucide-react";

export function ContactInfo() {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get detailed help via email",
      details: [
        { label: "General Support", value: "support@yuki.fr", type: "email" },
        { label: "Admin Issues", value: "admin@yuki.fr", type: "email" },
        { label: "Partnerships", value: "partnerships@yuki.fr", type: "email" },
      ],
    },
    {
      icon: MessageCircle,
      title: "Social Media",
      description: "Connect with our community",
      details: [
        { label: "Discord", value: "Join our Discord server", type: "link" },
        { label: "Twitter", value: "@YukiAnime", type: "link" },
        { label: "Reddit", value: "r/YukiAnime", type: "link" },
      ],
    },
  ];

  const responseTime = [
    { type: "Technical Support", time: "24-48 hours" },
    { type: "General Inquiries", time: "1-3 business days" },
    { type: "Partnership Inquiries", time: "3-5 business days" },
    { type: "Social Media", time: "Real-time community support" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-6">Get in Touch</h2>
        <p className="text-gray-300 text-lg mb-8">
          We value your feedback and are committed to providing excellent
          support. Choose the method that works best for you.
        </p>
      </div>

      {/* Contact Methods */}
      <div className="space-y-6">
        {contactMethods.map((method, index) => (
          <div
            key={index}
            className="bg-secondary/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/20 rounded-lg">
                <method.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {method.title}
                </h3>
                <p className="text-gray-400 text-sm">{method.description}</p>
              </div>
            </div>

            <div className="space-y-3">
              {method.details.map((detail, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-gray-300 font-medium">
                    {detail.label}:
                  </span>
                  {detail.type === "email" ? (
                    <a
                      href={`mailto:${detail.value}`}
                      className="text-primary hover:text-blue-400 transition-colors font-medium">
                      {detail.value}
                    </a>
                  ) : (
                    <span className="text-primary font-medium">
                      {detail.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Response Times */}
      <div className="bg-secondary/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-accent/20 rounded-lg">
            <Clock className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Response Times</h3>
            <p className="text-gray-400 text-sm">
              Expected response times for different inquiry types
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {responseTime.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-gray-300 font-medium">{item.type}:</span>
              <span className="text-accent font-medium">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-blue-900/20 backdrop-blur-sm rounded-xl p-6 border border-blue-700/50">
        <div className="flex items-center gap-3 mb-3">
          <Users className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">
            Community Support
          </h3>
        </div>
        <p className="text-gray-300 text-sm">
          Join our Discord server for real-time help from our community and
          moderators. Many common questions are answered quickly by fellow anime
          enthusiasts!
        </p>
      </div>
    </div>
  );
}
