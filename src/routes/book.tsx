import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PublicHeader } from "@/components/site/PublicHeader";
import { PublicFooter } from "@/components/site/PublicFooter";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { consultationOptions, doctor, type ConsultationType, consultationTypeLabel } from "@/data/mock";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { MessageSquare, Phone, Video, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";

type Search = { type?: ConsultationType };

export const Route = createFileRoute("/book")({
  head: () => ({ meta: [{ title: "Book a Consultation — Prof. Dr. Madhu Lata Rana" }] }),
  validateSearch: (s: Record<string, unknown>): Search => ({
    type: (["chat", "voice", "video"] as const).includes(s.type as ConsultationType) ? (s.type as ConsultationType) : undefined,
  }),
  component: Book,
});

function Book() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { user, isLoading, getToken } = useAuth();
  const [step, setStep] = useState(1);
  const [type, setType] = useState<ConsultationType>(search.type ?? "video");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("");
  const [currency, setCurrency] = useState<"INR" | "USD" | "GBP">("INR");
  const [region, setRegion] = useState<"India" | "Outside India">("India");
  const [duration, setDuration] = useState<number>(10);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", age: "", gender: "", reason: "", notes: "",
  });

  // Auto-detect region via IP
  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then(r => r.json())
      .then(data => {
        if (data.country_code !== "IN") {
          setRegion("Outside India");
          setCurrency("USD");
        } else {
          setRegion("India");
          setCurrency("INR");
        }
      })
      .catch(() => {});
  }, []);

  const handleCurrencyChange = (c: "INR" | "USD" | "GBP") => {
    setCurrency(c);
    setRegion(c === "INR" ? "India" : "Outside India");
  };

  useEffect(() => {
    if (!date) return;
    const dateStr = format(date, "yyyy-MM-dd");
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/settings/slots?date=${dateStr}`)
      .then(r => r.json())
      .then(data => {
        setAvailableTimeSlots(data || []);
        if (data && data.length > 0) {
          setTime(data[0]);
        } else {
          setTime("");
        }
      })
      .catch(() => {
        setAvailableTimeSlots([]);
        setTime("");
      });
  }, [date]);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      toast.error("Please login before booking a consultation", { id: "login-required" });
      navigate({ to: "/login", search: { redirect: "/book" } });
    }
  }, [isLoading, user, navigate]);

  // Pre-fill form from Google account details
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  const opt = consultationOptions[type];
  const isVideoOrVoice = type === "video" || type === "voice";
  const actualDuration = isVideoOrVoice ? duration : 10;
  const isIndia = region === "India";
  
  // Calculate Internal INR Base Fee
  const baseFee = isIndia
    ? (type === "video" ? 1000 : 500)
    : (type === "video" ? 2000 : 1000);
    
  // Calculate Internal INR Extra Fee
  const extraBlocks = Math.max(0, (actualDuration - 10) / 5);
  const extraFeePerBlock = isIndia ? 100 : 200;
  
  const inrFee = baseFee + (extraBlocks * extraFeePerBlock);
  
  // Display Fee calculation
  const finalFee = currency === "USD" ? Math.round(inrFee / 83) : currency === "GBP" ? Math.round(inrFee / 105) : inrFee;
  const symbol = currency === "USD" ? "$" : currency === "GBP" ? "£" : "₹";
  
  const getCardPrice = (cardId: string) => {
    const isSelected = type === cardId;
    const dur = isSelected ? actualDuration : 10; 
    const cBase = isIndia ? (cardId === "video" ? 1000 : 500) : (cardId === "video" ? 2000 : 1000);
    const cExtraBlocks = Math.max(0, (dur - 10) / 5);
    const cExtraFeePerBlock = isIndia ? 100 : 200;
    const cInr = cBase + (cExtraBlocks * cExtraFeePerBlock);
    return currency === "USD" ? Math.round(cInr / 83) : currency === "GBP" ? Math.round(cInr / 105) : cInr;
  };
  
  const icons = { chat: MessageSquare, voice: Phone, video: Video } as const;

  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const confirm = async () => {
    try {
      const token = getToken();
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          type: type,
          date: date ? format(date, "yyyy-MM-dd") : "",
          time: time,
          reason: form.reason || "General Consultation",
          fee: inrFee, // send backend internal fee (though it will recalculate)
          duration: actualDuration,
          currency: currency,
          region: region
        })
      });
      if (!res.ok) throw new Error("Failed to book appointment");
      const data = await res.json();
      
      toast.success("Consultation booked successfully");
      navigate({
        to: "/booking-success",
        search: {
          id: `CONS-${data.id}`, type, date: data.date, time: data.time,
          name: form.name || "Patient", fee: finalFee, currency
        },
      });
    } catch (error) {
      toast.error("Failed to book appointment. Please try again.");
    }
  };

  const canNext = () => {
    if (step === 1) return !!type;
    if (step === 2) return !!date && !!time;
    if (step === 3) return form.name && form.email && form.phone && form.age && form.gender && form.reason;
    return true;
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Book a consultation</h1>
          <p className="mt-1 text-muted-foreground">Four quick steps. Takes under a minute.</p>
        </div>
        <Stepper step={step} />

        <Card className="mt-6 border-border/60">
          <CardContent className="p-6 sm:p-8">
            {step === 1 && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                  <h2 className="text-lg font-semibold">Select consultation type</h2>
                  
                  <div className="flex items-center gap-2 text-sm border rounded-lg px-2 py-1 bg-muted/20">
                    <Label className="text-xs text-muted-foreground mr-1">Currency:</Label>
                    <button onClick={() => handleCurrencyChange("INR")} className={cn("text-xs px-2 py-1 rounded transition-colors", currency === "INR" ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted text-muted-foreground")}>₹</button>
                    <button onClick={() => handleCurrencyChange("USD")} className={cn("text-xs px-2 py-1 rounded transition-colors", currency === "USD" ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted text-muted-foreground")}>$</button>
                    <button onClick={() => handleCurrencyChange("GBP")} className={cn("text-xs px-2 py-1 rounded transition-colors", currency === "GBP" ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted text-muted-foreground")}>£</button>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {(Object.values(consultationOptions)).map((o) => {
                    const Icon = icons[o.id];
                    const active = type === o.id;
                    return (
                      <button
                        key={o.id}
                        onClick={() => setType(o.id)}
                        className={cn(
                          "rounded-2xl border p-5 text-left transition-all",
                          active ? "border-primary bg-primary/5 shadow-sm ring-2 ring-primary/20" : "border-border hover:border-primary/40 hover:bg-muted/40",
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className={cn("grid h-10 w-10 place-items-center rounded-xl", active ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary")}>
                            <Icon className="h-5 w-5" />
                          </span>
                          {active && <CheckCircle2 className="h-5 w-5 text-primary" />}
                        </div>
                        <div className="mt-4 text-base font-semibold">{o.title}</div>
                        <div className="text-xs text-muted-foreground">{o.description}</div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-lg font-semibold">
                            {symbol}{getCardPrice(o.id)}
                            {active && actualDuration > 10 ? (
                              <span className="text-xs font-normal text-muted-foreground"> / {actualDuration}m</span>
                            ) : (
                              <span className="text-xs font-normal text-muted-foreground"> / 10m</span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {isVideoOrVoice && (
                  <div className="mt-8 rounded-xl border border-border/60 bg-muted/20 p-5">
                    <h3 className="text-sm font-semibold mb-3">Select duration</h3>
                    <div className="flex flex-wrap gap-3">
                      {[10, 15, 20, 25, 30].map(mins => (
                        <button
                          key={mins}
                          onClick={() => setDuration(mins)}
                          className={cn(
                            "rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                            duration === mins ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/40 bg-background"
                          )}
                        >
                          {mins} minutes
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-lg font-semibold">Select date &amp; time</h2>
                <div className="mt-6 grid gap-8 md:grid-cols-2">
                  <div className="rounded-xl border border-border/60 bg-card p-2">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className={cn("pointer-events-auto p-3")}
                      disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Available slots</div>
                    <div className="text-xs text-muted-foreground">{date ? format(date, "EEEE, d MMM yyyy") : "Pick a date"}</div>
                    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {availableTimeSlots.map((t) => (
                        <button
                          key={t}
                          onClick={() => setTime(t)}
                          className={cn(
                            "rounded-lg border px-3 py-2 text-sm transition-colors",
                            time === t ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/40",
                          )}
                        >
                          {t}
                        </button>
                      ))}
                      {availableTimeSlots.length === 0 && (
                        <div className="col-span-full rounded-lg border border-dashed border-border/60 bg-secondary/20 p-6 text-center text-sm text-muted-foreground">
                          No slots available for this date.<br/>Please choose another day.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-lg font-semibold">Your details</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <Field label="Full name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Rahul Sharma" /></Field>
                  <Field label="Email"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></Field>
                  <Field label="Phone"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98xxx xxxxx" /></Field>
                  <Field label="Age"><Input value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="34" /></Field>
                  <Field label="Gender">
                    <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Reason for consultation"><Input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="e.g. Abdominal pain" /></Field>
                  <div className="md:col-span-2">
                    <Field label="Describe your concern (optional)">
                      <Textarea rows={4} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Add any relevant history, symptoms or reports info..." />
                    </Field>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-lg font-semibold">Confirm your booking</h2>
                <div className="mt-6 grid gap-6 md:grid-cols-[1.4fr_1fr]">
                  <div className="space-y-3 rounded-xl border border-border/60 bg-secondary/40 p-5 text-sm">
                    <Row k="Doctor" v={doctor.name} />
                    <Row k="Consultation" v={consultationTypeLabel(type)} />
                    <Row k="Date" v={date ? format(date, "EEE, d MMM yyyy") : "—"} />
                    <Row k="Time" v={time} />
                    <Row k="Duration" v={`${actualDuration} minutes`} />
                    <div className="border-t border-border/60 pt-3">
                      <Row k="Patient" v={form.name} />
                      <Row k="Contact" v={`${form.phone} · ${form.email}`} />
                      <Row k="Reason" v={form.reason} />
                    </div>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-card p-5">
                    <div className="text-sm text-muted-foreground">Total payable</div>
                    <div className="mt-1 text-3xl font-semibold">{symbol}{finalFee}</div>
                    <div className="mt-4 text-xs text-muted-foreground">Payment will be collected on confirmation. This is a prototype — no charge will be made.</div>
                    <Button className="mt-5 w-full" size="lg" onClick={confirm}>Confirm consultation</Button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between">
              <Button variant="outline" onClick={back} disabled={step === 1}><ArrowLeft className="mr-1 h-4 w-4" /> Back</Button>
              {step < 4 ? (
                <Button onClick={next} disabled={!canNext()}>Continue <ArrowRight className="ml-1 h-4 w-4" /></Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </section>
      <PublicFooter />
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  const labels = ["Type", "Schedule", "Details", "Confirm"];
  return (
    <ol className="flex flex-wrap items-center gap-2 text-sm">
      {labels.map((l, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;
        return (
          <li key={l} className="flex items-center gap-2">
            <span className={cn(
              "grid h-7 w-7 place-items-center rounded-full border text-xs font-medium",
              done ? "border-primary bg-primary text-primary-foreground" : active ? "border-primary text-primary" : "border-border text-muted-foreground",
            )}>{done ? "✓" : n}</span>
            <span className={cn(active ? "text-foreground" : "text-muted-foreground")}>{l}</span>
            {n < labels.length && <span className="mx-1 h-px w-6 bg-border sm:w-10" />}
          </li>
        );
      })}
    </ol>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-right font-medium">{v}</span>
    </div>
  );
}
