import { createFileRoute } from "@tanstack/react-router";
import { DoctorShell } from "@/components/site/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge, TypeBadge } from "@/components/site/StatusBadge";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export const Route = createFileRoute("/doctor/history")({
  head: () => ({ meta: [{ title: "Consultation History" }, { name: "robots", content: "noindex" }] }),
  component: History,
});
function History() {
  const { getToken } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/appointments/all", {
      headers: { "Authorization": `Bearer ${getToken()}` }
    })
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a: any, b: any) => b.id - a.id);
        setAppointments(sorted);
      })
      .catch(() => {});
  }, [getToken]);

  const rows = appointments.filter((a) => a.status === "completed" || a.status === "cancelled");
  return (
    <DoctorShell title="Consultation history">
      <Card className="border-border/60"><CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr><th className="px-4 py-3">Booking</th><th className="px-4 py-3">Patient</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Reason</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Fee</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-border/50">
                  <td className="px-4 py-3 font-medium">{r.id}</td>
                  <td className="px-4 py-3">{r.patient}</td>
                  <td className="px-4 py-3"><TypeBadge type={r.type} /></td>
                  <td className="px-4 py-3">{r.date} · {r.time}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.reason}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3 text-right">₹{r.fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent></Card>
    </DoctorShell>
  );
}