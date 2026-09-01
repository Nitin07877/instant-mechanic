const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${path}`);
  }
  return res.json();
}

import type {
  DashboardStats,
  PaginatedResponse,
  Booking,
  Mechanic,
  AnalyticsData,
  BookingDetail,
  AuthUser,
} from "./types";

export const api = {
  getDashboard: () => apiFetch<DashboardStats>("/api/dashboard"),

  getBookings: (params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== "") qs.set(k, String(v));
    });
    return apiFetch<PaginatedResponse<Booking>>(`/api/bookings?${qs.toString()}`);
  },

  getBooking: (id: string) => apiFetch<BookingDetail>(`/api/bookings/${id}`),

  updateBookingStatus: (id: string, status: string) =>
    fetch(`${API_URL}/api/bookings/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to update status");
      return res.json() as Promise<BookingDetail>;
    }),

    register: (name: string, email: string, password: string, role: string) =>
    fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to register");
      return data as { token: string; user: AuthUser };
    }),

  login: (email: string, password: string) =>
    fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to log in");
      return data as { token: string; user: AuthUser };
    }),

  getMe: (token: string) =>
    fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (res) => {
      if (!res.ok) throw new Error("Not authenticated");
      return res.json() as Promise<AuthUser>;
    }),

  getMechanics: () => apiFetch<{ data: Mechanic[] }>("/api/mechanics"),

  getAnalytics: () => apiFetch<AnalyticsData>("/api/analytics"),
};