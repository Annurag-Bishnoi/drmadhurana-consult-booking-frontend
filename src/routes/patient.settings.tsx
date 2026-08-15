import { createFileRoute } from "@tanstack/react-router";
import { PatientShell } from "@/components/site/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { useAuth } from "../hooks/useAuth";

export const Route = createFileRoute("/patient/settings")({
  head: () => ({ meta: [{ title: "Settings" }, { name: "robots", content: "noindex" }] }),
  component: Settings,
});
function Settings() {
  const { user } = useAuth();
  const rows = [
    { k: "Email notifications", d: "Receive booking updates in your inbox" },
    { k: "SMS reminders", d: "Get an SMS 30 minutes before appointments" },
    { k: "WhatsApp updates", d: "Consultation reminders on WhatsApp" },
    { k: "Marketing emails", d: "Occasional health tips from Prof. Dr. Rana" },
  ];
  return (
    <PatientShell title="Settings">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Details */}
        <Card className="border-border/60">
          <CardContent className="p-6">
            <h3 className="text-base font-semibold">Profile Details</h3>
            <div className="mt-4 space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Full Name</Label>
                <div className="font-medium">{user?.name || "Patient Name"}</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Email Address</Label>
                <div className="font-medium">{user?.email || "patient@example.com"}</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Role</Label>
                <div className="font-medium capitalize">{user?.role || "Patient"}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
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
      </div>
    </PatientShell>
  );
}
