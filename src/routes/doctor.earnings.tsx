import { createFileRoute } from "@tanstack/react-router";
import { DoctorShell } from "@/components/site/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { earnings } from "@/data/mock";
import { IndianRupee } from "lucide-react";

export const Route = createFileRoute("/doctor/earnings")({
  head: () => ({ meta: [{ title: "Earnings" }, { name: "robots", content: "noindex" }] }),
  component: Earnings,
});
function Earnings() {
  const maxM = Math.max(...earnings.monthly.map((m) => m.value));
  const totalBreak = earnings.breakdown.reduce((s, b) => s + b.value, 0);
  return (
    <DoctorShell title="Earnings">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Today" value={earnings.today} />
        <StatCard label="This week" value={earnings.week} />
        <StatCard label="This month" value={earnings.month} highlight />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card className="border-border/60"><CardContent className="p-6">
          <h3 className="text-base font-semibold">Monthly earnings</h3>
          <div className="mt-6 flex h-56 items-end gap-3">
            {earnings.monthly.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div className="w-full rounded-t-md bg-gradient-to-t from-primary/80 to-primary" style={{ height: `${(m.value / maxM) * 100}%` }} />
                </div>
                <div className="text-xs text-muted-foreground">{m.month}</div>
              </div>
            ))}
          </div>
        </CardContent></Card>
        <Card className="border-border/60"><CardContent className="p-6">
          <h3 className="text-base font-semibold">By consultation type</h3>
          <div className="mt-4 space-y-4">
            {earnings.breakdown.map((b) => {
              const pct = Math.round((b.value / totalBreak) * 100);
              return (
                <div key={b.type}>
                  <div className="mb-1 flex justify-between text-sm"><span>{b.type}</span><span className="font-medium">₹{b.value.toLocaleString("en-IN")} · {pct}%</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: pct + "%" }} /></div>
                </div>
              );
            })}
          </div>
        </CardContent></Card>
      </div>
    </DoctorShell>
  );
}
function StatCard({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <Card className={"border-border/60 " + (highlight ? "bg-primary text-primary-foreground" : "")}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between text-xs opacity-80">{label} <IndianRupee className="h-4 w-4" /></div>
        <div className="mt-2 text-3xl font-semibold">₹{value.toLocaleString("en-IN")}</div>
      </CardContent>
    </Card>
  );
}
