import { createFileRoute } from "@tanstack/react-router";
import { DoctorShell } from "@/components/site/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { patients, appointments } from "@/data/mock";
import { TypeBadge } from "@/components/site/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const Route = createFileRoute("/doctor/patients")({
  head: () => ({ meta: [{ title: "Patients" }, { name: "robots", content: "noindex" }] }),
  component: DoctorPatients,
});

function DoctorPatients() {
  const [open, setOpen] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const list = patients.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  const selected = patients.find((p) => p.id === open);
  const selectedHistory = selected ? appointments.filter((a) => a.patientId === selected.id) : [];
  return (
    <DoctorShell title="Patients">
      <Card className="border-border/60"><CardContent className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search patients..." className="h-9 border-0 bg-transparent focus-visible:ring-0" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Age</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">Last consultation</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id} className="border-t border-border/50">
                  <td className="px-4 py-3">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.id}</div>
                  </td>
                  <td className="px-4 py-3">{p.age}</td>
                  <td className="px-4 py-3">{p.gender}</td>
                  <td className="px-4 py-3">{p.lastVisit}</td>
                  <td className="px-4 py-3"><TypeBadge type={p.lastType} /></td>
                  <td className="px-4 py-3">{p.status}</td>
                  <td className="px-4 py-3 text-right"><Button size="sm" variant="outline" onClick={() => setOpen(p.id)}>View</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent></Card>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{selected?.name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Info k="Patient ID" v={selected.id} />
              <Info k="Age" v={String(selected.age)} />
              <Info k="Gender" v={selected.gender} />
              <Info k="Status" v={selected.status} />
              <div className="sm:col-span-2">
                <div className="mb-2 text-sm font-medium">Consultation history</div>
                <div className="divide-y divide-border/60 rounded-lg border border-border/60">
                  {selectedHistory.map((h) => (
                    <div key={h.id} className="flex items-center justify-between px-4 py-2 text-sm">
                      <div>
                        <div className="font-medium">{h.reason}</div>
                        <div className="text-xs text-muted-foreground">{h.id} · {h.date} · {h.time}</div>
                      </div>
                      <TypeBadge type={h.type} />
                    </div>
                  ))}
                  {selectedHistory.length === 0 && <div className="p-4 text-center text-sm text-muted-foreground">No history yet.</div>}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DoctorShell>
  );
}
function Info({ k, v }: { k: string; v: string }) {
  return <div className="rounded-lg border border-border/60 bg-secondary/40 p-3"><div className="text-xs text-muted-foreground">{k}</div><div className="text-sm font-medium">{v}</div></div>;
}