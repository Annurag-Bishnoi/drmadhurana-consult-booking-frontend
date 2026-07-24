import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicHeader } from "@/components/site/PublicHeader";
import { PublicFooter } from "@/components/site/PublicFooter";
import { doctor } from "@/data/mock";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, GraduationCap, Building2, CheckCircle2, Stethoscope, Activity, HeartPulse, ShieldPlus, Syringe, MessageSquarePlus, Star, Quote, BookOpen, ShieldCheck, Microscope } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Prof. Dr. Madhu Lata Rana — Surgeon Profile" },
      { name: "description", content: "Learn about Prof. Dr. Madhu Lata Rana, her qualifications, experience, awards and areas of expertise." },
      { property: "og:title", content: "About Prof. Dr. Madhu Lata Rana" },
      { property: "og:description", content: "Board-certified surgeon with 17+ years of experience." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:items-start">
          <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow">
            <img src={doctor.image} alt={doctor.name} className="aspect-[4/5] w-full object-cover" />
          </div>
          <div>
            <div className="text-sm font-medium text-primary">About the doctor</div>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">{doctor.name}</h1>
            <p className="mt-2 text-muted-foreground">{doctor.specialty} · {doctor.qualification}</p>
            <p className="mt-5 whitespace-pre-wrap leading-relaxed text-foreground">{doctor.bio}</p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <Stat label="Experience" value={doctor.experience} />
              <Stat label="Patients" value={doctor.patients} />
              <Stat label="Rating" value={`${doctor.rating}/5`} />
            </div>
            <div className="mt-8 flex gap-3">
              <Button asChild><Link to="/book">Book a Consultation</Link></Button>
              <Button asChild variant="outline"><Link to="/services">See consultations</Link></Button>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <Section title="Degrees & Qualifications" icon={GraduationCap}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
              {[
                { name: "MBBS", icon: BookOpen },
                { name: "MS (General Surgery)", icon: Microscope },
                { name: "FMAS", icon: ShieldCheck },
                { name: "FISCP", icon: Award }
              ].map((d) => (
                <div key={d.name} className="flex flex-col items-center justify-center gap-2.5 rounded-xl border border-border/50 bg-secondary/20 p-4 text-center transition-colors hover:border-primary/30 hover:bg-primary/5">
                  <d.icon className="h-6 w-6 text-primary/70" />
                  <span className="text-xs font-semibold text-foreground">{d.name}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Areas of Expertise" icon={Stethoscope}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { name: "General Surgery", icon: Stethoscope },
                { name: "Laparoscopic Surgery", icon: Activity },
                { name: "Gastrointestinal", icon: HeartPulse },
                { name: "Hernia Treatment", icon: ShieldPlus },
                { name: "Gallbladder", icon: Syringe },
                { name: "Post-op Care", icon: MessageSquarePlus }
              ].map((e) => (
                <div key={e.name} className="flex flex-col items-center justify-center gap-2.5 rounded-xl border border-border/50 bg-secondary/20 p-4 text-center transition-colors hover:border-primary/30 hover:bg-primary/5">
                  <e.icon className="h-6 w-6 text-primary/70" />
                  <span className="text-xs font-semibold text-foreground">{e.name}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Original Patient Reviews" icon={Quote}>
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/60 bg-secondary/10 p-8 text-center">
              <div className="mb-3 flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="h-5 w-5 fill-muted text-muted/30" />)}
              </div>
              <p className="text-base font-semibold text-foreground">Awaiting Reviews</p>
              <p className="mt-1.5 max-w-[250px] text-xs text-muted-foreground">
                Authentic patient experiences and ratings will be published here very soon.
              </p>
            </div>
          </Section>
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-secondary/40 p-3 text-center">
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-4 w-4" /></span>
          <h2 className="text-base font-semibold">{title}</h2>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
