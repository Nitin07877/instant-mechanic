"use client";

import { useRouter } from "next/navigation";
import { TableCell, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import type { Booking } from "@/lib/types";

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

export function BookingRow({ booking }: { booking: Booking }) {
  const router = useRouter();

  return (
    <TableRow
      onClick={() => router.push(`/bookings/${booking.id}`)}
      className="cursor-pointer hover:bg-accent/50"
    >
      <TableCell className="font-mono text-xs">{booking.id.slice(0, 8)}</TableCell>
      <TableCell>{booking.customer.name}</TableCell>
      <TableCell>{booking.vehicle}</TableCell>
      <TableCell>{booking.service.name}</TableCell>
      <TableCell>{booking.mechanic?.name ?? "—"}</TableCell>
      <TableCell><StatusBadge status={booking.status} /></TableCell>
      <TableCell className="text-right">{formatCurrency(booking.amount)}</TableCell>
      <TableCell className="text-muted-foreground">{formatDate(booking.scheduledAt)}</TableCell>
    </TableRow>
  );
}