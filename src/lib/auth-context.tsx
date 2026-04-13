"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { apiPost, apiFetch } from "@/lib/fetcher";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  studentProfile?: {
    id: string;
    studentId: string;
    class?: string;
    section?: string;
    batch?: string;
  };
  teacherProfile?: {
    id: string;
    teacherId: string;
    department?: string;
    designation?: string;
  };
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => void;
}

export interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: string;
  dateOfBirth?: string;
  guardianName?: string;
  guardianPhone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getTokenFromStorage(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const storedToken = getTokenFromStorage();
    if (storedToken) {
      apiFetch<{ user: AuthUser }>("/api/auth/me")
        .then((data) => {
          setUser(data.user);
          setToken(storedToken);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      // Use setTimeout to avoid synchronous setState in effect
      const id = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(id);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiPost<{ token: string; user: AuthUser }>("/api/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);

    const roleRoutes: Record<string, string> = {
      admin: "/dashboard/admin",
      teacher: "/dashboard/teacher",
      student: "/dashboard/student",
    };
    router.push(roleRoutes[data.user.role] || "/dashboard/admin");
  }, [router]);

  const register = useCallback(async (data: RegisterData) => {
    await apiPost("/api/auth/register", data);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    router.push("/auth/login");
  }, [router]);

  const updateProfile = useCallback((data: Partial<AuthUser>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
