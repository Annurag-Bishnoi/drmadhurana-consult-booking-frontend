import { createFileRoute } from "@tanstack/react-router";
import { PatientShell } from "@/components/site/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { appointments, doctor } from "@/data/mock";
import { StatusBadge, TypeBadge } from "@/components/site/StatusBadge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/patient/consultations")({
  head: () => ({ meta: [{ title: "My Consultations" }, { name: "robots", content: "noindex" }] }),
  component: MyConsultations,
});

function MyConsultations() {
  const mine = appointments.filter((a) => a.patientId === "P-1001");
  const groups = {
    all: mine,
    upcoming: mine.filter((a) => a.status === "upcoming" || a.status === "in-progress"),
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
                      {groups[k].map((a) => (
                        <tr key={a.id} className="border-t border-border/50">
                          <td className="px-4 py-3 font-medium">{a.id}</td>
                          <td className="px-4 py-3">{doctor.name}</td>
                          <td className="px-4 py-3"><TypeBadge type={a.type} /></td>
                          <td className="px-4 py-3">{a.date} · {a.time}</td>
                          <td className="px-4 py-3 text-muted-foreground">{a.reason}</td>
                          <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                          <td className="px-4 py-3 text-right">₹{a.fee}</td>
                        </tr>
                      ))}
                      {groups[k].length === 0 && (
                        <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">No consultations here yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </PatientShell>
  );
}