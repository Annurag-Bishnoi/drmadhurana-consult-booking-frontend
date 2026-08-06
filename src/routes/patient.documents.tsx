import { createFileRoute } from "@tanstack/react-router";
import { PatientShell } from "@/components/site/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Download, Eye } from "lucide-react";

export const Route = createFileRoute("/patient/documents")({
  head: () => ({ meta: [{ title: "Medical Documents" }, { name: "robots", content: "noindex" }] }),
  component: Docs,
});
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRef } from "react";

function Docs() {
  const { getToken } = useAuth();
  const [docs, setDocs] = useState<any[]>([]);
  const [previewDoc, setPreviewDoc] = useState<{name: string, data: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocs = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/documents", {
        headers: { "Authorization": `Bearer ${getToken()}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDocs(data);
      }
    } catch(e) {}
  };

  useEffect(() => {
    fetchDocs();
  }, [getToken]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = async () => {
          const base64Data = reader.result as string;
          const sizeStr = file.size > 1024 * 1024 
            ? (file.size / (1024 * 1024)).toFixed(1) + " MB" 
            : Math.round(file.size / 1024) + " KB";
            
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/documents`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${getToken()}`, "Content-Type": "application/json" },
            body: JSON.stringify({ name: file.name, size: sizeStr, data: base64Data })
          });
          if (res.ok) {
            toast.success("Document uploaded successfully");
            fetchDocs();
          } else {
            toast.error("Failed to upload document");
          }
        };
        reader.readAsDataURL(file);
      } catch(err) {
        toast.error("Upload failed");
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <PatientShell title="Medical documents">
      <Card className="border-border/60">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Your documents</h3>
              <p className="text-sm text-muted-foreground">Uploads are shared with your doctor during consultation.</p>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
            <Button onClick={handleUploadClick}><Upload className="mr-2 h-4 w-4" /> Upload</Button>
          </div>
          <div className="mt-6 divide-y divide-border/60 rounded-xl border border-border/60">
            {docs.map((d) => (
              <div key={d.id} className="flex items-center gap-4 px-4 py-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><FileText className="h-5 w-5" /></span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{d.name}</div>
                  <div className="text-xs text-muted-foreground">{d.size} · {d.date}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => setPreviewDoc({name: d.name, data: d.data})}><Eye className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
            {docs.length === 0 && <div className="p-8 text-center text-sm text-muted-foreground">No documents uploaded yet.</div>}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!previewDoc} onOpenChange={(o) => !o && setPreviewDoc(null)}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader><DialogTitle>{previewDoc?.name}</DialogTitle></DialogHeader>
          <div className="flex-1 rounded-lg border border-border/60 bg-muted/40 flex items-center justify-center relative overflow-hidden">
            {previewDoc?.data ? (
              previewDoc.name.toLowerCase().endsWith(".pdf") || previewDoc.data.includes("application/pdf") ? (
                <embed src={previewDoc.data} type="application/pdf" width="100%" height="100%" className="w-full h-full min-h-[60vh] border-0" />
              ) : (
                <img src={previewDoc.data} alt="preview" className="max-h-full max-w-full object-contain" />
              )
            ) : (
              <div className="text-center text-muted-foreground text-sm">No preview available for old documents.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </PatientShell>
  );
}
