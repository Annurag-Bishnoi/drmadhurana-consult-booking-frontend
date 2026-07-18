import { createFileRoute } from "@tanstack/react-router";
import { DoctorShell } from "@/components/site/DashboardShell";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { chatThreads } from "@/data/mock";
import { Send, Paperclip, Smile } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/doctor/chat")({
  head: () => ({ meta: [{ title: "Chat Consultations" }, { name: "robots", content: "noindex" }] }),
  component: DoctorChat,
});

function DoctorChat() {
  const ids = Object.keys(chatThreads);
  const [active, setActive] = useState(ids[0]);
  const thread = chatThreads[active];
  const [text, setText] = useState("");
  return (
    <DoctorShell title="Chat consultations">
      <Card className="grid h-[75vh] grid-cols-1 overflow-hidden border-border/60 md:grid-cols-[280px_1fr_300px]">
        <aside className="border-r border-border/60 bg-sidebar">
          <div className="p-4 text-xs uppercase tracking-wide text-muted-foreground">Active consultations</div>
          {ids.map((id) => {
            const t = chatThreads[id];
            const isActive = id === active;
            return (
              <button key={id} onClick={() => setActive(id)} className={cn("flex w-full items-start gap-3 border-l-2 px-4 py-3 text-left transition-colors", isActive ? "border-primary bg-primary/5" : "border-transparent hover:bg-muted/50")}>
                <Avatar className="h-10 w-10"><AvatarFallback>{t.patient.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="truncate text-sm font-medium">{t.patient}</div>
                    {t.unread > 0 && <span className="rounded-full bg-primary px-1.5 text-[10px] font-medium text-primary-foreground">{t.unread}</span>}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">{t.consultationId}</div>
                  <div className="truncate text-xs">{t.messages[t.messages.length - 1]?.text}</div>
                </div>
              </button>
            );
          })}
        </aside>
        <section className="flex min-w-0 flex-col">
          <header className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <div>
              <div className="text-sm font-semibold">{thread.patient}</div>
              <div className="text-xs text-muted-foreground">Consult {thread.consultationId}</div>
            </div>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-700">Active</span>
          </header>
          <div className="flex-1 space-y-3 overflow-y-auto bg-muted/30 p-4">
            {thread.messages.map((m) => (
              <div key={m.id} className={"flex " + (m.from === "doctor" ? "justify-end" : "justify-start")}>
                <div className={"max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm " + (m.from === "doctor" ? "bg-primary text-primary-foreground" : "bg-card")}>
                  <div>{m.text}</div>
                  <div className={"mt-1 text-[10px] " + (m.from === "doctor" ? "text-primary-foreground/70" : "text-muted-foreground")}>{m.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border/60 bg-card p-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon"><Paperclip className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><Smile className="h-4 w-4" /></Button>
              <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a reply..." className="flex-1" />
              <Button size="icon" onClick={() => setText("")}><Send className="h-4 w-4" /></Button>
            </div>
          </div>
        </section>
        <aside className="hidden flex-col border-l border-border/60 md:flex">
          <div className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Consultation notes</div>
            <Textarea rows={10} className="mt-3" placeholder="Add clinical notes..." defaultValue="Patient reports upper right quadrant pain 6/10 post meals. Advising USG whole abdomen; consider gallstones. Prescribed Pan-D 40mg 1-0-0 x 5 days." />
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success("Notes saved")}>Save</Button>
              <Button size="sm" className="flex-1" onClick={() => toast.success("Consultation completed")}>Complete</Button>
            </div>
          </div>
        </aside>
      </Card>
    </DoctorShell>
  );
}