"use client";

import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import type { DashboardStats } from "@/lib/types";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export function LiveStats({ initialData }: { initialData: DashboardStats }) {
  const { data: stats } = useSWR("dashboard-stats", api.getDashboard, {
    fallbackData: initialData,
    refreshInterval: 5000, // poll every 5s
    revalidateOnFocus: true,
  });

  const cards = [
    { label: "Total Bookings", value: stats.totalBookings },
    { label: "Today's Bookings", value: stats.todaysBookings },
    { label: "Completed", value: stats.completedBookings },
    { label: "Pending", value: stats.pendingBookings },
    { label: "Cancelled", value: stats.cancelledBookings },
    { label: "Total Revenue", value: formatCurrency(stats.totalRevenue) },
    { label: "Active Mechanics", value: stats.activeMechanics },
    { label: "New Customers (30d)", value: stats.newCustomers },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c) => (
        <Card key={c.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {c.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{c.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}