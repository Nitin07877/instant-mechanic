"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "ALL", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "ASSIGNED", label: "Assigned" },
  { value: "ON_THE_WAY", label: "On the way" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

const SORT_OPTIONS = [
  { value: "scheduledAt:desc", label: "Newest first" },
  { value: "scheduledAt:asc", label: "Oldest first" },
  { value: "amount:desc", label: "Amount: high to low" },
  { value: "amount:asc", label: "Amount: low to high" },
];

export function BookingsToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // reset to page 1 on any filter change
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateParam("search", search);
  }

  const currentSort = `${searchParams.get("sortBy") ?? "scheduledAt"}:${searchParams.get("sortOrder") ?? "desc"}`;

  function handleExport() {
  const params = new URLSearchParams();
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  if (status && status !== "ALL") params.set("status", status);
  if (search) params.set("search", search);

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/export/csv?${params.toString()}`;
  window.open(url, "_blank");
}
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <form onSubmit={handleSearchSubmit} className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by customer, vehicle, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </form>

      <Select
  defaultValue={searchParams.get("status") ?? "ALL"}
  onValueChange={(v) => {
    if (v) updateParam("status", v);
  }}
>
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
  defaultValue={currentSort}
  onValueChange={(v) => {
    if (!v) return;
    const [sortBy, sortOrder] = v.split(":");
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);
    params.set("page", "1");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }}
>
        <SelectTrigger className="w-full sm:w-52">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" onClick={handleExport} className="w-full sm:w-auto">
  <Download className="h-4 w-4" />
  Export CSV
</Button>
    </div>
  );
}