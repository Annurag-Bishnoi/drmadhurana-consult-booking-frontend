import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Stethoscope, Bell, Search, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { doctor } from "@/data/mock";
import { useAuth } from "../../hooks/useAuth";

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
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <aside className="hidden w-64 shrink-0 border-r border-border/60 bg-sidebar md:flex md:flex-col sticky top-0 h-screen overflow-y-auto">
        <Link to="/" className="flex items-center gap-2 px-5 py-5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
            <Stethoscope className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold">Prof. Dr. Madhu</div>
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
        
        {/* Sidebar Footer with user avatar & logout button */}
        <div className="border-t border-border/60 p-4 space-y-3">
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
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full flex items-center justify-center gap-2 text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>
      
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md sm:px-6">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="-ml-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex h-full flex-col">
                  <Link to="/" className="flex items-center gap-2 border-b border-border/60 px-5 py-5">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Stethoscope className="h-5 w-5" />
                    </span>
                    <div className="leading-tight">
                      <div className="text-sm font-semibold">Prof. Dr. Madhu</div>
                      <div className="text-[11px] capitalize text-muted-foreground">{role} portal</div>
                    </div>
                  </Link>
                  <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
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
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground")
                          }
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
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
          
          <div className="flex items-center gap-2">
            <Avatar className="h-9 w-9">
              {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
              <AvatarFallback>{user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</AvatarFallback>
            </Avatar>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export function PatientShell({ title, children }: { title: string; children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "patient")) {
      navigate({ to: "/login", search: { redirect: pathname } });
    }
  }, [user, isLoading, navigate, pathname]);

  if (isLoading || !user || user.role !== "patient") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Checking session...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardShell
      title={title}
      role="patient"
      user={{ 
        name: user.name, 
        sub: user.email, 
        image: user.picture 
      }}
      items={patientNav}
    >
      {children}
    </DashboardShell>
  );
}

export function DoctorShell({ title, children }: { title: string; children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "doctor")) {
      navigate({ to: "/login", search: { redirect: pathname } });
    }
  }, [user, isLoading, navigate, pathname]);

  if (isLoading || !user || user.role !== "doctor") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Checking authorization...</p>
        </div>
      </div>
    );
  }

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
