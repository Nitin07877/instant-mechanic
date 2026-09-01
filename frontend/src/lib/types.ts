export type BookingStatus =
  | "PENDING"
  | "ASSIGNED"
  | "ON_THE_WAY"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type MechanicStatus = "AVAILABLE" | "ON_JOB" | "OFF_DUTY";

export interface DashboardStats {
  totalBookings: number;
  todaysBookings: number;
  completedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  activeMechanics: number;
  newCustomers: number;
}

export interface Booking {
  id: string;
  vehicle: string;
  status: BookingStatus;
  amount: number;
  scheduledAt: string;
  customer: { name: string; email: string };
  mechanic: { name: string } | null;
  service: { name: string; category: string };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface Mechanic {
  id: string;
  name: string;
  status: MechanicStatus;
  jobsCompleted: number;
  currentBooking: {
    id: string;
    status: BookingStatus;
    scheduledAt: string;
    vehicle: string;
  } | null;
}
export interface AnalyticsData {
  overTime: { date: string; bookings: number; revenue: number }[];
  statusBreakdown: { status: BookingStatus; count: number }[];
  categoryBreakdown: { category: string; count: number }[];
}
export interface BookingDetail {
  id: string;
  vehicle: string;
  status: BookingStatus;
  amount: number;
  scheduledAt: string;
  createdAt: string;
  updatedAt: string;
  customer: { id: string; name: string; email: string; phone: string };
  mechanic: { id: string; name: string; status: MechanicStatus } | null;
  service: { id: string; name: string; category: string };
}
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}