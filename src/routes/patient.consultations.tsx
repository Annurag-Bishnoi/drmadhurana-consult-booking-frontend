import { createFileRoute } from "@tanstack/react-router";
import { PatientShell } from "@/components/site/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { appointments, doctor } from "@/data/mock";
import { StatusBadge, TypeBadge } from "@/components/site/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import type { Appointment } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/patient/consultations")({
  head: () => ({ meta: [{ title: "My Consultations" }, { name: "robots", content: "noindex" }] }),
  component: MyConsultations,
});

function MyConsultations() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [mine, setMine] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState<{id: string, text: string} | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAppointments = async () => {
      try {
        const token = getToken();
        const res = await fetch("http://localhost:8080/api/appointments/me", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok && isMounted) {
          const data = await res.json();
          const sortedData = data.sort((a: any, b: any) => b.id - a.id);
          setMine(sortedData.map((a: any) => ({
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
            meetingUrl: a.meetingUrl,
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
    
    // Poll every 3 seconds for real-time updates (e.g. when doctor starts call)
    const interval = setInterval(fetchAppointments, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [getToken]);

  const groups = {
    all: mine,
    upcoming: mine.filter((a) => a.status === "upcoming" || a.status === "in_progress"),
    completed: mine.filter((a) => a.status === "completed"),
    cancelled: mine.filter((a) => a.status === "cancelled"),
  };
  return (
    <PatientShell title="My Consultations">
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        {(Object.keys(groups) as (keyof typeof groups)[]).map((k) => (
          <TabsContent key={k} value={k} className="mt-4">
            <Card className="border-border/60">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">Booking</th>
                        <th className="px-4 py-3">Doctor</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Date &amp; Time</th>
                        <th className="px-4 py-3">Reason</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Fee</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">Loading...</td></tr>
                      ) : (
                        <>
                          {groups[k].map((a) => (
                            <tr key={a.id} className="border-t border-border/50">
                              <td className="px-4 py-3 font-medium">{a.id}</td>
                              <td className="px-4 py-3">{doctor.name}</td>
                              <td className="px-4 py-3"><TypeBadge type={a.type} /></td>
                              <td className="px-4 py-3">{a.date} · {a.time}</td>
                              <td className="px-4 py-3 text-muted-foreground">{a.reason}</td>
                              <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                              <td className="px-4 py-3 text-right">
                                {a.status === "in_progress" ? (
                                  a.type === "chat" ? (
                                    <Button size="sm" onClick={() => navigate({ to: `/patient/chat`, search: { id: a.id } })}>
                                      Join Chat
                                    </Button>
                                  ) : (
                                    <Button size="sm" onClick={() => navigate({ to: `/patient/${a.type}` as any, search: { id: a.id, url: a.meetingUrl } })}>
                                      Join Call
                                    </Button>
                                  )
                                ) : (
                                  a.prescription ? (
                                    <Button size="sm" variant="outline" onClick={() => setSelectedPrescription({id: a.id, text: a.prescription})}>
                                      View Rx
                                    </Button>
                                  ) : (
                                    `₹${a.fee}`
                                  )
                                )}
                              </td>
                            </tr>
                          ))}
                          {groups[k].length === 0 && (
                            <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">No consultations here yet.</td></tr>
                          )}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={!!selectedPrescription} onOpenChange={(o) => !o && setSelectedPrescription(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Prescription {selectedPrescription?.id}</DialogTitle></DialogHeader>
          <div className="rounded-lg border border-border/60 bg-muted/40 p-4 font-mono text-sm whitespace-pre-wrap">
            {selectedPrescription?.text || "No prescription available."}
          </div>
        </DialogContent>
      </Dialog>
    </PatientShell>
  );
}