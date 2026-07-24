import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicHeader } from "@/components/site/PublicHeader";
import { PublicFooter } from "@/components/site/PublicFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { doctor, consultationTypeLabel, type ConsultationType } from "@/data/mock";

type Search = {
  id?: string; type?: ConsultationType; date?: string; time?: string; name?: string; fee?: number;
};

export const Route = createFileRoute("/booking-success")({
  head: () => ({ meta: [{ title: "Booking confirmed — Prof. Dr. Madhu Lata Rana" }, { name: "robots", content: "noindex" }] }),
  validateSearch: (s: Record<string, unknown>): Search => ({
    id: typeof s.id === "string" ? s.id : undefined,
    type: (["chat","voice","video"] as const).includes(s.type as ConsultationType) ? (s.type as ConsultationType) : undefined,
    date: typeof s.date === "string" ? s.date : undefined,
    time: typeof s.time === "string" ? s.time : undefined,
    name: typeof s.name === "string" ? s.name : undefined,
    fee: typeof s.fee === "number" ? s.fee : Number(s.fee) || undefined,
  }),
  component: Success,
});

function Success() {
  const s = Route.useSearch();
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <Card className="border-border/60">
          <CardContent className="p-8 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="mt-4 text-2xl font-semibold">Consultation booked successfully</h1>
            <p className="mt-2 text-sm text-muted-foreground">A confirmation has been sent to your email and phone.</p>
            <div className="mt-6 space-y-2 rounded-xl border border-border/60 bg-secondary/40 p-5 text-left text-sm">
              <Row k="Booking ID" v={s.id ?? "—"} />
              <Row k="Doctor" v={doctor.name} />
              <Row k="Type" v={s.type ? consultationTypeLabel(s.type) : "—"} />
              <Row k="Date" v={s.date ?? "—"} />
              <Row k="Time" v={s.time ?? "—"} />
              <Row k="Patient" v={s.name ?? "—"} />
              <Row k="Fee paid" v={`₹${s.fee ?? "—"}`} />
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild><Link to="/patient">Go to Patient Dashboard</Link></Button>
              <Button asChild variant="outline"><Link to="/patient/consultations">View booking details</Link></Button>
            </div>
          </CardContent>
        </Card>
      </section>
      <PublicFooter />
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between gap-4"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>;
}
