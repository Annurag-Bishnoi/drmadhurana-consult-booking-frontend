import { createFileRoute } from "@tanstack/react-router";
import { PatientShell } from "@/components/site/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/patient/settings")({
  head: () => ({ meta: [{ title: "Settings" }, { name: "robots", content: "noindex" }] }),
  component: Settings,
});
function Settings() {
  const rows = [
    { k: "Email notifications", d: "Receive booking updates in your inbox" },
    { k: "SMS reminders", d: "Get an SMS 30 minutes before appointments" },
    { k: "WhatsApp updates", d: "Consultation reminders on WhatsApp" },
    { k: "Marketing emails", d: "Occasional health tips from Dr. Singh" },
  ];
  return (
    <PatientShell title="Settings">
      <Card className="border-border/60"><CardContent className="p-6">
        <h3 className="text-base font-semibold">Notification preferences</h3>
        <div className="mt-4 divide-y divide-border/60">
          {rows.map((r, i) => (
            <div key={r.k} className="flex items-center justify-between py-4">
              <div><Label className="text-sm">{r.k}</Label><div className="text-xs text-muted-foreground">{r.d}</div></div>
              <Switch defaultChecked={i < 3} />
            </div>
          ))}
        </div>
      </CardContent></Card>
    </PatientShell>
  );
}