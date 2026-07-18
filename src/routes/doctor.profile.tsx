import { createFileRoute } from "@tanstack/react-router";
import { DoctorShell } from "@/components/site/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { doctor } from "@/data/mock";

export const Route = createFileRoute("/doctor/profile")({
  head: () => ({ meta: [{ title: "Doctor Profile" }, { name: "robots", content: "noindex" }] }),
  component: DoctorProfile,
});
function DoctorProfile() {
  return (
    <DoctorShell title="Profile">
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <Card className="border-border/60"><CardContent className="p-6 text-center">
          <img src={doctor.image} className="mx-auto aspect-square w-40 rounded-2xl object-cover" alt={doctor.name} />
          <div className="mt-4 text-lg font-semibold">{doctor.name}</div>
          <div className="text-sm text-muted-foreground">{doctor.specialty}</div>
          <div className="mt-2 text-xs text-muted-foreground">{doctor.qualification}</div>
        </CardContent></Card>
        <Card className="border-border/60"><CardContent className="p-6">
          <h3 className="text-base font-semibold">About</h3>
          <p className="mt-2 text-sm text-muted-foreground">{doctor.bio}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <div className="mb-2 text-sm font-medium">Areas of expertise</div>
              <div className="flex flex-wrap gap-2">{doctor.expertise.map(e => <span key={e} className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs">{e}</span>)}</div>
            </div>
            <div>
              <div className="mb-2 text-sm font-medium">Hospitals</div>
              <ul className="space-y-1 text-sm text-muted-foreground">{doctor.hospitals.map(h => <li key={h}>· {h}</li>)}</ul>
            </div>
          </div>
        </CardContent></Card>
      </div>
    </DoctorShell>
  );
}