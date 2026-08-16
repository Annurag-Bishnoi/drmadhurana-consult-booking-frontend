import { createFileRoute } from "@tanstack/react-router";
import { DoctorShell } from "@/components/site/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, TypeBadge } from "@/components/site/StatusBadge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "../hooks/useAuth";
import type { Appointment } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Filter } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/doctor/inperson")({
  head: () => ({ meta: [{ title: "In-Person Appointments" }, { name: "robots", content: "noindex" }] }),
  component: DoctorInPerson,
});

function DoctorInPerson() {
  const { getToken } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [tab, setTab] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAppointments = async () => {
      try {
        const token = getToken();
        const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/appointments/all", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok && isMounted) {
          const data = await res.json();
          const sortedData = data.sort((a: any, b: any) => b.id - a.id);
          // Only show physical/in-person appointments
          setAppointments(sortedData.filter((a: any) => a.type === "physical").map((a: any) => ({
            id: `CONS-${a.id}`,
            patientId: String(a.patientId),
            patient: a.patient,
            age: a.age,
            type: a.type,
            date: a.date,
            time: a.time,
            status: a.status,
            reason: a.reason,
            fee: a.fee,
            clinicLocation: a.clinicLocation,
          })));
        }
      } catch (error) {
        console.error("Failed to fetch appointments", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAppointments();

    const interval = setInterval(fetchAppointments, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [getToken]);

  const uniqueLocations = Array.from(new Set(appointments.map(a => a.clinicLocation).filter(Boolean)));

  const filtered = appointments.filter((a) => {
    if (tab !== "all" && a.status !== tab) return false;
    if (locationFilter !== "all" && a.clinicLocation !== locationFilter) return false;
    if (date && a.date !== format(date, "yyyy-MM-dd")) return false;
    return true;
  });

  const markCompleted = async (id: string) => {
    try {
      const realId = id.replace("CONS-", "");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/appointments/${realId}/status?status=completed`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${getToken()}` }
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast.success("Appointment marked as completed");
    } catch (error) {
      toast.error("Could not update status");
    }
  };

  return (
    <DoctorShell title="In-Person Appointments">
      <div className="flex flex-col gap-6 lg:max-w-4xl mx-auto">
        <Card className="border-border/60">
          <CardHeader className="bg-secondary/20 pb-4 border-b border-border/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                Filters
              </CardTitle>
              <div className="flex flex-wrap items-center gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[200px] justify-start text-left font-normal bg-background",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="w-[200px] bg-background">
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {uniqueLocations.map(loc => (
                      <SelectItem key={loc} value={loc as string}>{loc as string}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {date && (
                  <Button variant="ghost" size="sm" onClick={() => setDate(undefined)} className="text-xs">
                    Clear Date
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="flex-wrap">
                <TabsTrigger value="all">All Status</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
              <TabsContent value={tab} className="mt-4 space-y-3">
                {loading ? (
                  <div className="py-10 text-center text-sm text-muted-foreground">Loading...</div>
                ) : (
                  <>
                    {filtered.map((a) => (
                      <div key={a.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-xl border border-border/60 bg-secondary/30 p-4 sm:flex sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="truncate text-sm font-semibold">{a.patient}</div>
                            <TypeBadge type={a.type} />
                            <StatusBadge status={a.status} />
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">{a.id} • {a.date} at {a.time} • Fee: ₹{a.fee}</div>
                          {a.clinicLocation && (
                            <div className="mt-1 text-xs font-medium text-primary">Location: {a.clinicLocation}</div>
                          )}
                          <div className="mt-1 text-xs text-muted-foreground truncate">Reason: {a.reason}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setSelected(a)}>View</Button>
                          {a.status === "upcoming" && (
                            <Button size="sm" onClick={() => markCompleted(a.id)}>Mark Completed</Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {filtered.length === 0 && <div className="py-10 text-center text-sm text-muted-foreground">No appointments match the filters.</div>}
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
              <span className="text-muted-foreground">ID:</span>
              <span className="font-medium">{selected?.id}</span>
              <span className="text-muted-foreground">Patient:</span>
              <span className="font-medium">{selected?.patient}</span>
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium capitalize">{selected?.status}</span>
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{selected?.date}</span>
              <span className="text-muted-foreground">Time:</span>
              <span className="font-medium">{selected?.time}</span>
              <span className="text-muted-foreground">Location:</span>
              <span className="font-medium text-primary">{selected?.clinicLocation || "Not specified"}</span>
              <span className="text-muted-foreground">Fee:</span>
              <span className="font-medium">₹{selected?.fee}</span>
              <span className="text-muted-foreground">Reason:</span>
              <span className="font-medium">{selected?.reason}</span>
            </div>
            <div className="text-xs text-muted-foreground pt-4 border-t border-border/50">
              Note: Clinical notes and prescriptions for in-person appointments are managed physically on paper.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DoctorShell>
  );
}
