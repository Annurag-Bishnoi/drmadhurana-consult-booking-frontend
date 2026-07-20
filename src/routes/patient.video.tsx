import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PatientShell } from "@/components/site/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { DailyMeetingComponent } from "@/components/DailyMeetingComponent";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/patient/video")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: search.id as string | undefined,
    url: search.url as string | undefined,
  }),
  head: () => ({ meta: [{ title: "Video Consultation" }, { name: "robots", content: "noindex" }] }),
  component: VideoPage,
});

function VideoPage() {
  const { id, url } = Route.useSearch();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("https://drmadhurana-consult-booking-backend-production.up.railway.app/api/appointments/me", {
          headers: { "Authorization": `Bearer ${getToken()}` }
        });
        if (res.ok) {
          const data = await res.json();
          setHistory(data.filter((a: any) => a.type === "video" && a.status === "completed"));
        }
      } catch (e) {}
    };
    fetchHistory();
  }, [getToken]);

  const handleEndCall = () => {
    toast.success("Left the consultation");
    navigate({ to: "/patient/consultations" });
  };

  if (!id || !url) {
    return (
      <PatientShell title="Video consultation">
        <div className="mb-6 rounded-lg border border-border/60 bg-card p-8 text-center text-muted-foreground shadow-sm">
          No active consultation selected.
        </div>
        <HistorySection history={history} onViewPrescription={setSelectedPrescription} />
        <PrescriptionDialog selected={selectedPrescription} onClose={() => setSelectedPrescription(null)} />
      </PatientShell>
    );
  }

  return (
    <PatientShell title={`Video consultation — ${id}`}>
      <div className="grid h-[80vh] gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col">
          <DailyMeetingComponent 
            url={url} 
            onReadyToClose={handleEndCall}
          />
        </div>
        <div className="space-y-4">
          <Card className="border-border/60">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold">Consultation info</h3>
              <div className="mt-3 space-y-2 text-sm">
                <Row k="ID" v={id} />
                <Row k="Type" v="Video" />
                <Row k="Status" v="In progress" />
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1 border-border/60">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold">Your notes</h3>
              <Textarea rows={8} className="mt-3" placeholder="Jot down questions to ask the doctor..." />
              <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => toast.success("Notes saved")}>Save notes</Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-8">
        <HistorySection history={history} onViewPrescription={setSelectedPrescription} />
      </div>
      <PrescriptionDialog selected={selectedPrescription} onClose={() => setSelectedPrescription(null)} />
    </PatientShell>
  );
}

function HistorySection({ history, onViewPrescription }: { history: any[], onViewPrescription: (a: any) => void }) {
  if (history.length === 0) return null;
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Call History</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {history.map((a) => (
          <Card key={a.id} className="border-border/60">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">CONS-{a.id}</div>
                  <div className="text-sm text-muted-foreground">{a.date} at {a.time}</div>
                </div>
                <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs text-primary">Completed</span>
              </div>
              <div className="text-sm text-muted-foreground truncate">{a.reason}</div>
              <Button variant="outline" className="w-full" size="sm" onClick={() => onViewPrescription(a)}>
                <FileText className="mr-2 h-4 w-4" /> View Prescription
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PrescriptionDialog({ selected, onClose }: { selected: any, onClose: () => void }) {
  return (
    <Dialog open={!!selected} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Prescription - CONS-{selected?.id}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 rounded-md bg-muted/50 p-4 font-mono text-sm whitespace-pre-wrap min-h-[200px]">
          {selected?.prescription || "No prescription was provided for this consultation."}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>;
}
