"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Lock, Mail, Check } from "lucide-react";
import Image from "next/image";
import { pageApi } from "@/lib/api/pageApi";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.agreeToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy");
      return;
    }

    setIsLoading(true);

    try {
      const response = await pageApi.registerAccount(
        formData.username,
        formData.email,
        formData.password,
        formData.confirmPassword
      );

      // Registration successful
      console.log("Registration successful:", response);

      // Redirect to login page with success message
      router.push("/login?registered=true");
    } catch (error: unknown) {
      console.error("Registration error:", error);

      // Handle different types of errors
      if (error && typeof error === "object" && "username" in error) {
        const errorObj = error as Record<string, string[]>;
        setFieldErrors({ username: errorObj.username[0] });
      } else if (error && typeof error === "object" && "password" in error) {
        const errorObj = error as Record<string, string>;
        setError(errorObj.password);
      } else {
        const errorMessage =
          error && typeof error === "object" && "detail" in error
            ? (error as { detail: string }).detail
            : "Registration failed. Please try again.";
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const passwordsMatch = formData.password === formData.confirmPassword;
  const passwordValid = formData.password.length >= 8;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="relative h-[80px] w-[200px]">
              <Image
                className="text-transparent absolute -top-[26px] left-0 overflow-hidden"
                width={200}
                height={100}
                src="/logo.png"
                alt="Logo"
              />
            </div>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-white/90 txt-heading">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Join thousands of anime fans on Yuki
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error Display */}
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
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
                    if (fieldErrors.username) {
                      setFieldErrors({ ...fieldErrors, username: "" });
                    }
                    if (error) setError("");
                  }}
                  className={`w-full pl-10 pr-3 py-3 bg-gray-700 border rounded-lg text-white/90 placeholder-gray-400 focus:outline-none focus:border-transparent ${
                    fieldErrors.username ? "border-red-500" : "border-gray-600"
                  }`}
                  placeholder="Choose a username"
                />
              </div>
              {fieldErrors.username && (
                <p className="mt-2 text-sm text-red-400">
                  {fieldErrors.username}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-400 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (error) setError("");
                  }}
                  className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white/90 focus:outline-none placeholder-gray-400  focus:border-transparent"
                  placeholder="Enter your email"
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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (error) setError("");
                  }}
                  className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white/90 focus:outline-none placeholder-gray-400 "
                  placeholder="Create a password"
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
              {formData.password && (
                <div className="mt-2 text-xs">
                  <div
                    className={`flex items-center ${
                      passwordValid ? "text-green-400" : "text-red-400"
                    }`}>
                    <Check className="h-3 w-3 mr-1" />
                    At least 8 characters
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-400 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    });
                    if (error) setError("");
                  }}
                  className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white/90 placeholder-gray-400 focus:outline-none focus:border-transparent"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && (
                <div className="mt-2 text-xs">
                  <div
                    className={`flex items-center ${
                      passwordsMatch ? "text-green-400" : "text-red-400"
                    }`}>
                    <Check className="h-3 w-3 mr-1" />
                    Passwords match
                  </div>
                </div>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="flex items-center">
              <input
                id="agree-terms"
                name="agree-terms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) =>
                  setFormData({ ...formData, agreeToTerms: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700 rounded"
              />
              <label
                htmlFor="agree-terms"
                className="ml-2 block text-sm text-gray-400">
                I agree to the{" "}
                <Link href="/terms" className="text-pink">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-pink">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                !formData.agreeToTerms ||
                !passwordValid ||
                !passwordsMatch ||
                isLoading
              }
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium btn-purple focus:outline-none focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-pink font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
