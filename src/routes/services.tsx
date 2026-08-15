import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicHeader } from "@/components/site/PublicHeader";
import { PublicFooter } from "@/components/site/PublicFooter";
import { consultationOptions } from "@/data/mock";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Phone, Video, CheckCircle2, MapPin } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Consultations — Prof. Dr. Madhu Lata Rana" },
      { name: "description", content: "Choose between chat, voice or video consultations. Transparent pricing, secure and private." },
      { property: "og:title", content: "Consultations" },
      { property: "og:description", content: "Chat, voice and video consultations with Prof. Dr. Madhu Lata Rana." },
    ],
  }),
  component: Services,
});

function Services() {
  const opts = [consultationOptions.chat, consultationOptions.voice, consultationOptions.video, consultationOptions.physical];
  const icons = { chat: MessageSquare, voice: Phone, video: Video, physical: MapPin } as const;
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-medium text-primary">Consultations</div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">Choose the consultation that fits you</h1>
          <p className="mt-3 text-muted-foreground">All consultations include digital prescription and 3 days of free follow-up chat.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {opts.map((o) => {
            const Icon = icons[o.id];
            return (
              <Card key={o.id} className="border-border/60">
                <CardContent className="flex h-full flex-col gap-4 p-6">
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
                    <Badge variant="outline">{o.duration}</Badge>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{o.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{o.description}</p>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> {o.response}</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Digital prescription</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> 3-day free follow-up</li>
                  </ul>
                  <div className="mt-auto flex items-end justify-between pt-4">
                    <div>
                      <div className="text-2xl font-semibold">₹{o.fee} / ${o.feeUsd}</div>
                      <div className="text-xs text-muted-foreground">per consultation</div>
                    </div>
                    <Button asChild><Link to="/book" search={{ type: o.id }}>Book {o.title.split(" ")[0]}</Link></Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}
