import { api } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingStatusEditor } from "@/components/booking-status-editor";
import { MechanicStatusBadge } from "@/components/mechanic-status-badge";
import { ArrowLeft } from "lucide-react";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let booking;
  try {
    booking = await api.getBooking(id);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Link
        href="/bookings"
        className="inline-flex items-center gap-2 -ml-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to bookings
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{booking.vehicle}</h1>
          <p className="text-muted-foreground font-mono text-sm">{booking.id}</p>
        </div>
        <BookingStatusEditor bookingId={booking.id} initialStatus={booking.status} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Customer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-medium">{booking.customer.name}</p>
            <p className="text-sm text-muted-foreground">{booking.customer.email}</p>
            <p className="text-sm text-muted-foreground">{booking.customer.phone}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Mechanic</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {booking.mechanic ? (
              <>
                <p className="font-medium">{booking.mechanic.name}</p>
                <MechanicStatusBadge status={booking.mechanic.status} />
              </>
            ) : (
              <p className="text-muted-foreground">Not yet assigned</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-medium">{booking.service.name}</p>
            <p className="text-sm text-muted-foreground">{booking.service.category}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">{formatCurrency(booking.amount)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Scheduled for</span>
            <span>{formatDateTime(booking.scheduledAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created</span>
            <span>{formatDateTime(booking.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last updated</span>
            <span>{formatDateTime(booking.updatedAt)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}