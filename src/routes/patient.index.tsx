import { createFileRoute, Link } from "@tanstack/react-router";
import { PatientShell } from "@/components/site/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { doctor, consultationTypeLabel } from "@/data/mock";
import { StatusBadge, TypeBadge } from "@/components/site/StatusBadge";
import { CalendarDays, MessageSquare, Video, Activity, ArrowRight } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/patient/")({
  head: () => ({ meta: [{ title: "Patient Dashboard" }, { name: "robots", content: "noindex" }] }),
  component: Overview,
});

function Overview() {
  const { user, getToken } = useAuth();
  const [mine, setMine] = useState<any[]>([]);

  useEffect(() => {
    fetch(import.meta.env.VITE_API_BASE_URL + "/api/appointments/me", {
      headers: { "Authorization": `Bearer ${getToken()}` }
    })
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a: any, b: any) => b.id - a.id);
        setMine(sorted);
      })
      .catch(() => {});
  }, [getToken]);

  const upcoming = mine.find((a) => a.status === "upcoming" || a.status === "in-progress");
  return (
    <PatientShell title="Overview">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Good morning, {user?.name?.split(" ")[0] || "there"}</h2>
        <p className="text-sm text-muted-foreground">Here's what's happening with your care today.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CalendarDays} label="Upcoming" value={String(mine.filter((a) => a.status === "upcoming").length)} />
        <StatCard icon={Activity} label="Total consultations" value={String(mine.length)} />
        <StatCard icon={MessageSquare} label="Active chats" value="1" />
        <StatCard icon={Video} label="Next appointment" value={upcoming?.time ?? "—"} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="border-border/60">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold">Upcoming consultation</h3>
              <Button asChild variant="ghost" size="sm"><Link to="/patient/consultations">View all <ArrowRight className="ml-1 h-3 w-3" /></Link></Button>
            </div>
            {upcoming ? (
              <div className="rounded-xl border border-border/60 bg-secondary/40 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm text-muted-foreground">{consultationTypeLabel(upcoming.type)} · {upcoming.id}</div>
                    <div className="mt-1 text-lg font-semibold">{doctor.name}</div>
                    <div className="text-sm text-muted-foreground">{upcoming.date} · {upcoming.time}</div>
                  </div>
                  <StatusBadge status={upcoming.status} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild size="sm"><Link to={upcoming.type === "chat" ? "/patient/chat" : upcoming.type === "voice" ? "/patient/voice" : "/patient/video"}>Join consultation</Link></Button>
                  <Button asChild size="sm" variant="outline"><Link to="/patient/consultations">View details</Link></Button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No upcoming consultation. <Link to="/book" className="text-primary underline-offset-2 hover:underline">Book one</Link></div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-6">
            <h3 className="mb-4 text-base font-semibold">Quick actions</h3>
            <div className="grid gap-3">
              <Button asChild variant="outline" className="justify-start"><Link to="/book">Book new consultation</Link></Button>
              <Button asChild variant="outline" className="justify-start"><Link to="/patient/chat">Message doctor</Link></Button>
              <Button asChild variant="outline" className="justify-start"><Link to="/patient/documents">Upload document</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-border/60">
        <CardContent className="p-6">
          <h3 className="mb-4 text-base font-semibold">Recent consultations</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr className="border-b border-border/60">
                  <th className="py-2 pr-4">Doctor</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4 text-right">Fee</th>
                </tr>
              </thead>
              <tbody>
                {mine.slice(0, 6).map((a) => (
                  <tr key={a.id} className="border-b border-border/40 last:border-0">
                    <td className="py-3 pr-4 font-medium">{doctor.name}</td>
                    <td className="py-3 pr-4"><TypeBadge type={a.type} /></td>
                    <td className="py-3 pr-4">{a.date} · {a.time}</td>
                    <td className="py-3 pr-4"><StatusBadge status={a.status} /></td>
                    <td className="py-3 pr-4 text-right">₹{a.fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </PatientShell>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">{label}</div>
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-4 w-4" /></span>
        </div>
        <div className="mt-2 text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}
