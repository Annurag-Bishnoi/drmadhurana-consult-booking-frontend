import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicHeader } from "@/components/site/PublicHeader";
import { PublicFooter } from "@/components/site/PublicFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { doctor, consultationOptions } from "@/data/mock";
import { allReviews } from "@/data/reviews";
import {
  Star, Award, Users, ShieldCheck, MessageSquare, Phone, Video, ArrowRight, Clock, CheckCircle2,
  Stethoscope, Activity, HeartPulse, ShieldPlus, Syringe, MessageSquarePlus, MapPin,
} from "lucide-react";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <Hero />
      <Stats />
      <Services />
      <Expertise />
      <Testimonials />
      <CTA />
      <PublicFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-accent/20" />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.15fr_1fr] md:py-24">
        <div className="flex flex-col justify-center">
          <Badge variant="outline" className="w-fit border-primary/30 bg-primary/5 text-primary">
            <ShieldCheck className="mr-1 h-3 w-3" /> Verified &amp; certified surgeon
          </Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Consult with an <span className="text-primary">experienced surgeon</span>, from anywhere.
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Get trusted medical guidance from {doctor.name} through secure chat, voice, and video consultations — with real prescriptions and follow-ups.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/book">Book a Consultation <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/about">View Profile</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Digital prescription</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> 100% private</div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-tr from-primary/20 via-accent/40 to-primary/10 blur-2xl" />
          <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-xl">
            <img src={doctor.image} alt={doctor.name} width={1024} height={1280} className="aspect-[4/5] w-full object-cover" />
          </div>
          <div className="absolute -bottom-6 -left-6 w-64 rounded-2xl border border-border/60 bg-card p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Star className="h-5 w-5 fill-primary" />
              </div>
              <div>
                <div className="text-lg font-semibold leading-none">{doctor.rating}/5</div>
                <div className="text-xs text-muted-foreground">{doctor.reviews.toLocaleString()} patient reviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { icon: Award, label: "Years experience", value: "17+" },
    { icon: Users, label: "Patients consulted", value: "10000+" },
    { icon: Star, label: "Patient rating", value: "4.9/5" },
    { icon: ShieldCheck, label: "Board certified", value: "MBBS, MS, FMAS, FISCP" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm md:grid-cols-4">
        {items.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <s.icon className="h-5 w-5" />
            </span>
            <div>
              <div className="text-xl font-semibold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Services() {
  const opts = [consultationOptions.chat, consultationOptions.voice, consultationOptions.video, consultationOptions.physical];
  const icons = { chat: MessageSquare, voice: Phone, video: Video, physical: MapPin } as const;
  return (
    <section id="services" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-sm font-medium text-primary">Consultations</div>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Pick the way you want to consult</h2>
        <p className="mt-3 text-muted-foreground">Three ways to reach Dr. Rana — all secure, private and fully digital.</p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {opts.map((o) => {
          const Icon = icons[o.id];
          return (
            <Card key={o.id} className="group relative overflow-hidden border-border/60 transition-all hover:-translate-y-1 hover:shadow-xl">
              <CardContent className="flex h-full flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <Badge variant="outline">{o.duration}</Badge>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{o.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{o.description}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> {o.response}
                </div>
                <div className="mt-auto flex items-end justify-between pt-4">
                  <div>
                    <div className="text-2xl font-semibold">₹{o.fee} / ${o.feeUsd}</div>
                    <div className="text-xs text-muted-foreground">per consultation</div>
                  </div>
                  <Button asChild size="sm">
                    <Link to="/book" search={{ type: o.id }}>Book</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function Expertise() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="grid gap-10 rounded-3xl border border-border/60 bg-secondary/50 p-8 md:grid-cols-2 md:p-12">
        <div>
          <div className="text-sm font-medium text-primary">Areas of expertise</div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">Specialised care, backed by experience</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Prof. Dr. Madhu Lata Rana is a highly skilled surgeon with over 17 years of experience in safe, patient-centered care. She specializes in modern minimally invasive techniques, ensuring precision, faster recovery, and the best possible outcomes for her patients.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link to="/about">Read full profile <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { name: "General Surgery", icon: Stethoscope },
            { name: "Laparoscopic Surgery", icon: Activity },
            { name: "Gastrointestinal Surgery", icon: HeartPulse },
            { name: "Hernia Treatment", icon: ShieldPlus },
            { name: "Gallbladder Surgery", icon: Syringe },
            { name: "Post-op Consultation", icon: MessageSquarePlus }
          ].map((e) => (
            <li key={e.name} className="flex items-center gap-3 rounded-xl border border-border/50 bg-card px-3 py-2.5 transition-all hover:border-primary/30 hover:shadow-sm">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <e.icon className="h-4 w-4" />
              </span>
              <span className="text-sm font-medium text-foreground">{e.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = allReviews.slice(0, 3);
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">What patients say</h2>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {items.map((t) => (
          <Card key={t.name} className="border-border/60">
            <CardContent className="p-6">
              <div className="flex text-primary">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-primary" />)}</div>
              <p className="mt-3 text-sm text-foreground">"{t.text}"</p>
              <div className="mt-4 text-sm font-medium">{t.name}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Button variant="outline" asChild>
          <Link to="/about" hash="reviews">
            See all reviews
          </Link>
        </Button>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/70 px-8 py-12 text-primary-foreground shadow-xl md:px-14 md:py-16">
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Ready to talk to a surgeon today?</h2>
            <p className="mt-3 max-w-lg text-primary-foreground/85">Choose a time that suits you — most slots are available within a few hours.</p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Button asChild size="lg" variant="secondary"><Link to="/book">Book consultation</Link></Button>
          </div>
        </div>
      </div>
    </section>
  );
}
