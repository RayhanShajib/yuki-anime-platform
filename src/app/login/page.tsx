"use client";

import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Define the reCAPTCHA object type
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
    };
  }
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [isVerifyingCaptcha, setIsVerifyingCaptcha] = useState(false);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [isRecaptchaLoaded, setIsRecaptchaLoaded] = useState(false);

  // Load reCAPTCHA v3 script
  useEffect(() => {
    const loadRecaptcha = () => {
      if (typeof window !== "undefined" && !window.grecaptcha) {
        const script = document.createElement("script");
        script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
        script.onload = () => {
          window.grecaptcha.ready(() => {
            setIsRecaptchaLoaded(true);
          });
        };
        document.head.appendChild(script);
      } else if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          setIsRecaptchaLoaded(true);
        });
      }
    };

    loadRecaptcha();
  }, []);

  // Execute reCAPTCHA v3
  const executeRecaptcha = async (action: string): Promise<string | null> => {
    if (!isRecaptchaLoaded || !window.grecaptcha) {
      setCaptchaError("reCAPTCHA not loaded. Please refresh the page.");
      return null;
    }

    try {
      const token = await window.grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "",
        { action }
      );
      return token;
    } catch (error) {
      console.error("reCAPTCHA execution failed:", error);
      setCaptchaError("reCAPTCHA verification failed. Please try again.");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsVerifyingCaptcha(true);
    setCaptchaError(null);

    try {
      // Execute reCAPTCHA v3
      const token = await executeRecaptcha("login");

      if (!token) {
        setIsVerifyingCaptcha(false);
        return;
      }

      // Verify reCAPTCHA with our API
      const verifyResponse = await fetch("/api/verify-recaptcha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const verifyResult = await verifyResponse.json();

      if (!verifyResult.success) {
        setCaptchaError("Security verification failed. Please try again.");
        return;
      }

      // reCAPTCHA verification successful, proceed with login
      console.log("Login attempt:", formData);
      console.log("reCAPTCHA verified with score:", verifyResult.score);

      // Here you would normally handle the actual login logic
      // For now, we'll just log success
      alert("Login successful! Security verified.");
    } catch (error) {
      console.error("Error during login:", error);
      setCaptchaError("An error occurred. Please try again.");
    } finally {
      setIsVerifyingCaptcha(false);
    }
  };

  const handleFormSwitch = (showForgot: boolean) => {
    setShowForgotPassword(showForgot);
    // Reset any error states when switching forms
    setCaptchaError(null);
    setIsVerifyingCaptcha(false);
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsVerifyingCaptcha(true);
    setCaptchaError(null);

    try {
      // Execute reCAPTCHA v3
      const token = await executeRecaptcha("forgot_password");

      if (!token) {
        setIsVerifyingCaptcha(false);
        return;
      }

      // Verify reCAPTCHA with our API
      const verifyResponse = await fetch("/api/verify-recaptcha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const verifyResult = await verifyResponse.json();

      if (!verifyResult.success) {
        setCaptchaError("Security verification failed. Please try again.");
        return;
      }

      // reCAPTCHA verification successful, proceed with password reset
      console.log("Forgot password email:", forgotPasswordEmail);
      console.log("reCAPTCHA verified with score:", verifyResult.score);

      // Here you would normally handle the actual password reset logic
      alert("Password reset link sent! Security verified.");
    } catch (error) {
      console.error("Error during password reset:", error);
      setCaptchaError("An error occurred. Please try again.");
    } finally {
      setIsVerifyingCaptcha(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="text-4xl font-bold text-blue-500">雪</div>
            <span className="text-2xl font-semibold text-white/90">Yuki</span>
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
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
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
                    className="text-blue-400 hover:text-blue-300">
                    Forgot your password?
                  </button>
                </div>
              </div>

              {/* reCAPTCHA v3 Status */}
              <div>
                <div className="flex flex-col items-center space-y-2">
                  {!isRecaptchaLoaded ? (
                    <div className="flex items-center space-x-2 text-yellow-400 text-sm">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
                      <span>Loading security verification...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-green-400 text-sm">
                      <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span>Security verification ready</span>
                    </div>
                  )}
                  {isVerifyingCaptcha && (
                    <div className="flex items-center space-x-2 text-blue-400 text-sm">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                      <span>Verifying security check...</span>
                    </div>
                  )}
                </div>
                {captchaError && (
                  <p className="mt-2 text-sm text-red-400 text-center">
                    {captchaError}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isVerifyingCaptcha || !isRecaptchaLoaded}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white/90 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {isVerifyingCaptcha ? "Verifying..." : "Sign in"}
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

              {/* reCAPTCHA v3 Status */}
              <div>
                <div className="flex flex-col items-center space-y-2">
                  {!isRecaptchaLoaded ? (
                    <div className="flex items-center space-x-2 text-yellow-400 text-sm">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
                      <span>Loading security verification...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-green-400 text-sm">
                      <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span>Security verification ready</span>
                    </div>
                  )}
                  {isVerifyingCaptcha && (
                    <div className="flex items-center space-x-2 text-blue-400 text-sm">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                      <span>Verifying security check...</span>
                    </div>
                  )}
                </div>
                {captchaError && (
                  <p className="mt-2 text-sm text-red-400 text-center">
                    {captchaError}
                  </p>
                )}
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={isVerifyingCaptcha || !isRecaptchaLoaded}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white/90 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {isVerifyingCaptcha ? "Verifying..." : "Send reset link"}
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
                className="text-blue-400 hover:text-blue-300 font-medium">
                Sign up for free
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
