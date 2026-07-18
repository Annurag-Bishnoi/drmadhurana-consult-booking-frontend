import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Stethoscope, Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { doctor } from "@/data/mock";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export function DashboardShell({
  title,
  role,
  user,
  items,
  children,
}: {
  title: string;
  role: "patient" | "doctor";
  user: { name: string; sub: string; image?: string };
  items: NavItem[];
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <aside className="hidden w-64 shrink-0 border-r border-border/60 bg-sidebar md:flex md:flex-col">
        <Link to="/" className="flex items-center gap-2 px-5 py-5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
            <Stethoscope className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold">Dr. Loverpreet</div>
            <div className="text-[11px] capitalize text-muted-foreground">{role} portal</div>
          </div>
        </Link>
        <nav className="flex-1 space-y-1 px-3 py-2">
          {items.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors " +
                  (active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground")
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border/60 p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
              <AvatarFallback>{user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 leading-tight">
              <div className="truncate text-sm font-medium">{user.name}</div>
              <div className="truncate text-[11px] text-muted-foreground">{user.sub}</div>
            </div>
          </div>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md sm:px-6">
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold">{title}</h1>
          </div>
          <div className="hidden items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 sm:flex">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="h-9 w-56 border-0 bg-transparent focus-visible:ring-0" />
          </div>
          <button className="grid h-9 w-9 place-items-center rounded-lg border border-border/60 bg-background text-muted-foreground hover:text-foreground">
            <Bell className="h-4 w-4" />
          </button>
          <Avatar className="h-9 w-9">
            {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
            <AvatarFallback>{user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</AvatarFallback>
          </Avatar>
        </header>
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export function PatientShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <DashboardShell
      title={title}
      role="patient"
      user={{ name: "Rahul Sharma", sub: "Patient · P-1001" }}
      items={patientNav}
    >
      {children}
    </DashboardShell>
  );
}

export function DoctorShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <DashboardShell
      title={title}
      role="doctor"
      user={{ name: doctor.name, sub: doctor.specialty, image: doctor.image }}
      items={doctorNav}
    >
      {children}
    </DashboardShell>
  );
}

import {
  LayoutDashboard, CalendarDays, MessageSquare, Phone, Video, FileText, User, Settings,
  Users, History, IndianRupee,
} from "lucide-react";

export const patientNav: NavItem[] = [
  { label: "Overview", to: "/patient", icon: LayoutDashboard },
  { label: "My Consultations", to: "/patient/consultations", icon: CalendarDays },
  { label: "Chat", to: "/patient/chat", icon: MessageSquare },
  { label: "Voice Calls", to: "/patient/voice", icon: Phone },
  { label: "Video Consultations", to: "/patient/video", icon: Video },
  { label: "Medical Documents", to: "/patient/documents", icon: FileText },
  { label: "Profile", to: "/patient/profile", icon: User },
  { label: "Settings", to: "/patient/settings", icon: Settings },
];

export const doctorNav: NavItem[] = [
  { label: "Overview", to: "/doctor", icon: LayoutDashboard },
  { label: "Appointments", to: "/doctor/appointments", icon: CalendarDays },
  { label: "Patients", to: "/doctor/patients", icon: Users },
  { label: "Chat Consultations", to: "/doctor/chat", icon: MessageSquare },
  { label: "Voice Consultations", to: "/doctor/voice", icon: Phone },
  { label: "Video Consultations", to: "/doctor/video", icon: Video },
  { label: "History", to: "/doctor/history", icon: History },
  { label: "Earnings", to: "/doctor/earnings", icon: IndianRupee },
  { label: "Profile", to: "/doctor/profile", icon: User },
  { label: "Settings", to: "/doctor/settings", icon: Settings },
];