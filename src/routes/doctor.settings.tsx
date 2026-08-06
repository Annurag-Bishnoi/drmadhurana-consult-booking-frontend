import { createFileRoute } from "@tanstack/react-router";
import { DoctorShell } from "@/components/site/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/doctor/settings")({
  head: () => ({ meta: [{ title: "Doctor Settings" }, { name: "robots", content: "noindex" }] }),
  component: DoctorSettings,
});

function DoctorSettings() {
  const { getToken } = useAuth();
  const [slots, setSlots] = useState<string[]>([]);
  const [newSlot, setNewSlot] = useState("");

  useEffect(() => {
    fetch(import.meta.env.VITE_API_BASE_URL + "/api/settings/slots")
      .then(res => res.json())
      .then(data => setSlots(data))
      .catch(() => toast.error("Failed to fetch slots"));
  }, []);

  const handleAddSlot = () => {
    if (!newSlot.trim()) return;
    if (slots.includes(newSlot.trim())) {
      toast.error("Slot already exists");
      return;
    }
    setSlots([...slots, newSlot.trim()]);
    setNewSlot("");
  };

  const handleRemoveSlot = (slotToRemove: string) => {
    setSlots(slots.filter(s => s !== slotToRemove));
  };

  const saveSlots = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/settings/slots", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({ slots })
      });
      if (!res.ok) throw new Error("Failed to save slots");
      toast.success("Time slots saved successfully!");
    } catch (error) {
      toast.error("Error saving time slots");
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
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/60">
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
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">Time Slots Management</h3>
                <div className="text-xs text-muted-foreground mt-1">Configure available booking slots for patients</div>
              </div>
              <Button size="sm" onClick={saveSlots}><Save className="mr-2 h-4 w-4" /> Save</Button>
            </div>
            
            <div className="mt-6">
              <div className="flex gap-2">
                <Input 
                  value={newSlot} 
                  onChange={(e) => setNewSlot(e.target.value)} 
                  placeholder="e.g. 09:00 AM" 
                  onKeyDown={(e) => e.key === "Enter" && handleAddSlot()}
                />
                <Button onClick={handleAddSlot} variant="secondary"><Plus className="h-4 w-4" /></Button>
              </div>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-2">
              {slots.length === 0 && <span className="text-sm text-muted-foreground">No slots configured.</span>}
              {slots.map(s => (
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
          </CardContent>
        </Card>
      </div>
    </DoctorShell>
  );
}
