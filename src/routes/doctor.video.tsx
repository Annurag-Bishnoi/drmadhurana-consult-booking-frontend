import { createFileRoute } from "@tanstack/react-router";
import { DoctorShell } from "@/components/site/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Video as VideoIcon, MonitorUp, MessageSquare, PhoneOff, Circle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/doctor/video")({
  head: () => ({ meta: [{ title: "Video Consultations" }, { name: "robots", content: "noindex" }] }),
  component: DoctorVideo,
});
function DoctorVideo() {
  const [s, setS] = useState(451);
  useEffect(() => { const i = setInterval(() => setS((x) => x + 1), 1000); return () => clearInterval(i); }, []);
  const mm = String(Math.floor(s / 60)).padStart(2, "0"); const ss = String(s % 60).padStart(2, "0");
  return (
    <DoctorShell title="Video consultation — Ananya Iyer">
      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-slate-800 to-slate-950 shadow-lg">
            <div className="grid aspect-video w-full place-items-center text-white/60">
              <div className="text-center">
                <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-white/10 text-3xl font-semibold">AI</div>
                <div className="mt-3 text-sm">Ananya Iyer</div>
              </div>
            </div>
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-xs text-white backdrop-blur">
              <Circle className="h-2 w-2 fill-red-500 text-red-500" /> LIVE · {mm}:{ss}
            </div>
            <div className="absolute bottom-4 right-4 h-28 w-40 overflow-hidden rounded-lg border border-white/30 bg-slate-700 text-center text-xs text-white/80">
              <div className="grid h-full place-items-center bg-gradient-to-br from-slate-700 to-slate-900">Dr. Singh</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <RoundBtn icon={Mic} />
            <RoundBtn icon={VideoIcon} />
            <RoundBtn icon={MonitorUp} />
            <RoundBtn icon={MessageSquare} />
            <Button variant="destructive" className="h-12 rounded-full px-6"><PhoneOff className="mr-2 h-5 w-5" /> End consultation</Button>
          </div>
        </div>
        <div className="space-y-4">
          <Card className="border-border/60"><CardContent className="p-5">
            <h3 className="text-sm font-semibold">Patient details</h3>
            <div className="mt-3 space-y-2 text-sm">
              <Row k="Name" v="Ananya Iyer" />
              <Row k="Age / Gender" v="31 / Female" />
              <Row k="Reason" v="Gallbladder review" />
              <Row k="Appointment" v="11:30 AM" />
            </div>
          </CardContent></Card>
          <Card className="border-border/60"><CardContent className="p-5">
            <h3 className="text-sm font-semibold">Medical notes</h3>
            <Textarea rows={8} className="mt-3" placeholder="Add consultation notes..." defaultValue="USG shows a 6mm calculus. Symptomatic. Discussed laparoscopic cholecystectomy; patient agreeable. Scheduling pre-op workup." />
            <div className="mt-3 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => toast.success("Notes saved")}>Save</Button>
              <Button className="flex-1" onClick={() => toast.success("Consultation completed")}>Complete</Button>
            </div>
          </CardContent></Card>
        </div>
      </div>
    </DoctorShell>
  );
}
function RoundBtn({ icon: Icon }: { icon: React.ComponentType<{ className?: string }> }) {
  return <Button variant="outline" className="h-12 w-12 rounded-full p-0"><Icon className="h-5 w-5" /></Button>;
}
function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>;
}