"use client";

import { useState, useCallback } from "react";

export interface CaptchaState {
  isVerified: boolean;
  token: string | null;
  onSuccess: (token: string) => void;
  onError: () => void;
  onExpire: () => void;
  reset: () => void;
}

/**
 * Custom hook for managing Cloudflare Turnstile captcha state
 * Provides consistent token management across all forms
 */
export function useCaptcha(): CaptchaState {
  const [isVerified, setIsVerified] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const onSuccess = useCallback((captchaToken: string) => {
    setToken(captchaToken);
    setIsVerified(true);
  }, []);

  const onError = useCallback(() => {
    setToken(null);
    setIsVerified(false);
  }, []);

  const onExpire = useCallback(() => {
    setToken(null);
    setIsVerified(false);
  }, []);

  const reset = useCallback(() => {
    setToken(null);
    setIsVerified(false);
  }, []);

  return {
    isVerified,
    token,
    onSuccess,
    onError,
    onExpire,
    reset,
  };
}

/**
 * Utility function to validate captcha token before form submission
 */
export function validateCaptchaToken(token: string | null, isVerified: boolean): string | null {
  if (!isVerified || !token) {
    return "Please complete the CAPTCHA verification";
  }
  return null;
}