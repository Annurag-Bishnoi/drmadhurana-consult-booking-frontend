import { createFileRoute } from "@tanstack/react-router";
import { DoctorShell } from "@/components/site/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { appointments, consultationTypeLabel, type AppointmentStatus, type ConsultationType } from "@/data/mock";
import { StatusBadge, TypeBadge } from "@/components/site/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "../hooks/useAuth";
import type { Appointment } from "@/data/mock";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/doctor/appointments")({
  head: () => ({ meta: [{ title: "Appointments" }, { name: "robots", content: "noindex" }] }),
  component: DoctorAppointments,
});

function DoctorAppointments() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [tab, setTab] = useState<string>("all");
  const [appointments, setAppointments] = useState<Appointment[] & { notes?: string, prescription?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAppointments = async () => {
      try {
        const token = getToken();
        const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/appointments/all", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok && isMounted) {
          const data = await res.json();
          const sortedData = data.sort((a: any, b: any) => b.id - a.id);
          setAppointments(sortedData.map((a: any) => ({
            id: `CONS-${a.id}`,
            patientId: String(a.patientId),
            patient: a.patient,
            age: a.age,
            type: a.type,
            date: a.date,
            time: a.time,
            status: a.status,
            reason: a.reason,
            fee: a.fee,
            notes: a.notes,
            prescription: a.prescription
          })));
        }
      } catch (error) {
        console.error("Failed to fetch appointments", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAppointments();

    const interval = setInterval(fetchAppointments, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [getToken]);

  const filtered = appointments.filter((a) => {
    if (tab === "all") return true;
    if (["chat", "voice", "video"].includes(tab)) return a.type === (tab as any);
    return a.status === (tab as any);
  });

  const startConsultation = async (id: string, type: string) => {
    try {
      const realId = id.replace("CONS-", "");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/appointments/${realId}/status?status=in_progress`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${getToken()}` }
      });
      if (!res.ok) throw new Error("Failed to update status");
      
      const data = await res.json();
      toast.success("Consultation started");
      const route = `/doctor/${type}` as any;
      navigate({ to: route, search: { id, url: data.meetingUrl } });
    } catch (error) {
      toast.error("Could not start consultation");
    }
  };

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
              {loading ? (
                <div className="py-10 text-center text-sm text-muted-foreground">Loading...</div>
              ) : (
                <>
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
                        <Button size="sm" variant="outline" onClick={() => setSelectedConsultation(a)}>View</Button>
                        {a.status !== "completed" && a.status !== "cancelled" && (
                          <Button size="sm" onClick={() => startConsultation(a.id, a.type)}>Start</Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {filtered.length === 0 && <div className="py-10 text-center text-sm text-muted-foreground">No appointments.</div>}
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent></Card>
      </div>
      <ConsultationDetailsDialog selected={selectedConsultation} onClose={() => setSelectedConsultation(null)} />
    </DoctorShell>
  );
}

function ConsultationDetailsDialog({ selected, onClose }: { selected: any, onClose: () => void }) {
  return (
    <Dialog open={!!selected} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Consultation Details - {selected?.id} ({selected?.patient})</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          <div>
            <h4 className="font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wider">Clinical Notes</h4>
            <div className="rounded-md bg-muted/50 p-4 text-sm whitespace-pre-wrap min-h-[100px] border border-border/50">
              {selected?.notes || "No clinical notes were recorded for this consultation."}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wider">Prescription</h4>
            <div className="rounded-md bg-muted/50 p-4 font-mono text-sm whitespace-pre-wrap min-h-[150px] border border-border/50">
              {selected?.prescription || "No prescription was provided for this consultation."}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
