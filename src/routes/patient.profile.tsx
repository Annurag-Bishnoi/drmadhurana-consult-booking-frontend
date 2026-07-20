import { createFileRoute } from "@tanstack/react-router";
import { PatientShell } from "@/components/site/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { patientProfile } from "@/data/mock";

export const Route = createFileRoute("/patient/profile")({
  head: () => ({ meta: [{ title: "Profile" }, { name: "robots", content: "noindex" }] }),
  component: Profile,
});
function Profile() {
  return (
    <PatientShell title="Profile">
      <Card className="border-border/60">
        <CardContent className="p-6">
          <h3 className="text-base font-semibold">Personal information</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <F label="Full name" value={patientProfile.name} />
            <F label="Email" value={patientProfile.email} />
            <F label="Phone" value={patientProfile.phone} />
            <F label="Age" value={String(patientProfile.age)} />
            <F label="Gender" value={patientProfile.gender} />
            <F label="City" value={patientProfile.city} />
          </div>
          <div className="mt-6 flex justify-end"><Button>Save changes</Button></div>
        </CardContent>
      </Card>
    </PatientShell>
  );
}
function F({ label, value }: { label: string; value: string }) {
  return <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">{label}</Label><Input defaultValue={value} /></div>;
}
