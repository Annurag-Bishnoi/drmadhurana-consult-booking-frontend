import { createFileRoute, Link } from "@tanstack/react-router";
import { DoctorShell } from "@/components/site/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { earnings, patients, consultationTypeLabel } from "@/data/mock";
import { StatusBadge, TypeBadge } from "@/components/site/StatusBadge";
import { CalendarDays, Users, IndianRupee, Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/doctor/")({
  head: () => ({ meta: [{ title: "Doctor Dashboard" }, { name: "robots", content: "noindex" }] }),
  component: DoctorOverview,
});

function DoctorOverview() {
  const { user, getToken } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://drmadhurana-consult-booking-backend-production.up.railway.app/api/appointments/all", {
      headers: { "Authorization": `Bearer ${getToken()}` }
    })
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a: any, b: any) => b.id - a.id);
        setAppointments(sorted);
      })
      .catch(() => {});
  }, [getToken]);

  const today = appointments.filter((a) => a.date === new Date().toISOString().split('T')[0] || a.date === "2026-07-18"); // fallback to today or mock date if needed
  const upcoming = appointments.filter((a) => a.status === "upcoming").length;
  return (
    <DoctorShell title="Overview">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Welcome back, {user?.name || "Dr. Singh"}</h2>
        <p className="text-sm text-muted-foreground">You have {today.length} consultations scheduled today.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Activity} label="Today's consultations" value={String(today.length)} trend="+2 vs yesterday" />
        <Stat icon={CalendarDays} label="Upcoming appointments" value={String(upcoming)} trend="Next 7 days" />
        <Stat icon={Users} label="Total patients" value={patients.length.toLocaleString() + "48"} trend="+124 this month" />
        <Stat icon={IndianRupee} label="Monthly earnings" value={"₹" + earnings.month.toLocaleString("en-IN")} trend="+12% MoM" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="border-border/60"><CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold">Today's schedule</h3>
            <Button asChild variant="ghost" size="sm"><Link to="/doctor/appointments">View all <ArrowRight className="ml-1 h-3 w-3" /></Link></Button>
          </div>
          <ol className="relative space-y-4 border-l-2 border-border/60 pl-6">
            {today.map((a) => (
              <li key={a.id} className="relative">
                <span className="absolute -left-[29px] top-1 grid h-4 w-4 place-items-center rounded-full border-2 border-primary bg-background"><span className="h-1.5 w-1.5 rounded-full bg-primary" /></span>
                <div className="rounded-xl border border-border/60 bg-secondary/40 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-xs text-muted-foreground">{a.time} · {consultationTypeLabel(a.type)}</div>
                      <div className="text-sm font-semibold">{a.patient} · {a.age} · {a.gender}</div>
                      <div className="text-xs text-muted-foreground">{a.reason}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TypeBadge type={a.type} />
                      <StatusBadge status={a.status} />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </CardContent></Card>

        <Card className="border-border/60"><CardContent className="p-6">
          <h3 className="mb-4 text-base font-semibold">Earnings snapshot</h3>
          <div className="space-y-3">
            <BarRow label="Today" value={earnings.today} max={earnings.month / 5} />
            <BarRow label="This week" value={earnings.week} max={earnings.month} />
            <BarRow label="This month" value={earnings.month} max={earnings.month} />
          </div>
          <Button asChild variant="outline" className="mt-6 w-full"><Link to="/doctor/earnings">View earnings</Link></Button>
        </CardContent></Card>
      </div>
    </DoctorShell>
  );
}

function Stat({ icon: Icon, label, value, trend }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; trend: string }) {
  return (
    <Card className="border-border/60"><CardContent className="p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">{label}</div>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-4 w-4" /></span>
      </div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-emerald-600">{trend}</div>
    </CardContent></Card>
  );
}
function BarRow({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm"><span className="text-muted-foreground">{label}</span><span className="font-medium">₹{value.toLocaleString("en-IN")}</span></div>
      <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: pct + "%" }} /></div>
    </div>
  );
}
