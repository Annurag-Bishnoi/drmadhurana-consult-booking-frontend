import { createFileRoute } from "@tanstack/react-router";
import { PatientShell } from "@/components/site/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Download } from "lucide-react";

export const Route = createFileRoute("/patient/documents")({
  head: () => ({ meta: [{ title: "Medical Documents" }, { name: "robots", content: "noindex" }] }),
  component: Docs,
});
const docs = [
  { name: "Blood Report — Jul 2026.pdf", size: "324 KB", date: "12 Jul" },
  { name: "Ultrasound Abdomen.pdf", size: "1.2 MB", date: "05 Jul" },
  { name: "Prescription CONS-1017.pdf", size: "128 KB", date: "12 Jul" },
  { name: "Discharge Summary.pdf", size: "512 KB", date: "20 Jun" },
];
function Docs() {
  return (
    <PatientShell title="Medical documents">
      <Card className="border-border/60">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Your documents</h3>
              <p className="text-sm text-muted-foreground">Uploads are shared with Dr. Singh during consultation.</p>
            </div>
            <Button><Upload className="mr-2 h-4 w-4" /> Upload</Button>
          </div>
          <div className="mt-6 divide-y divide-border/60 rounded-xl border border-border/60">
            {docs.map((d) => (
              <div key={d.name} className="flex items-center gap-4 px-4 py-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><FileText className="h-5 w-5" /></span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{d.name}</div>
                  <div className="text-xs text-muted-foreground">{d.size} · {d.date}</div>
                </div>
                <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PatientShell>
  );
}