import { createFileRoute } from "@tanstack/react-router";
import { DoctorShell } from "@/components/site/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/doctor/settings")({
  head: () => ({ meta: [{ title: "Doctor Settings" }, { name: "robots", content: "noindex" }] }),
  component: DoctorSettings,
});
function DoctorSettings() {
  const rows = [
    { k: "Accept new chat consultations", d: "Show as available for chat" },
    { k: "Accept voice consultations", d: "Show as available for voice" },
    { k: "Accept video consultations", d: "Show as available for video" },
    { k: "Email notifications", d: "New bookings and cancellations" },
  ];
  return (
    <DoctorShell title="Settings">
      <Card className="border-border/60"><CardContent className="p-6">
        <h3 className="text-base font-semibold">Availability &amp; notifications</h3>
        <div className="mt-4 divide-y divide-border/60">
          {rows.map((r, i) => (
            <div key={r.k} className="flex items-center justify-between py-4">
              <div><Label className="text-sm">{r.k}</Label><div className="text-xs text-muted-foreground">{r.d}</div></div>
              <Switch defaultChecked={i !== 3} />
            </div>
          ))}
        </div>
      </CardContent></Card>
    </DoctorShell>
  );
}