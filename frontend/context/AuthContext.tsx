"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { login, signup, logout_user, get_all_users } from "@/utils/apiHelper";
import { useRouter } from "next/navigation";
import axios from "axios";

interface User {
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: any;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleSignup: (
    name: string,
    email: string,
    password: string,
    role: string
  ) => Promise<void>;
  logout: () => void;
  getAllusers: () => Promise<User[]>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8080";

  const logout = async () => {
    try {
      await logout_user();
    } catch (error) {
      console.error("Logout request failed:", error);
    }

    localStorage.removeItem("accessToken");
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);
    router.push("/");
  };

  const verifyToken = async (initial = false) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/refresh`,
        {},
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem("accessToken", data.accessToken);
        setAccessToken(data.accessToken);
        setIsAuthenticated(true);
        setUser(data.user);
        console.log("Token refreshed successfully");
      } else if (!initial) {
        logout();
      }
    } catch (error: any) {
      console.error("Token refresh failed:", error);
      if (!initial) {
        logout();
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);
      setIsAuthenticated(true); // Set to true initially if token exists
      verifyToken(true);
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const data = await login({ email, password });
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        setAccessToken(data.accessToken);
        setUser(data.user);
        setIsAuthenticated(true); // Ensure state is updated
        router.push("/dashboard");
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleSignup = async (
    name: string,
    email: string,
    password: string,
    role: string
  ) => {
    try {
      const data = await signup({ name, email, password, role });
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        setAccessToken(data.accessToken);
        setUser(data.user);
        setIsAuthenticated(true);
        router.push("/dashboard");
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const getAllusers = async () => {
    const data = await get_all_users();
   return data as User[];
  };
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      const interval = setInterval(() => verifyToken(), 50 * 1000); // 50 seconds
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, accessToken]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        accessToken,
        handleLogin,
        handleSignup,
        logout,
        getAllusers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
