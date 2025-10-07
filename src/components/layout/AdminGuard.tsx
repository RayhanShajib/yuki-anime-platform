"use client";

import { pageApi } from "@/lib/api/pageApi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AdminGuardProps {
  children: React.ReactNode;
}

interface ProfileData {
  username: string;
  email: string;
  role?: string;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        setIsLoading(true);

        // Get token from localStorage
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.log("No access token found - redirecting to home");
          router.push("/");
          return;
        }

        // Fetch profile data to check user role
        const profileData: ProfileData = await pageApi.getProfilePageData(
          token
        );

        // Check if user has admin role (allow multiple admin role variations)
        const adminRoles = ["admin"];
        const userRole = profileData.role?.toLowerCase() || "user";

        if (adminRoles.includes(userRole)) {
          console.log(
            "Admin access granted for user:",
            profileData.username,
            "with role:",
            profileData.role
          );
          setIsAuthorized(true);
        } else {
          console.log("Access denied - user role:", profileData.role || "user");
          router.push("/");
          return;
        }
      } catch (error: unknown) {
        console.error("Error checking admin access:", error);

        // Handle token validation errors
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        if (
          errorMessage.includes("token_not_valid") ||
          errorMessage.includes("401")
        ) {
          console.log("Invalid token - redirecting to login");
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          router.push("/login");
        } else {
          console.log("Error checking permissions - redirecting to home");
          router.push("/");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAccess();
  }, [router]);

  // Show loading spinner while checking authorization
  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white/70">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Show nothing if not authorized (user is being redirected)
  if (!isAuthorized) {
    return null;
  }

  // Render children if authorized
  return <>{children}</>;
}
