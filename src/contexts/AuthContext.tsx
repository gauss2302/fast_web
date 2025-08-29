"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  useSession,
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
} from "next-auth/react";
import type {
  User,
  AuthContextType,
  RegisterData,
  LoginData,
} from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
      return;
    }
    if (session) {
      if ((session as any).backendUser) {
        setUser((session as any).backendUser);
        setLoading(false);
      } else {
        fetchUserData();
      }
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else if (response.status === 401) {
        await signOut();
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (
    credentials: LoginData
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await nextAuthSignIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        return { success: false, error: "Invalid credentials" };
      }

      if (result?.ok) {
        await fetchUserData();
        return { success: true };
      }
      return { success: false, error: "Authentication failed" };
    } catch (e) {
      return {
        success: false,
        error: "An unexpected error occurred for login",
      };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await nextAuthSignOut({ redirect: false });
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const register = async (
    data: RegisterData
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        return { success: true };
      } else {
        return {
          success: false,
          error: result.message || "Registration failed",
        };
      }
    } catch (e) {
      return { success: false, error: "An unexpected error occurred for reg" };
    }
  };

  const refreshUser = async (): Promise<void> => {
    await fetchUserData();
  };

  const value: AuthContextType = {
    user,
    session,
    loading: status === "loading" || loading,
    isAuthenticated: !!session && !!user,
    isAdmin: user?.is_superuser || false,
    isRecruiter: !!(user?.recruiter_profile?.status === "approved"),
    signIn,
    signOut,
    register,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
