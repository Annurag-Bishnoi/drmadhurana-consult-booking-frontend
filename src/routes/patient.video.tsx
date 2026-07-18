import { createFileRoute } from "@tanstack/react-router";
import { PatientShell } from "@/components/site/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { doctor } from "@/data/mock";
import { Mic, Video as VideoIcon, MonitorUp, MessageSquare, PhoneOff, Circle } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/patient/video")({
  head: () => ({ meta: [{ title: "Video Consultation" }, { name: "robots", content: "noindex" }] }),
  component: VideoPage,
});

function VideoPage() {
  const [s, setS] = useState(312);
  useEffect(() => { const i = setInterval(() => setS((x) => x + 1), 1000); return () => clearInterval(i); }, []);
  const mm = String(Math.floor(s / 60)).padStart(2, "0"); const ss = String(s % 60).padStart(2, "0");
  return (
    <PatientShell title="Video consultation">
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-slate-900 to-slate-800 shadow-lg">
            <img src={doctor.image} alt={doctor.name} className="aspect-video w-full object-cover opacity-95" />
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-xs text-white backdrop-blur">
              <Circle className="h-2 w-2 fill-red-500 text-red-500" /> LIVE · {mm}:{ss}
            </div>
            <div className="absolute bottom-4 left-4 rounded-md bg-black/40 px-3 py-1 text-xs text-white backdrop-blur">{doctor.name}</div>
            <div className="absolute bottom-4 right-4 h-28 w-40 overflow-hidden rounded-lg border border-white/30 bg-slate-700 text-center text-xs text-white/80">
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900">You</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <IconBtn icon={Mic} />
            <IconBtn icon={VideoIcon} />
            <IconBtn icon={MonitorUp} />
            <IconBtn icon={MessageSquare} />
            <Button variant="destructive" className="h-12 rounded-full px-6"><PhoneOff className="mr-2 h-5 w-5" /> End call</Button>
          </div>
        </div>
        <div className="space-y-4">
          <Card className="border-border/60">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold">Consultation info</h3>
              <div className="mt-3 space-y-2 text-sm">
                <Row k="Patient" v="Rahul Sharma" />
                <Row k="Age" v="34" />
                <Row k="Reason" v="Gallbladder review" />
                <Row k="Appointment" v="11:30 AM" />
                <Row k="Status" v="In progress" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold">Your notes</h3>
              <Textarea rows={5} className="mt-3" placeholder="Jot down questions to ask the doctor..." />
              <Button variant="outline" size="sm" className="mt-3 w-full">Save notes</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PatientShell>
  );
}
function IconBtn({ icon: Icon }: { icon: React.ComponentType<{ className?: string }> }) {
  return <Button variant="outline" className="h-12 w-12 rounded-full p-0"><Icon className="h-5 w-5" /></Button>;
}
function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>;
}