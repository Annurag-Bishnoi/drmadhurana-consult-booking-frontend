import { useState, useEffect, createContext, useContext, ReactNode } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export type UserRole = "patient" | "doctor" | null;

export interface UserSession {
  name: string;
  email: string;
  role: UserRole;
  picture?: string;
}

interface AuthContextType {
  user: UserSession | null;
  loginWithToken: (token: string) => void;
  registerPatient: (name: string, email: string, password: string) => Promise<void>;
  loginPatient: (email: string, password: string) => Promise<void>;
  loginAdmin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getToken: () => string | null;
  isLoading: boolean;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function tokenToSession(token: string): UserSession | null {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;
  const role: UserRole = payload.role === "ADMIN" ? "doctor" : "patient";
  return {
    name: (payload.name as string) || "",
    email: (payload.email as string) || "",
    role,
    picture: (payload.picture as string) || undefined,
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("dr_madhu_token");
    if (token) {
      const session = tokenToSession(token);
      if (session) {
        setUser(session);
      } else {
        localStorage.removeItem("dr_madhu_token");
      }
    }
    // Also clear old auth key if present
    localStorage.removeItem("dr_madhu_auth");
    setIsLoading(false);
  }, []);

  const loginWithToken = (token: string) => {
    localStorage.setItem("dr_madhu_token", token);
    const session = tokenToSession(token);
    setUser(session);
  };

  const registerPatient = async (name: string, email: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");
    loginWithToken(data.token);
  };

  const loginPatient = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    loginWithToken(data.token);
  };

  const loginAdmin = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/auth/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Admin login failed");
    loginWithToken(data.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("dr_madhu_token");
  };

  const getToken = () => localStorage.getItem("dr_madhu_token");

  return (
    <AuthContext.Provider value={{ user, loginWithToken, registerPatient, loginPatient, loginAdmin, logout, getToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
