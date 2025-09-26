import { Navigation } from "@/components/layout/Navigation";
import { ContactCategories } from "@/components/sections/ContactCategories";
import { FooterSection } from "@/components/sections/FooterSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Yuki",
  description:
    "Get in touch with the Yuki team for support, partnerships, and feedback.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We are here to help! Reach out to us for support, feedback,
              partnerships, or any questions about the Yuki anime streaming
              platform.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Categories */}
      <ContactCategories />

      <FooterSection />
    </div>
  );
}
