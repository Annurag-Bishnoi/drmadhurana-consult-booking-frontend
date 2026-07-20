import { Badge } from "@/components/ui/badge";
import type { AppointmentStatus, ConsultationType } from "@/data/mock";
import { MessageSquare, Phone, Video } from "lucide-react";

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  const map: Record<AppointmentStatus, string> = {
    upcoming: "bg-primary/10 text-primary border-primary/20",
    "in-progress": "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    completed: "bg-muted text-muted-foreground border-border",
    cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  };
  const label = status === "in-progress" ? "In progress" : status.charAt(0).toUpperCase() + status.slice(1);
  return <Badge variant="outline" className={map[status]}>{label}</Badge>;
}

export function TypeBadge({ type }: { type: ConsultationType }) {
  const Icon = type === "chat" ? MessageSquare : type === "voice" ? Phone : Video;
  const label = type === "chat" ? "Chat" : type === "voice" ? "Voice" : "Video";
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-0.5 text-xs">
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}
