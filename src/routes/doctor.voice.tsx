import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DoctorShell } from "@/components/site/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { DailyMeetingComponent } from "@/components/DailyMeetingComponent";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/doctor/voice")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: search.id as string | undefined,
    url: search.url as string | undefined,
  }),
  head: () => ({ meta: [{ title: "Voice Consultations" }, { name: "robots", content: "noindex" }] }),
  component: DoctorVoice,
});

function DoctorVoice() {
  const { id, url } = Route.useSearch();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  
  const [notes, setNotes] = useState("");
  const [prescription, setPrescription] = useState("");
  const [activeTab, setActiveTab] = useState<"notes" | "prescription">("notes");
  const [history, setHistory] = useState<any[]>([]);
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/appointments/all`, {
      headers: { "Authorization": `Bearer ${getToken()}` }
    })
      .then(res => res.json())
      .then(data => {
        data.sort((a: any, b: any) => b.id - a.id);
        if (id) {
          const realId = id.replace("CONS-", "");
          const appt = data.find((a: any) => String(a.id) === realId);
          if (appt) {
            setNotes(appt.notes || "");
            setPrescription(appt.prescription || "");
          }
        }
        // Always populate history for doctor's overview
        setHistory(data.filter((a: any) => a.type === "voice" && a.status === "completed"));
      })
      .catch(() => {});
  }, [id, getToken]);


  const handleEndCall = async () => {
    try {
      if (id) {
        const realId = id.replace("CONS-", "");
        await fetch(`http://localhost:8080/api/appointments/${realId}/status?status=completed`, {
          method: "PUT",
          headers: { "Authorization": `Bearer ${getToken()}` }
        });
      }
      toast.success("Consultation completed");
      navigate({ to: "/doctor/appointments" });
    } catch (e) {
      navigate({ to: "/doctor/appointments" });
    }
  };

  if (!id || !url) {
    return (
      <DoctorShell title="Voice consultation">
        <div className="mb-6 rounded-lg border border-border/60 bg-card p-8 text-center text-muted-foreground shadow-sm">
          No active consultation selected.
        </div>
        <HistorySection history={history} onViewDetails={setSelectedConsultation} />
        <ConsultationDetailsDialog selected={selectedConsultation} onClose={() => setSelectedConsultation(null)} />
      </DoctorShell>
    );
  }

  return (
    <DoctorShell title={`Voice consultation — ${id}`}>
      <div className="grid h-[80vh] gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col">
          <DailyMeetingComponent 
            url={url} 
            audioOnly={true}
            onReadyToClose={handleEndCall}
          />
        </div>
        <div className="space-y-4">
          <Card className="flex-1 border-border/60 flex flex-col h-full"><CardContent className="p-5 flex flex-col h-full">
            <div className="flex gap-2 border-b border-border/60 pb-2 mb-3">
              <button onClick={() => setActiveTab("notes")} className={cn("text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded", activeTab === "notes" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted")}>Notes</button>
              <button onClick={() => setActiveTab("prescription")} className={cn("text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded", activeTab === "prescription" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted")}>Prescription</button>
            </div>
            
            {activeTab === "notes" ? (
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={12} className="flex-1 resize-none" placeholder="Add clinical notes..." />
            ) : (
              <Textarea value={prescription} onChange={(e) => setPrescription(e.target.value)} rows={12} className="flex-1 resize-none font-mono text-sm" placeholder="Rx..." />
            )}
            
            <div className="mt-3 flex gap-2">
              <Button variant="outline" className="w-full" onClick={async () => {
                if(!id) return;
                const realId = id.replace("CONS-", "");
                try {
                  const url = activeTab === "notes" ? `http://localhost:8080/api/appointments/${realId}/notes` : `http://localhost:8080/api/appointments/${realId}/prescription`;
                  const body = activeTab === "notes" ? { notes } : { prescription };
                  const res = await fetch(url, {
                    method: "PUT",
                    headers: { "Authorization": `Bearer ${getToken()}`, "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                  });
                  if (res.ok) toast.success(`${activeTab === "notes" ? "Notes" : "Prescription"} saved`);
                  else throw new Error();
                } catch(e) { toast.error("Failed to save"); }
              }}>Save {activeTab}</Button>
            </div>
          </CardContent></Card>
        </div>
      </div>
    </DoctorShell>
  );
}

function HistorySection({ history, onViewDetails }: { history: any[], onViewDetails: (a: any) => void }) {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  if (history.length === 0) return null;

  if (selectedPatient) {
    const patientHistory = history.filter(h => h.patient === selectedPatient);
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSelectedPatient(null)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold">{selectedPatient}'s Past Calls</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {patientHistory.map((a) => (
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
                <Button variant="outline" className="w-full" size="sm" onClick={() => onViewDetails(a)}>
                  <FileText className="mr-2 h-4 w-4" /> View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const patients = Array.from(new Set(history.map(h => h.patient)));

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Patients (Past Calls)</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {patients.map((p: any) => {
          const patientCalls = history.filter(h => h.patient === p);
          return (
            <Card key={p} className="border-border/60 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setSelectedPatient(p)}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar><AvatarFallback>{p.charAt(0)}</AvatarFallback></Avatar>
                  <div>
                    <div className="font-medium">{p}</div>
                    <div className="text-xs text-muted-foreground">{patientCalls.length} past call(s)</div>
                  </div>
                </div>
                <Button variant="outline" className="w-full" size="sm">
                  View History
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function ConsultationDetailsDialog({ selected, onClose }: { selected: any, onClose: () => void }) {
  return (
    <Dialog open={!!selected} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Consultation Details - CONS-{selected?.id} ({selected?.patient})</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          <div>
            <h4 className="font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wider">Clinical Notes</h4>
            <div className="rounded-md bg-muted/50 p-4 text-sm whitespace-pre-wrap min-h-[100px] border border-border/50">
              {selected?.notes || "No clinical notes were recorded for this consultation."}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wider">Prescription</h4>
            <div className="rounded-md bg-muted/50 p-4 font-mono text-sm whitespace-pre-wrap min-h-[150px] border border-border/50">
              {selected?.prescription || "No prescription was provided for this consultation."}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}