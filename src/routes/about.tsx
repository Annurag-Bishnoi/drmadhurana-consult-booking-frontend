import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicHeader } from "@/components/site/PublicHeader";
import { PublicFooter } from "@/components/site/PublicFooter";
import { doctor } from "@/data/mock";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, GraduationCap, Building2, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Dr. Loverpreet Singh — Surgeon Profile" },
      { name: "description", content: "Learn about Dr. Loverpreet Singh, his qualifications, experience, awards and areas of expertise." },
      { property: "og:title", content: "About Dr. Loverpreet Singh" },
      { property: "og:description", content: "Board-certified surgeon with 15+ years of experience." },
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
            <p className="mt-5 leading-relaxed text-foreground">{doctor.bio}</p>
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
          <Section title="Education" icon={GraduationCap}>
            <ul className="space-y-3">
              {doctor.education.map((e) => (
                <li key={e.degree} className="flex items-start justify-between rounded-lg border border-border/60 bg-secondary/40 p-3 text-sm">
                  <div>
                    <div className="font-medium">{e.degree}</div>
                    <div className="text-muted-foreground">{e.institute}</div>
                  </div>
                  <span className="text-muted-foreground">{e.year}</span>
                </li>
              ))}
            </ul>
          </Section>
          <Section title="Hospital Affiliations" icon={Building2}>
            <ul className="space-y-2">
              {doctor.hospitals.map((h) => (
                <li key={h} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary" /> {h}</li>
              ))}
            </ul>
          </Section>
          <Section title="Areas of Expertise" icon={CheckCircle2}>
            <div className="flex flex-wrap gap-2">
              {doctor.expertise.map((e) => (
                <span key={e} className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs">{e}</span>
              ))}
            </div>
          </Section>
          <Section title="Awards" icon={Award}>
            <ul className="space-y-2 text-sm">
              {doctor.awards.map((a) => (
                <li key={a} className="flex items-start gap-2"><Award className="mt-0.5 h-4 w-4 text-primary" /> {a}</li>
              ))}
            </ul>
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
