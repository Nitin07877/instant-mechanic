import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MechanicStatus } from "@/lib/types";

const styles: Record<MechanicStatus, string> = {
  AVAILABLE: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  ON_JOB: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  OFF_DUTY: "bg-gray-100 text-gray-600 hover:bg-gray-100",
};

const labels: Record<MechanicStatus, string> = {
  AVAILABLE: "Available",
  ON_JOB: "On job",
  OFF_DUTY: "Off duty",
};

export function MechanicStatusBadge({ status }: { status: MechanicStatus }) {
  return <Badge className={cn("font-medium", styles[status])}>{labels[status]}</Badge>;
}