import { createFileRoute } from "@tanstack/react-router";
import { DoctorShell } from "@/components/site/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { appointments, consultationTypeLabel, type AppointmentStatus, type ConsultationType } from "@/data/mock";
import { StatusBadge, TypeBadge } from "@/components/site/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/doctor/appointments")({
  head: () => ({ meta: [{ title: "Appointments" }, { name: "robots", content: "noindex" }] }),
  component: DoctorAppointments,
});

function DoctorAppointments() {
  const [date, setDate] = useState<Date | undefined>(new Date("2026-07-18"));
  const [tab, setTab] = useState<string>("all");
  const filtered = appointments.filter((a) => {
    if (tab === "all") return true;
    if (["chat", "voice", "video"].includes(tab)) return a.type === (tab as ConsultationType);
    return a.status === (tab as AppointmentStatus);
  });

  return (
    <DoctorShell title="Appointments">
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <Card className="border-border/60"><CardContent className="p-3">
          <Calendar mode="single" selected={date} onSelect={setDate} className={cn("pointer-events-auto p-2")} />
        </CardContent></Card>
        <Card className="border-border/60"><CardContent className="p-6">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="flex-wrap">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="voice">Voice</TabsTrigger>
              <TabsTrigger value="video">Video</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
            <TabsContent value={tab} className="mt-4 space-y-3">
              {filtered.map((a) => (
                <div key={a.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-xl border border-border/60 bg-secondary/30 p-4 sm:flex sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="truncate text-sm font-semibold">{a.patient}</div>
                      <TypeBadge type={a.type} />
                      <StatusBadge status={a.status} />
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{a.id} · {consultationTypeLabel(a.type)} · {a.date} at {a.time} · {a.reason}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">View</Button>
                    {a.status !== "completed" && a.status !== "cancelled" && <Button size="sm">Start</Button>}
                  </div>
                </div>
              ))}
              {filtered.length === 0 && <div className="py-10 text-center text-sm text-muted-foreground">No appointments.</div>}
            </TabsContent>
          </Tabs>
        </CardContent></Card>
      </div>
    </DoctorShell>
  );
}