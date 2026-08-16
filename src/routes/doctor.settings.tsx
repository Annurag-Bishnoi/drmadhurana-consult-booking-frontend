import { createFileRoute } from "@tanstack/react-router";
import { DoctorShell } from "@/components/site/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { X, Plus, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/doctor/settings")({
  head: () => ({ meta: [{ title: "Doctor Settings" }, { name: "robots", content: "noindex" }] }),
  component: DoctorSettings,
});

export const CLINIC_LOCATIONS = [
  "Rajpur Road Clinic",
  "Clement Town Clinic",
  "Prem Nagar Clinic",
  "Dharampur Clinic"
];

function DoctorSettings() {
  const { getToken } = useAuth();
  
  const [onlineSlots, setOnlineSlots] = useState<string[]>([]);
  const [locationSlots, setLocationSlots] = useState<Record<string, string>>({});
  
  const [activeTab, setActiveTab] = useState<string>("Online");
  const [newSlot, setNewSlot] = useState("");

  useEffect(() => {
    fetch(import.meta.env.VITE_API_BASE_URL + "/api/settings/all", {
      headers: { "Authorization": `Bearer ${getToken()}` }
    })
      .then(res => res.json())
      .then(data => {
        setOnlineSlots(data.availableTimeSlots || []);
        setLocationSlots(data.locationSlots || {});
      })
      .catch(() => toast.error("Failed to fetch settings"));
  }, []);

  const getCurrentSlots = () => {
    if (activeTab === "Online") return onlineSlots;
    const str = locationSlots[activeTab];
    return str ? str.split(",").map(s => s.trim()).filter(s => s) : [];
  };

  const handleAddSlot = () => {
    if (!newSlot.trim()) return;
    const slot = newSlot.trim();
    const current = getCurrentSlots();
    
    if (current.includes(slot)) {
      toast.error("Slot already exists");
      return;
    }

    if (activeTab === "Online") {
      setOnlineSlots([...current, slot]);
    } else {
      const updated = [...current, slot].join(", ");
      setLocationSlots({ ...locationSlots, [activeTab]: updated });
    }
    setNewSlot("");
  };

  const handleRemoveSlot = (slotToRemove: string) => {
    const current = getCurrentSlots();
    const filtered = current.filter(s => s !== slotToRemove);
    
    if (activeTab === "Online") {
      setOnlineSlots(filtered);
    } else {
      setLocationSlots({ ...locationSlots, [activeTab]: filtered.join(", ") });
    }
  };

  const saveSettings = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/settings/all", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({ 
          availableTimeSlots: onlineSlots,
          locationSlots: locationSlots
        })
      });
      if (!res.ok) throw new Error("Failed to save settings");
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Error saving settings");
    }
  };

  const rows = [
    { k: "Accept new chat consultations", d: "Show as available for chat" },
    { k: "Accept voice consultations", d: "Show as available for voice" },
    { k: "Accept video consultations", d: "Show as available for video" },
    { k: "Email notifications", d: "New bookings and cancellations" },
  ];
  
  return (
    <DoctorShell title="Settings">
      <div className="grid gap-6 md:grid-cols-[1fr_1.5fr]">
        <Card className="border-border/60 h-fit">
          <CardContent className="p-6">
            <h3 className="text-base font-semibold">Availability &amp; notifications</h3>
            <div className="mt-4 divide-y divide-border/60">
              {rows.map((r, i) => (
                <div key={r.k} className="flex items-center justify-between py-4">
                  <div><Label className="text-sm">{r.k}</Label><div className="text-xs text-muted-foreground">{r.d}</div></div>
                  <Switch defaultChecked={i !== 3} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold">Time Slots Management</h3>
                <div className="text-xs text-muted-foreground mt-1">Configure available booking slots for patients</div>
              </div>
              <Button size="sm" onClick={saveSettings}><Save className="mr-2 h-4 w-4" /> Save</Button>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 flex flex-wrap h-auto gap-1 bg-transparent p-0">
                <TabsTrigger value="Online" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-muted/50">Online Consultations</TabsTrigger>
                {CLINIC_LOCATIONS.map(loc => (
                  <TabsTrigger key={loc} value={loc} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-muted/50">{loc}</TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-0 outline-none">
                <div className="flex gap-2">
                  <Input 
                    value={newSlot} 
                    onChange={(e) => setNewSlot(e.target.value)} 
                    placeholder="e.g. 09:00 AM" 
                    onKeyDown={(e) => e.key === "Enter" && handleAddSlot()}
                  />
                  <Button onClick={handleAddSlot} variant="secondary"><Plus className="h-4 w-4" /></Button>
                </div>
                
                <div className="mt-6 flex flex-wrap gap-2">
                  {getCurrentSlots().length === 0 && <span className="text-sm text-muted-foreground">No slots configured for {activeTab}.</span>}
                  {getCurrentSlots().map(s => (
                    <Badge key={s} variant="outline" className="text-sm py-1 pl-3 pr-1 gap-1">
                      {s}
                      <button 
                        onClick={() => handleRemoveSlot(s)} 
                        className="rounded-full p-0.5 hover:bg-muted text-muted-foreground transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            
          </CardContent>
        </Card>
      </div>
    </DoctorShell>
  );
}
