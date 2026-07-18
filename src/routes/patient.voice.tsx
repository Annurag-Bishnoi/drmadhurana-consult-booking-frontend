import { createFileRoute } from "@tanstack/react-router";
import { PatientShell } from "@/components/site/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { doctor, appointments } from "@/data/mock";
import { Mic, MicOff, Volume2, PhoneOff, Circle } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/patient/voice")({
  head: () => ({ meta: [{ title: "Voice Consultation" }, { name: "robots", content: "noindex" }] }),
  component: Voice,
});

function Voice() {
  const [seconds, setSeconds] = useState(184);
  const [muted, setMuted] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const past = appointments.filter((a) => a.patientId === "P-1001" && a.type === "voice");
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return (
    <PatientShell title="Voice consultation">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="border-border/60">
          <CardContent className="flex flex-col items-center gap-6 p-10">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">On call</div>
            <Avatar className="h-32 w-32 ring-4 ring-primary/20"><AvatarImage src={doctor.image} /><AvatarFallback>DS</AvatarFallback></Avatar>
            <div className="text-center">
              <div className="text-xl font-semibold">{doctor.name}</div>
              <div className="mt-1 flex items-center justify-center gap-1 text-sm text-emerald-600"><Circle className="h-2 w-2 fill-emerald-500" /> Voice call · {mm}:{ss}</div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Button size="lg" variant={muted ? "default" : "outline"} className="h-14 w-14 rounded-full p-0" onClick={() => setMuted((m) => !m)}>
                {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              <Button size="lg" variant="outline" className="h-14 w-14 rounded-full p-0"><Volume2 className="h-5 w-5" /></Button>
              <Button size="lg" variant="destructive" className="h-14 rounded-full px-6"><PhoneOff className="mr-2 h-5 w-5" /> End call</Button>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card className="border-border/60">
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold">Consultation details</h3>
              <div className="mt-3 space-y-2 text-sm">
                <Row k="Type" v="Voice call" />
                <Row k="Duration" v="15 mins" />
                <Row k="Reason" v="Post-op follow-up" />
                <Row k="Booking" v="CONS-1026" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold">Call history</h3>
              <ul className="mt-3 space-y-3 text-sm">
                {past.map((p) => (
                  <li key={p.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{p.reason}</div>
                      <div className="text-xs text-muted-foreground">{p.date} · {p.time}</div>
                    </div>
                    <span className="text-xs text-muted-foreground">15 min</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </PatientShell>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>;
}