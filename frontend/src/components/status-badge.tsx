import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/lib/types";

const statusStyles: Record<BookingStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  ASSIGNED: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  ON_THE_WAY: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
  IN_PROGRESS: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  COMPLETED: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  CANCELLED: "bg-red-100 text-red-800 hover:bg-red-100",
};

const statusLabels: Record<BookingStatus, string> = {
  PENDING: "Pending",
  ASSIGNED: "Assigned",
  ON_THE_WAY: "On the way",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <Badge className={cn("font-medium", statusStyles[status])}>
      {statusLabels[status]}
    </Badge>
  );
}