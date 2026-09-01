"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { BookingStatus } from "@/lib/types";

const STATUS_OPTIONS: { value: BookingStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "ASSIGNED", label: "Assigned" },
  { value: "ON_THE_WAY", label: "On the way" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export function BookingStatusEditor({
  bookingId,
  initialStatus,
}: {
  bookingId: string;
  initialStatus: BookingStatus;
}) {
  const { user } = useAuth();
  const [status, setStatus] = useState<BookingStatus>(initialStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [, startTransition] = useTransition();

  async function handleChange(value: string | null) {
    if (!value || value === status) return;
    const next = value as BookingStatus;
    setSaving(true);
    setError(null);
    try {
      await api.updateBookingStatus(bookingId, next);
      setStatus(next);
      startTransition(() => router.refresh()); // re-sync server-rendered data below
    } catch {
      setError("Failed to update status");
    } finally {
      setSaving(false);
    }
  }

  if (user?.role !== "ADMIN") {
    return (
      <span className="inline-flex items-center rounded-md bg-muted px-3 py-1.5 text-sm font-medium">
        {STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={status} onValueChange={handleChange}>
        <SelectTrigger className="w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {saving && (
        <span className="text-xs text-muted-foreground">
          Saving...
        </span>
      )}

      {error && (
        <span className="text-xs text-destructive">
          {error}
        </span>
      )}
    </div>
  );
}