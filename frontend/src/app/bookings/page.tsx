import { api } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { BookingsToolbar } from "@/components/bookings-toolbar";
import { PaginationControls } from "@/components/pagination-controls";
import { BookingRow } from "@/components/booking-row";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1") || 1;

  const { data: bookings, pagination } = await api.getBookings({
    page,
    limit: 20,
    search: params.search,
    status: params.status,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder as "asc" | "desc" | undefined,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>
        <p className="text-muted-foreground">
          {pagination.total} total bookings across all mechanics.
        </p>
      </div>

      <BookingsToolbar />

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Mechanic</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Date/Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
  {bookings.length === 0 ? (
    <TableRow>
      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
        No bookings match your filters.
      </TableCell>
    </TableRow>
  ) : (
    bookings.map((b) => <BookingRow key={b.id} booking={b} />)
  )}
</TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <PaginationControls page={pagination.page} totalPages={pagination.totalPages} />
      </div>
    </div>
  );
}