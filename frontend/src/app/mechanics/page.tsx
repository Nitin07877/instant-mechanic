import { api } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MechanicStatusBadge } from "@/components/mechanic-status-badge";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function MechanicsPage() {
  const { data: mechanics } = await api.getMechanics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Mechanics</h1>
        <p className="text-muted-foreground">{mechanics.length} mechanics on the team.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mechanics.map((m) => (
          <Card key={m.id}>
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <Avatar>
                <AvatarFallback>{initials(m.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium leading-none">{m.name}</p>
                <div className="mt-1.5">
                  <MechanicStatusBadge status={m.status} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Jobs completed</span>
                <span className="font-medium text-foreground">{m.jobsCompleted}</span>
              </div>
              {m.currentBooking ? (
                <div className="flex justify-between text-muted-foreground">
                  <span>Last booking</span>
                  <span className="font-medium text-foreground">
                    {m.currentBooking.vehicle} · {formatDate(m.currentBooking.scheduledAt)}
                  </span>
                </div>
              ) : (
                <p className="text-muted-foreground">No bookings yet</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}