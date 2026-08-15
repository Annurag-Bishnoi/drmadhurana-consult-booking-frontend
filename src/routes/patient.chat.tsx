import { createFileRoute, getRouteApi, useNavigate } from "@tanstack/react-router";
import { PatientShell } from "@/components/site/DashboardShell";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Paperclip, Smile, Send, Circle, FileText, Menu } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/patient/chat")({
  head: () => ({ meta: [{ title: "Chat Consultations" }, { name: "robots", content: "noindex" }] }),
  validateSearch: (search: Record<string, unknown>): { id?: string, url?: string } => ({
    id: search.id as string | undefined,
    url: search.url as string | undefined,
  }),
  component: ChatPage,
});

function ChatPage() {
  const { id } = Route.useSearch();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [activeId, setActiveId] = useState<string | undefined>(id);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [sidebarTab, setSidebarTab] = useState<"active" | "past">("active");
  const [previewDoc, setPreviewDoc] = useState<{name: string, data: string} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Poll for chat appointments
  useEffect(() => {
    let isMounted = true;
    const fetchAppointments = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/appointments/me", {
          headers: { "Authorization": `Bearer ${getToken()}` }
        });
        if (res.ok && isMounted) {
          const data = await res.json();
          const chatAppts = data.filter((a: any) => a.type === "chat");
          setAppointments(chatAppts);
          if (!activeId && chatAppts.length > 0) {
             setActiveId(`CONS-${chatAppts[0].id}`);
          }
        }
      } catch (e) {}
    };
    fetchAppointments();
    const int = setInterval(fetchAppointments, 5000);
    return () => { isMounted = false; clearInterval(int); };
  }, [getToken, activeId]);

  // Poll for messages of active chat
  useEffect(() => {
    if (!activeId) return;
    const realId = activeId.replace("CONS-", "");
    let isMounted = true;
    
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chat/${realId}`, {
          headers: { "Authorization": `Bearer ${getToken()}` }
        });
        if (res.ok && isMounted) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (e) {}
    };
    
    fetchMessages();
    const int = setInterval(fetchMessages, 3000);
    return () => { isMounted = false; clearInterval(int); };
  }, [activeId, getToken]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || !activeId) return;
    const realId = activeId.replace("CONS-", "");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chat/${realId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
      });
      if (res.ok) {
        const newMessage = await res.json();
        setMessages(prev => [...prev, newMessage]);
        setText("");
      }
    } catch (e) {
      toast.error("Failed to send message");
    }
  };

  const handleUploadClick = () => {
    if (!activeId) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeId) return;
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
            const realId = activeId.replace("CONS-", "");
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chat/${realId}`, {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${getToken()}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ text: `[DOCUMENT] ${file.name}|||${base64Data}` })
            });
          } else {
            toast.error("Failed to upload document");
          }
        };
        reader.readAsDataURL(file);
      } catch(err) {
        toast.error("Upload failed");
      }
    }
    // Reset the input so the same file can be uploaded again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const activeAppt = appointments.find(a => `CONS-${a.id}` === activeId);

  return (
    <PatientShell title="Chat consultation">
      <Card className="grid h-[70vh] grid-cols-1 overflow-hidden border-border/60 md:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-border/60 bg-sidebar md:flex md:flex-col min-h-0">
          <div className="p-4 border-b border-border/60">
            <div className="flex bg-muted/50 rounded-lg p-1">
              <button onClick={() => setSidebarTab("active")} className={cn("flex-1 text-xs font-medium py-1.5 rounded-md transition-colors", sidebarTab === "active" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>Active</button>
              <button onClick={() => setSidebarTab("past")} className={cn("flex-1 text-xs font-medium py-1.5 rounded-md transition-colors", sidebarTab === "past" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>Past</button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {appointments.filter(a => sidebarTab === "active" ? a.status !== "completed" : a.status === "completed").length === 0 && (
              <div className="p-4 text-sm text-muted-foreground text-center">No {sidebarTab} chats</div>
            )}
            {appointments
              .filter(a => sidebarTab === "active" ? a.status !== "completed" : a.status === "completed")
              .map((a) => {
              const currentId = `CONS-${a.id}`;
              const isActive = currentId === activeId;
              return (
                <button key={currentId} onClick={() => {
                  setActiveId(currentId);
                  navigate({ to: "/patient/chat", search: { id: currentId } });
                }} className={`flex w-full items-start gap-3 border-l-2 px-4 py-3 text-left transition-colors ${isActive ? "border-primary bg-primary/5" : "border-transparent hover:bg-muted/50"}`}>
                  <Avatar className="h-10 w-10"><AvatarFallback>DR</AvatarFallback></Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="truncate text-sm font-medium">{a.doctor || "Doctor"}</div>
                      <div className="text-[10px] text-muted-foreground">{a.date}</div>
                    </div>
                    <div className="truncate text-xs text-muted-foreground mt-0.5">Consultation {currentId}</div>
                    <div className="mt-0.5 truncate text-[11px] text-muted-foreground opacity-80">{a.reason}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
        
        {activeAppt ? (
          <section className="flex min-w-0 flex-col h-full overflow-hidden">
            <header className="flex shrink-0 items-center justify-between border-b border-border/60 px-4 py-3">
              <div className="flex items-center gap-3">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden -ml-2">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] p-0 flex flex-col">
                    <SheetTitle className="sr-only">Chat List</SheetTitle>
                    <div className="p-4 border-b border-border/60 shrink-0">
                      <div className="flex bg-muted/50 rounded-lg p-1">
                        <button onClick={() => setSidebarTab("active")} className={cn("flex-1 text-xs font-medium py-1.5 rounded-md transition-colors", sidebarTab === "active" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>Active</button>
                        <button onClick={() => setSidebarTab("past")} className={cn("flex-1 text-xs font-medium py-1.5 rounded-md transition-colors", sidebarTab === "past" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>Past</button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      {appointments.filter(a => sidebarTab === "active" ? a.status !== "completed" : a.status === "completed").length === 0 && (
                        <div className="p-4 text-sm text-muted-foreground text-center">No {sidebarTab} chats</div>
                      )}
                      {appointments.filter(a => sidebarTab === "active" ? a.status !== "completed" : a.status === "completed").map((a) => {
                        const currentId = `CONS-${a.id}`;
                        const isActive = currentId === activeId;
                        return (
                          <SheetTrigger asChild key={currentId}>
                            <button onClick={() => {
                              setActiveId(currentId);
                              navigate({ to: "/patient/chat", search: { id: currentId } });
                            }} className={`flex w-full items-start gap-3 border-l-2 px-4 py-3 text-left transition-colors ${isActive ? "border-primary bg-primary/5" : "border-transparent hover:bg-muted/50"}`}>
                              <Avatar className="h-10 w-10"><AvatarFallback>DR</AvatarFallback></Avatar>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <div className="truncate text-sm font-medium">{a.doctor || "Doctor"}</div>
                                  <div className="text-[10px] text-muted-foreground">{a.date}</div>
                                </div>
                                <div className="truncate text-xs text-muted-foreground mt-0.5">Consultation {currentId}</div>
                                <div className="mt-0.5 truncate text-[11px] text-muted-foreground opacity-80">{a.reason}</div>
                              </div>
                            </button>
                          </SheetTrigger>
                        );
                      })}
                    </div>
                  </SheetContent>
                </Sheet>
                <Avatar className="h-9 w-9 hidden sm:block"><AvatarFallback>DR</AvatarFallback></Avatar>
                <div className="leading-tight">
                  <div className="text-sm font-semibold">{activeAppt.doctor || "Doctor"}</div>
                  <div className="flex items-center gap-1 text-xs text-emerald-600"><Circle className="h-2 w-2 fill-emerald-500" /> Online</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">Consult {activeId} · {activeAppt.status === "completed" ? "Ended" : "Active"}</div>
            </header>
            <div className="flex-1 space-y-3 overflow-y-auto bg-muted/30 p-4">
              {messages.length === 0 && <div className="text-center text-sm text-muted-foreground mt-10">No messages yet. Send a message to start.</div>}
              {messages.map((m) => {
                const isDoc = m.text.startsWith("[DOCUMENT]");
                const docParts = isDoc ? m.text.replace("[DOCUMENT] ", "").split("|||") : [];
                const docName = docParts[0] || "";
                const docData = docParts[1] || "";
                
                return (
                  <div key={m.id} className={"flex " + (m.from === "patient" ? "justify-end" : "justify-start")}>
                    <div className={"max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm " + (m.from === "patient" ? "bg-primary text-primary-foreground" : "bg-card")}>
                      {isDoc ? (
                        <div onClick={() => setPreviewDoc({name: docName, data: docData})} className="flex items-center gap-2 rounded border border-border/30 bg-black/10 p-2 cursor-pointer hover:bg-black/20 transition-colors">
                          <FileText className="h-4 w-4" />
                          <span className="truncate">{docName}</span>
                        </div>
                      ) : (
                        <div>{m.text}</div>
                      )}
                      <div className={"mt-1 text-[10px] " + (m.from === "patient" ? "text-primary-foreground/70" : "text-muted-foreground")}>{m.time}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            <div className="shrink-0 border-t border-border/60 bg-card p-3">
              {activeAppt.status === "completed" ? (
                <div className="text-center text-sm text-muted-foreground py-2">Consultation has ended</div>
              ) : (
                <div className="flex items-center gap-2">
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                  <Button variant="ghost" size="icon" onClick={handleUploadClick}><Paperclip className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon"><Smile className="h-4 w-4" /></Button>
                  <Input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Type a message..." className="flex-1" />
                  <Button size="icon" onClick={sendMessage}><Send className="h-4 w-4" /></Button>
                </div>
              )}
            </div>
          </section>
        ) : (
          <section className="flex items-center justify-center bg-muted/10">
            <div className="text-muted-foreground">Select a chat to start messaging</div>
          </section>
        )}
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
