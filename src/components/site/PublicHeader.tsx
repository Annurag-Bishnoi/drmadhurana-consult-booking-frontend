import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Stethoscope } from "lucide-react";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
            <Stethoscope className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-foreground">Dr. Loverpreet Singh</div>
            <div className="text-[11px] text-muted-foreground">General &amp; Laparoscopic Surgeon</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-7 text-sm md:flex">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }} inactiveProps={{ className: "text-muted-foreground" }} className="hover:text-foreground">Home</Link>
          <Link to="/about" activeProps={{ className: "text-foreground" }} inactiveProps={{ className: "text-muted-foreground" }} className="hover:text-foreground">About</Link>
          <Link to="/services" activeProps={{ className: "text-foreground" }} inactiveProps={{ className: "text-muted-foreground" }} className="hover:text-foreground">Consultations</Link>
          <Link to="/patient" activeProps={{ className: "text-foreground" }} inactiveProps={{ className: "text-muted-foreground" }} className="hover:text-foreground">Patient</Link>
          <Link to="/doctor" activeProps={{ className: "text-foreground" }} inactiveProps={{ className: "text-muted-foreground" }} className="hover:text-foreground">Doctor</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link to="/book">Book Consultation</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}