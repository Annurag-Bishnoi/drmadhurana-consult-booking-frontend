import { createFileRoute } from "@tanstack/react-router";
import { DoctorShell } from "@/components/site/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Volume2, PhoneOff, Circle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/doctor/voice")({
  head: () => ({ meta: [{ title: "Voice Consultations" }, { name: "robots", content: "noindex" }] }),
  component: DoctorVoice,
});
function DoctorVoice() {
  const [s, setS] = useState(96);
  useEffect(() => { const i = setInterval(() => setS((x) => x + 1), 1000); return () => clearInterval(i); }, []);
  const mm = String(Math.floor(s / 60)).padStart(2, "0"); const ss = String(s % 60).padStart(2, "0");
  return (
    <DoctorShell title="Voice consultation — Amit Patel">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="border-border/60"><CardContent className="flex flex-col items-center gap-6 p-10">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">On call</div>
          <Avatar className="h-32 w-32 ring-4 ring-primary/20"><AvatarFallback className="text-2xl">AP</AvatarFallback></Avatar>
          <div className="text-center">
            <div className="text-xl font-semibold">Amit Patel</div>
            <div className="text-sm text-muted-foreground">45 · Male · Post-op follow-up</div>
            <div className="mt-2 flex items-center justify-center gap-1 text-sm text-emerald-600"><Circle className="h-2 w-2 fill-emerald-500" /> {mm}:{ss}</div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button size="lg" variant="outline" className="h-14 w-14 rounded-full p-0"><Mic className="h-5 w-5" /></Button>
            <Button size="lg" variant="outline" className="h-14 w-14 rounded-full p-0"><Volume2 className="h-5 w-5" /></Button>
            <Button size="lg" variant="destructive" className="h-14 rounded-full px-6"><PhoneOff className="mr-2 h-5 w-5" /> End call</Button>
          </div>
        </CardContent></Card>
        <Card className="border-border/60"><CardContent className="p-6">
          <h3 className="text-sm font-semibold">Consultation notes</h3>
          <Textarea rows={12} className="mt-3" placeholder="Add consultation notes..." defaultValue="Suture line healing well. No signs of infection. Advised warm compress twice daily and OPD review in 7 days." />
          <div className="mt-3 flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => toast.success("Notes saved")}>Save notes</Button>
            <Button className="flex-1" onClick={() => toast.success("Consultation completed")}>Complete</Button>
          </div>
        </CardContent></Card>
      </div>
    </DoctorShell>
  );
}