"use client";

import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { pageApi } from "@/lib/api/pageApi";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Call the login API
      const response = await pageApi.getAuthToken(formData.username, formData.password);
      
      // Check if response has access and refresh tokens (successful login)
      if (response.access && response.refresh) {
        // Store tokens in localStorage
        localStorage.setItem("access_token", response.access);
        localStorage.setItem("refresh_token", response.refresh);
        
        // If remember me is checked, you might want to store tokens in cookies as well
        if (formData.rememberMe) {
          // Set cookies with longer expiration
          document.cookie = `access_token=${response.access}; max-age=${30 * 24 * 60 * 60}; path=/`; // 30 days
          document.cookie = `refresh_token=${response.refresh}; max-age=${30 * 24 * 60 * 60}; path=/`; // 30 days
        }
        
        // Redirect to home page or intended page
        router.push("/");
      } else {
        // Handle unexpected response format
        setError("Login failed. Please try again.");
      }
    } catch (error: unknown) {
      console.error("Error during login:", error);
      
      // Handle specific error messages from API
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      if (errorMessage.includes("No active account found")) {
        setError("Invalid username or password. Please check your credentials.");
      } else if (errorMessage.includes("detail")) {
        // Try to extract the detail message from API response
        setError("Login failed. Please check your credentials.");
      } else {
        setError("An error occurred during login. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSwitch = (showForgot: boolean) => {
    setShowForgotPassword(showForgot);
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Handle the actual password reset logic
      console.log("Forgot password email:", forgotPasswordEmail);

      // Here you would normally handle the actual password reset logic
      alert("Password reset link sent!");
    } catch (error) {
      console.error("Error during password reset:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div><Image width={200} height={100} src="/logo.png" alt="Logo" /></div>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-white/90">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to continue watching your favorite anime
          </p>
        </div>

        {/* Dynamic Form Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
          {!showForgotPassword ? (
            // Login Form
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Error Display */}
              {error && (
                <div className="bg-red-600/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Username Field */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-400 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={formData.username}
                    onChange={(e) => {
                      setFormData({ ...formData, username: e.target.value });
                      setError(""); // Clear error when user types
                    }}
                    className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-400 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      setError(""); // Clear error when user types
                    }}
                    className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between flex-wrap gap-2.5">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) =>
                      setFormData({ ...formData, rememberMe: e.target.checked })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-400">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => handleFormSwitch(true)}
                    className="text-pink">
                    Forgot your password?
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                  isLoading 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'btn-purple hover:bg-blue-700'
                }`}>
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>
          ) : (
            // Forgot Password Form
            <form className="space-y-6" onSubmit={handleForgotPasswordSubmit}>
              {/* Back Button */}
              <div className="flex items-center space-x-2 mb-4">
                <button
                  type="button"
                  onClick={() => handleFormSwitch(false)}
                  className="flex items-center text-gray-400 hover:text-gray-300 transition-colors">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to login
                </button>
              </div>

              {/* Forgot Password Title */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white/90">
                  Reset your password
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  Enter your email address and we&apos;ll send you a link to
                  reset your password.
                </p>
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="forgot-email"
                  className="block text-sm font-medium text-gray-400 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="forgot-email"
                    name="forgot-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Send Button */}
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white/90 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                Send reset link
              </button>
            </form>
          )}
        </div>

        {/* Sign Up Link - Only show when not in forgot password mode */}
        {!showForgotPassword && (
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Don&#39;t have an account?{" "}
              <Link
                href="/register"
                className="text-pink font-medium">
                Sign up for free
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
