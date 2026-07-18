import { createFileRoute } from "@tanstack/react-router";
import { PatientShell } from "@/components/site/DashboardShell";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { doctor, chatThreads } from "@/data/mock";
import { Paperclip, Smile, Send, Circle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/patient/chat")({
  head: () => ({ meta: [{ title: "Chat" }, { name: "robots", content: "noindex" }] }),
  component: ChatPage,
});

function ChatPage() {
  const thread = chatThreads["P-1001"];
  const [text, setText] = useState("");
  return (
    <PatientShell title="Chat consultation">
      <Card className="grid h-[70vh] grid-cols-1 overflow-hidden border-border/60 md:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-border/60 bg-sidebar md:block">
          <div className="p-4 text-xs uppercase tracking-wide text-muted-foreground">Conversations</div>
          <button className="flex w-full items-start gap-3 border-l-2 border-primary bg-primary/5 px-4 py-3 text-left">
            <Avatar className="h-10 w-10"><AvatarImage src={doctor.image} /><AvatarFallback>DS</AvatarFallback></Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <div className="truncate text-sm font-medium">{doctor.name}</div>
                <div className="text-[10px] text-muted-foreground">now</div>
              </div>
              <div className="truncate text-xs text-muted-foreground">Consultation #{thread.consultationId}</div>
              <div className="mt-1 truncate text-xs">Any nausea, fever, or vomiting?</div>
            </div>
          </button>
        </aside>
        <section className="flex min-w-0 flex-col">
          <header className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9"><AvatarImage src={doctor.image} /><AvatarFallback>DS</AvatarFallback></Avatar>
              <div className="leading-tight">
                <div className="text-sm font-semibold">{doctor.name}</div>
                <div className="flex items-center gap-1 text-xs text-emerald-600"><Circle className="h-2 w-2 fill-emerald-500" /> Online</div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">Consult #{thread.consultationId} · Active</div>
          </header>
          <div className="flex-1 space-y-3 overflow-y-auto bg-muted/30 p-4">
            {thread.messages.map((m) => (
              <div key={m.id} className={"flex " + (m.from === "patient" ? "justify-end" : "justify-start")}>
                <div className={"max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm " + (m.from === "patient" ? "bg-primary text-primary-foreground" : "bg-card")}>
                  <div>{m.text}</div>
                  <div className={"mt-1 text-[10px] " + (m.from === "patient" ? "text-primary-foreground/70" : "text-muted-foreground")}>{m.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border/60 bg-card p-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon"><Paperclip className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><Smile className="h-4 w-4" /></Button>
              <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." className="flex-1" />
              <Button size="icon" onClick={() => setText("")}><Send className="h-4 w-4" /></Button>
            </div>
          </div>
        </section>
      </Card>
    </PatientShell>
  );
}